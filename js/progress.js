/* js/progress.js */
(function () {
  const TOPICS = {
    'ai-basics.html': 'ai-basics',
    'machine-learning.html': 'machine-learning',
    'deep-learning.html': 'deep-learning',
    'rag.html': 'rag',
    'ai-agents.html': 'ai-agents',
  };

  // Helper to read/write progress from localStorage
  function getProgress() {
    const data = localStorage.getItem('progressData');
    if (data) {
      try { return JSON.parse(data); } catch (_) { }
    }
    return { completed: [], streak: 0, lastDate: null };
  }

  function saveProgress(p) {
    localStorage.setItem('progressData', JSON.stringify(p));
  }

  // Update streak based on today (local user time) vs last recorded date
  function updateStreak(progress) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (progress.lastDate === today) {
      // same day, streak unchanged
      return progress.streak;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (progress.lastDate === yStr) {
      progress.streak = (progress.streak || 0) + 1; // continue chain
    } else {
      progress.streak = 1; // reset
    }
    progress.lastDate = today;
    return progress.streak;
  }

  // Mark a topic as completed (idempotent)
  function completeTopic(topicKey) {
    const progress = getProgress();
    if (!progress.completed.includes(topicKey)) {
      progress.completed.push(topicKey);
    }
    updateStreak(progress);
    saveProgress(progress);
    // Dispatch custom event so dashboard can react if already loaded
    document.dispatchEvent(new CustomEvent('progressUpdated'));
  }

  // Expose to global scope for other scripts (if needed)
  window.getProgress = getProgress;
  window.completeTopic = completeTopic;

  // Automatic detection: if current page is a known lesson, mark after a short timeout (e.g., 5s)
  const path = window.location.pathname.split('/').pop();
  const topicKey = TOPICS[path];
  if (topicKey) {
    // Wait 5 seconds to avoid false positives on quick bounces
    setTimeout(() => {
      completeTopic(topicKey);
    }, 5000);
  }
})();

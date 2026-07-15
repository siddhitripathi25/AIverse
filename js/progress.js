/* js/progress.js */
(function () {
  const TOPICS = {
    'ai-basics.html': 'ai-basics',
    'machine-learning.html': 'machine-learning',
    'deep-learning.html': 'deep-learning',
    'prompt-engineering.html': 'prompt-engineering',
    'rag.html': 'rag',
    'ai-agents.html': 'ai-agents',
  };

  const TOPIC_ORDER = ['ai-basics', 'machine-learning', 'deep-learning', 'prompt-engineering', 'rag', 'ai-agents'];

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

    // Update button if on the lesson page
    const btn = document.querySelector(`.mark-complete-btn[data-topic="${topicKey}"]`);
    if (btn) {
      btn.textContent = '✅ Completed!';
      btn.disabled = true;
      btn.style.background = '#00c853';
    }

    // Dispatch custom event so dashboard/homepage can react
    document.dispatchEvent(new CustomEvent('progressUpdated'));
  }

  // Reset all progress
  function resetProgress() {
    if (confirm('Are you sure you want to reset all your learning progress and streak?')) {
      const empty = { completed: [], streak: 0, lastDate: null };
      saveProgress(empty);
      document.dispatchEvent(new CustomEvent('progressUpdated'));
      alert('Progress has been reset.');
      window.location.reload();
    }
  }

  // Expose to global scope
  window.getProgress = getProgress;
  window.completeTopic = completeTopic;
  window.resetProgress = resetProgress;
  window.TOPIC_ORDER = TOPIC_ORDER;

  // Run on page load
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    const topicKey = TOPICS[path];

    // Set button state if already completed
    if (topicKey) {
      const progress = getProgress();
      if (progress.completed.includes(topicKey)) {
        const btn = document.querySelector(`.mark-complete-btn[data-topic="${topicKey}"]`);
        if (btn) {
          btn.textContent = '✅ Completed!';
          btn.disabled = true;
          btn.style.background = '#00c853';
        }
      }


    }
  });
})();

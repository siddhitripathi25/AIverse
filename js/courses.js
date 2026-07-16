/**
 * AIVerse - Course catalog (single source of truth for navigation)
 */
(function (global) {
  'use strict';

  var COURSES = [
    { id: 'ai-basics', label: 'AI Basics', href: 'ai-basics.html', available: true },
    { id: 'machine-learning', label: 'Machine Learning', href: 'machine-learning.html', available: true },
    { id: 'deep-learning', label: 'Deep Learning', href: 'deep-learning.html', available: true },
    { id: 'computer-vision', label: 'Computer Vision', href: 'computer-vision.html', available: true },
    { id: 'nlp', label: 'NLP', href: 'nlp.html', available: true },
    { id: 'prompt-engineering', label: 'Prompt Engineering', href: 'prompt-engineering.html', available: true },
    { id: 'rag', label: 'RAG', href: 'rag.html', available: true },
    { id: 'ai-agents', label: 'AI Agents', href: 'ai-agents.html', available: true },
    { id: 'reinforcement-learning', label: 'Reinforcement Learning', available: false },
    { id: 'python', label: 'Python', available: false },
    { id: 'llms', label: 'LLMs', available: false },
    { id: 'vector-databases', label: 'Vector Databases', available: false },
    { id: 'deployment', label: 'Deployment', available: false }
  ];

  var NAV_LINKS = [
    { label: 'Home', href: 'index.html' },
    { type: 'courses' },
    { label: 'Resources', href: 'resources.html' },
    { label: 'FAQ', href: 'faq.html' },
    { label: 'Contact', href: 'contact.html' },
    { label: 'Dashboard', href: 'dashboard.html' },
    { label: 'Progress', href: 'progress.html' }
  ];

  global.AIVerseCourses = {
    COURSES: COURSES,
    NAV_LINKS: NAV_LINKS
  };
})(typeof window !== 'undefined' ? window : this);

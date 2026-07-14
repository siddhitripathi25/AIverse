/**
 * AIVerse - Dark Mode Toggle
 * Saves user preference in localStorage
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aiverse-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  /**
   * Get the saved theme from localStorage
   */
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  /**
   * Apply theme to the document and update toggle icon
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  /**
   * Update the moon/sun icon on the toggle button
   */
  function updateToggleIcon(theme) {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (theme === DARK) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  /**
   * Initialize dark mode on page load
   */
  function init() {
    const savedTheme = getSavedTheme();
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Auto-detect and apply system theme preference
      applyTheme(systemPrefersDark.matches ? DARK : LIGHT);

      // Listen for system theme preference changes
      systemPrefersDark.addEventListener('change', (e) => {
        if (!getSavedTheme()) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }

    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

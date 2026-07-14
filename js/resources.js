/**
 * AIVerse - Resources Search & Filter
 * Enables real-time search and category filtering for learning resources
 */

(function () {
  'use strict';

  // DOM Elements
  const searchInput = document.getElementById('resource-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categorySections = document.querySelectorAll('.category-section');
  const resourceCards = document.querySelectorAll('.resource-card');
  const noResultsState = document.getElementById('no-results');
  const resetFiltersBtn = document.getElementById('reset-filters');

  let activeCategory = 'all';
  let searchQuery = '';

  /**
   * Filter and update display of resources
   */
  function filterResources() {
    const query = searchQuery.trim().toLowerCase();
    let totalVisible = 0;

    // Track visible count per category
    const categoryVisibleCounts = {
      books: 0,
      courses: 0,
      tools: 0
    };

    // First pass: Filter cards individually
    resourceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      // Extract text content for search matching
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      const tagElement = card.querySelector('.resource-tag');
      const tag = tagElement ? tagElement.textContent.toLowerCase() : '';

      // Check category match
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      // Check search query match (matches title, tags/keywords, or description)
      const matchesQuery = !query || 
                           title.includes(query) || 
                           tag.includes(query) || 
                           description.includes(query);

      const isVisible = matchesCategory && matchesQuery;

      if (isVisible) {
        card.classList.remove('hidden');
        if (categoryVisibleCounts[cardCategory] !== undefined) {
          categoryVisibleCounts[cardCategory]++;
        }
        totalVisible++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Second pass: Update visibility of category sections (heading + grid)
    categorySections.forEach(section => {
      const sectionCategory = section.getAttribute('data-section');
      const hasVisibleCards = categoryVisibleCounts[sectionCategory] > 0;
      
      // The section should only show if:
      // 1. It belongs to the active category (or active category is 'all')
      // 2. AND it has at least one visible card matching the search query
      const shouldShowSection = (activeCategory === 'all' || activeCategory === sectionCategory) && hasVisibleCards;

      if (shouldShowSection) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Handle empty state visibility
    if (totalVisible === 0) {
      noResultsState.style.display = 'flex';
    } else {
      noResultsState.style.display = 'none';
    }
  }

  /**
   * Handle Search Input Changes
   */
  function handleSearchInput(e) {
    searchQuery = e.target.value;
    
    // Show/hide clear button
    if (searchQuery.trim().length > 0) {
      clearSearchBtn.style.display = 'flex';
    } else {
      clearSearchBtn.style.display = 'none';
    }

    filterResources();
  }

  /**
   * Clear Search input
   */
  function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    filterResources();
  }

  /**
   * Handle Category Button Clicks
   */
  function handleCategoryClick(e) {
    const clickedBtn = e.currentTarget;
    const filterValue = clickedBtn.getAttribute('data-filter');

    // Update active class on buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    activeCategory = filterValue;
    filterResources();
  }

  /**
   * Reset all search queries and category filters to default state
   */
  function resetAllFilters() {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    
    // Reset category to "all"
    activeCategory = 'all';
    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    filterResources();
    searchInput.focus();
  }

  /**
   * Initialize Event Listeners
   */
  function init() {
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', clearSearch);
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', handleCategoryClick);
    });

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    // Support escaping the search input with Keyboard Escape
    if (searchInput) {
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          clearSearch();
        }
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * AIVerse - Main JavaScript
 * Handles navigation, scroll effects, and interactions
 */

(function () {
  'use strict';

  /* ==========================================
     Courses Dropdown
     ========================================== */
  function initCoursesDropdown() {
    var dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;

    var toggle = dropdown.querySelector('.dropdown-toggle');
    var menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    var closeTimer = null;
    var isDesktop = function () {
      return window.matchMedia('(min-width: 1024px)').matches;
    };

    function openDropdown() {
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeDropdown, 150);
    }

    if (isDesktop()) {
      dropdown.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        openDropdown();
      });

      dropdown.addEventListener('mouseleave', scheduleClose);

      menu.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
      });

      menu.addEventListener('mouseleave', scheduleClose);
    }

    toggle.addEventListener('click', function (e) {
      if (isDesktop()) return;
      e.preventDefault();
      e.stopPropagation();
      if (dropdown.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (dropdown.classList.contains('is-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      }
      if (e.key === 'Escape') {
        closeDropdown();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    window.addEventListener('resize', function () {
      closeDropdown();
    });
  }

  /* ==========================================
     Mobile Navigation Toggle
     ========================================== */
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    // Ensure nav-menu has an id so aria-controls can reference it
    if (!navMenu.id) {
      navMenu.id = 'nav-menu';
    }

    // Defensively initialize aria-expanded and aria-controls on every page
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', navMenu.id);

    function closeMenu() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      navToggle.classList.add('active');
      navMenu.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a nav link or dropdown item is clicked
    navMenu.addEventListener('click', function (e) {
      var link = e.target.closest('.nav-link:not(.dropdown-toggle), .dropdown-item:not(.is-disabled)');
      if (link) {
        closeMenu();
      }
    });

    // Close menu when Escape key is pressed (keyboard accessibility)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close menu when tapping outside of it on mobile
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ==========================================
     Sticky Header on Scroll
     ========================================== */
  function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ==========================================
     Active Navigation Link
     Highlights current page in navbar
     ========================================== */
  function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    const dropdownItems = document.querySelectorAll('.dropdown-item:not(.is-disabled)');
    const coursesToggle = document.querySelector('.dropdown-toggle');
    var isCoursePage = false;

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    dropdownItems.forEach(function (item) {
      const href = item.getAttribute('href');
      if (href === currentPage) {
        item.classList.add('active');
        isCoursePage = true;
      }
    });

    if (isCoursePage && coursesToggle) {
      coursesToggle.classList.add('active');
    }
  }

  /* ==========================================
     Smooth Scrolling for Anchor Links
     ========================================== */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ==========================================
     Back to Top Button
     ========================================== */
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================
     Scroll Reveal Animations
     Uses Intersection Observer API
     ========================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================
     Newsletter Form (frontend only)
     ========================================== */
  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        alert('Thank you for subscribing! You will receive AI learning updates at ' + emailInput.value);
        emailInput.value = '';
      }
    });
  }

  /* ==========================================
     Contact Form (frontend only)
     ========================================== */
  function initContactForm() {
    const form = document.querySelector('.contact-form form');
    const successMsg = document.querySelector('.form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      // Basic validation - could be improved (medium OSS issue)
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill in all fields.');
        return;
      }

      if (successMsg) {
        successMsg.classList.add('show');
      }

      form.reset();

      setTimeout(function () {
        if (successMsg) {
          successMsg.classList.remove('show');
        }
      }, 5000);
    });
  }

  /* ==========================================
     Initialize All Features
     ========================================== */
  function init() {
    initCoursesDropdown();
    initMobileNav();
    initStickyHeader();
    initActiveNavLink();
    initSmoothScroll();
    initBackToTop();
    initScrollReveal();
    initNewsletter();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

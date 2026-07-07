/**
 * AIVerse - Main JavaScript
 * Handles navigation, scroll effects, and interactions
 */

(function () {
  'use strict';

  /* ==========================================
     Mobile Navigation Toggle
     ========================================== */
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
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
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
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

const formInputt = document.querySelector('.form-input');
const newsLetter = document.querySelector('.newsletter');
if (formInputt) {
  const errorMsg = document.createElement('p');
  errorMsg.className = 'newsletter-error';
  errorMsg.style.color = 'red';
  errorMsg.style.marginTop = '0.5rem';
  errorMsg.style.minHeight = '1.25rem';
  errorMsg.style.visibility = 'hidden';
  formInputt.insertAdjacentElement('afterend', errorMsg);

  formInputt.addEventListener('input', () => {
    const value = formInputt.value.trim();
    if (value && !formInputt.checkValidity()) {
      errorMsg.textContent = 'Please enter a valid email address...';
      errorMsg.style.visibility = 'visible';
    } else {
      errorMsg.textContent = '';
      errorMsg.style.visibility = 'hidden';
    }
  });
}


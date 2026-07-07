/**
 * AIVerse - FAQ Accordion
 * Expand/collapse FAQ items with smooth animation
 */

(function () {
  'use strict';

  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');

      if (!question) return;
question.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    question.click();
  }
});
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });

      // Set initial ARIA attributes
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();

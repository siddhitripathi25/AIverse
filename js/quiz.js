/**
 * AIVerse - Interactive Mini-Quiz
 * Handles quiz state, option selection, submit, scoring, and feedback.
 */

(function () {
  'use strict';

  function initQuiz() {
    const quizContainer = document.getElementById('mini-quiz');
    if (!quizContainer) return;

    const steps = quizContainer.querySelectorAll('.quiz-progress .step');
    const questions = quizContainer.querySelectorAll('.quiz-question');
    const options = quizContainer.querySelectorAll('.quiz-option');
    const submitBtn = document.getElementById('quiz-submit-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const retryBtn = document.getElementById('quiz-retry-btn');
    const feedbackBox = quizContainer.querySelector('.quiz-feedback-box');
    const feedbackText = quizContainer.querySelector('.feedback-text');
    const resultsDiv = quizContainer.querySelector('.quiz-results');
    const scoreNum = quizContainer.querySelector('.score-num');
    const resultsMsg = quizContainer.querySelector('.results-message');

    let currentQuestionIdx = 0;
    let selectedOption = null;
    let score = 0;

    // Reset quiz state
    function resetQuiz() {
      currentQuestionIdx = 0;
      score = 0;
      selectedOption = null;

      // Reset progress steps
      steps.forEach((step, idx) => {
        step.className = 'step' + (idx === 0 ? ' active' : '');
      });

      // Reset questions
      questions.forEach((q, idx) => {
        q.classList.toggle('active', idx === 0);
        q.classList.remove('submitted');
      });

      // Reset options
      options.forEach(opt => {
        opt.className = 'quiz-option';
        opt.disabled = false;
      });

      // Reset results & feedback
      resultsDiv.classList.add('hidden');
      feedbackBox.className = 'quiz-feedback-box hidden';
      feedbackText.textContent = '';

      // Reset buttons
      submitBtn.classList.remove('hidden');
      submitBtn.disabled = true;
      nextBtn.classList.add('hidden');
      retryBtn.classList.add('hidden');
    }

    // Handle option click
    options.forEach(opt => {
      opt.addEventListener('click', function () {
        // Only allow selection if the question hasn't been submitted
        const currentQuestion = questions[currentQuestionIdx];
        const submitted = currentQuestion.classList.contains('submitted');
        if (submitted) return;

        // Deselect other options in the same question
        const siblingOpts = currentQuestion.querySelectorAll('.quiz-option');
        siblingOpts.forEach(sibling => {
          sibling.classList.remove('selected');
        });

        // Select this option
        this.classList.add('selected');
        selectedOption = this;
        submitBtn.disabled = false;
      });
    });

    // Handle Submit
    submitBtn.addEventListener('click', function () {
      if (!selectedOption) return;

      const currentQuestion = questions[currentQuestionIdx];
      currentQuestion.classList.add('submitted');

      const isCorrect = selectedOption.getAttribute('data-correct') === 'true';

      // Update option styles
      const siblingOpts = currentQuestion.querySelectorAll('.quiz-option');
      siblingOpts.forEach(sibling => {
        sibling.disabled = true;
        const correctAttr = sibling.getAttribute('data-correct') === 'true';
        if (correctAttr) {
          sibling.classList.add('correct');
        } else if (sibling === selectedOption) {
          sibling.classList.add('incorrect');
        }
      });

      // Update feedback box
      feedbackBox.classList.remove('hidden');
      if (isCorrect) {
        score++;
        feedbackBox.className = 'quiz-feedback-box correct';
        const feedback = selectedOption.getAttribute('data-feedback') || 'Correct! Well done.';
        feedbackText.innerHTML = '<i class="fas fa-check-circle"></i> ' + feedback;
        steps[currentQuestionIdx].classList.add('correct');
      } else {
        feedbackBox.className = 'quiz-feedback-box incorrect';
        const feedback = selectedOption.getAttribute('data-feedback') || 'Incorrect. Let\'s review the correct answer.';
        feedbackText.innerHTML = '<i class="fas fa-times-circle"></i> ' + feedback;
        steps[currentQuestionIdx].classList.add('incorrect');
      }

      // Hide submit button and show next/results button
      submitBtn.classList.add('hidden');
      if (currentQuestionIdx < questions.length - 1) {
        nextBtn.classList.remove('hidden');
      } else {
        // Show results
        showResults();
      }
    });

    // Handle Next Question
    nextBtn.addEventListener('click', function () {
      // Hide current question
      questions[currentQuestionIdx].classList.remove('active');
      steps[currentQuestionIdx].classList.remove('active');

      // Increment index
      currentQuestionIdx++;

      // Show next question
      questions[currentQuestionIdx].classList.add('active');
      steps[currentQuestionIdx].classList.add('active');

      // Reset state for next question
      selectedOption = null;
      submitBtn.disabled = true;
      submitBtn.classList.remove('hidden');
      nextBtn.classList.add('hidden');
      feedbackBox.classList.add('hidden');
    });

    // Handle Retry
    retryBtn.addEventListener('click', function () {
      resetQuiz();
    });

    function showResults() {
      // Hide all questions
      questions.forEach(q => q.classList.remove('active'));

      // Show results div
      resultsDiv.classList.remove('hidden');
      scoreNum.textContent = score;

      // Customize results message based on score
      if (score === 3) {
        resultsMsg.textContent = 'Perfect score! You\'ve fully mastered the material in this section.';
      } else if (score === 2) {
        resultsMsg.textContent = 'Great job! You have a solid grasp of the core concepts, but there\'s room for improvement.';
      } else {
        resultsMsg.textContent = 'Keep learning! Review the key concepts on this page and try the quiz again.';
      }

      // Show retry button
      retryBtn.classList.remove('hidden');
    }

    // Initialize the quiz
    resetQuiz();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }
})();

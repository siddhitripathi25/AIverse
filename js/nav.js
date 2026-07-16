/**
 * AIVerse - Navigation renderer
 * Builds unified header nav with Courses dropdown from courses.js
 */
(function () {
  'use strict';

  var config = window.AIVerseCourses;
  if (!config) return;

  function renderCoursesDropdown() {
    var items = config.COURSES.map(function (course) {
      if (course.available) {
        return (
          '<li><a href="' + course.href + '" class="dropdown-item">' + course.label + '</a></li>'
        );
      }
      return (
        '<li><span class="dropdown-item is-disabled" aria-disabled="true" tabindex="-1">' +
          course.label +
          ' <span class="coming-soon-badge">Coming Soon</span>' +
        '</span></li>'
      );
    }).join('');

    return (
      '<li class="nav-dropdown">' +
        '<button type="button" class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="courses-menu">' +
          'Courses <i class="fas fa-chevron-down dropdown-caret" aria-hidden="true"></i>' +
        '</button>' +
        '<ul class="dropdown-menu" id="courses-menu" role="menu">' +
          items +
        '</ul>' +
      '</li>'
    );
  }

  function renderNavLink(link) {
    return '<li><a href="' + link.href + '" class="nav-link">' + link.label + '</a></li>';
  }

  function renderNav() {
    var navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    var html = config.NAV_LINKS.map(function (item) {
      if (item.type === 'courses') {
        return renderCoursesDropdown();
      }
      return renderNavLink(item);
    }).join('');

    navMenu.innerHTML = html;
  }

  renderNav();
})();

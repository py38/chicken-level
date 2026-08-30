/* ============================================================
   CHICKEN LEVEL — Interactions & scroll effects
   ============================================================ */
(function () {
  'use strict';

  /* --- année footer --- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- NAV : fond au scroll --- */
  var nav = document.getElementById('nav');
  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });


  /* --- REVEAL ON SCROLL (IntersectionObserver) --- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        // effet cascade pour les groupes de cartes
        var siblings = el.parentElement
          ? Array.prototype.slice.call(el.parentElement.querySelectorAll(':scope > [data-reveal]'))
          : [];
        var idx = siblings.indexOf(el);
        if (idx > -1) el.style.setProperty('--d', (idx * 0.08) + 's');
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(function (el) { io.observe(el); });
})();

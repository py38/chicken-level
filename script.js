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


  /* ============================================================
     FUNNEL D'AVIS — ⚙️ À PERSONNALISER ICI
     ============================================================ */
  var CONFIG = {
    // Lien Google pour publier un avis (5★).
    // ▶ IDÉAL : le lien direct "Rédiger un avis" de la fiche.
    //   Obtenez-le sur Google Business Profile > « Demandez des avis »
    //   (format : https://g.page/r/XXXXXXXX/review). Collez-le ci-dessous.
    // ▶ Par défaut : ouvre la fiche Google Maps du resto (le client clique « Rédiger un avis »).
    googleReviewUrl: 'https://www.google.com/maps/search/?api=1&query=Chicken+Level+150+Rue+de+Vesle+51100+Reims',

    // Retour privé (< 5★) — remplacez par les vrais coordonnées du resto :
    whatsapp: '33600000000',              // ▶ numéro WhatsApp au format international SANS "+" (ex. 336XXXXXXXX)
    email: 'contact.chickenlevel@gmail.com' // ▶ e-mail où recevoir les retours privés
  };

  var modal = document.getElementById('review');
  if (modal) {
    var steps = modal.querySelectorAll('.review__step');
    var stars = modal.querySelectorAll('.star');
    var hint = modal.querySelector('[data-stars-hint]');
    var textarea = modal.querySelector('[data-feedback]');
    var googleLink = modal.querySelector('[data-google-review]');
    var selected = 0;
    var HINTS = ['', 'Oh non… 😕', 'Bof 😐', 'Moyen 🙂', 'Bien 😃', 'Excellent ! 🤩'];

    function showStep(name) {
      steps.forEach(function (s) { s.hidden = (s.getAttribute('data-step') !== name); });
    }
    function paint(n) {
      stars.forEach(function (s) { s.classList.toggle('on', (+s.dataset.rate) <= n); });
    }
    function openModal() {
      selected = 0; paint(0);
      if (hint) hint.textContent = 'Touchez une étoile';
      if (textarea) textarea.value = '';
      showStep('rate');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function choose(n) {
      selected = n; paint(n);
      if (hint) hint.textContent = HINTS[n] || '';
      setTimeout(function () {
        if (n >= 5) {
          if (googleLink) googleLink.href = CONFIG.googleReviewUrl;
          showStep('happy');
        } else {
          showStep('sad');
          if (textarea) textarea.focus();
        }
      }, 320);
    }
    function sendFeedback(via) {
      var txt = (textarea && textarea.value.trim()) || '(sans commentaire)';
      var msg = 'Avis Chicken Level — ' + selected + '/5\n\n' + txt;
      if (via === 'whatsapp') {
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      } else {
        window.location.href = 'mailto:' + CONFIG.email +
          '?subject=' + encodeURIComponent('Avis client Chicken Level (' + selected + '/5)') +
          '&body=' + encodeURIComponent(msg);
      }
      closeModal();
    }

    // ouverture
    document.querySelectorAll('[data-open-review]').forEach(function (b) {
      b.addEventListener('click', openModal);
    });
    // fermeture
    modal.querySelectorAll('[data-close-review]').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    // étoiles
    stars.forEach(function (s) {
      s.addEventListener('mouseenter', function () { paint(+s.dataset.rate); });
      s.addEventListener('click', function () { choose(+s.dataset.rate); });
    });
    var starsWrap = modal.querySelector('.stars-input');
    if (starsWrap) starsWrap.addEventListener('mouseleave', function () { paint(selected); });
    // envoi retour privé
    modal.querySelectorAll('[data-send]').forEach(function (b) {
      b.addEventListener('click', function () { sendFeedback(b.getAttribute('data-send')); });
    });
  }


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

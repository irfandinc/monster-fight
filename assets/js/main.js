(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIG — update these once real business details are known
     --------------------------------------------------------- */
  var CONFIG = {
    // TODO: replace with the real WhatsApp number in international format, no + or spaces (e.g. "905XXXXXXXXX")
    whatsappNumber: '905XXXXXXXXX'
  };

  /* ---------------------------------------------------------
     Header: solid background after scrolling
     --------------------------------------------------------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMobile = document.getElementById('nav-mobile');

  function closeNav() {
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMobile.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------------------------------------------------------
     Scroll reveal animations (respects prefers-reduced-motion
     via CSS; this just toggles the visibility class)
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     WhatsApp link in contact channels
     --------------------------------------------------------- */
  var waLink = document.getElementById('whatsapp-link');
  if (waLink) {
    waLink.href = 'https://wa.me/' + CONFIG.whatsappNumber +
      '?text=' + encodeURIComponent('Merhaba, Monster Fighting Academy hakkında bilgi almak istiyorum.');
  }

  /* ---------------------------------------------------------
     Contact form: client-side validation + WhatsApp handoff
     (No backend available yet — submission is relayed via
     a pre-filled WhatsApp message. Replace with a real form
     endpoint once one exists.)
     --------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');

  function setError(rowId, hasError) {
    var row = document.getElementById(rowId);
    row.classList.toggle('has-error', hasError);
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.classList.remove('is-visible');

    var name = document.getElementById('field-name').value.trim();
    var phone = document.getElementById('field-phone').value.trim();
    var branch = document.getElementById('field-branch').value;
    var message = document.getElementById('field-message').value.trim();

    var nameValid = name.length > 1;
    var phoneValid = isValidPhone(phone);

    setError('row-name', !nameValid);
    setError('row-phone', !phoneValid);

    if (!nameValid) document.getElementById('field-name').focus();
    else if (!phoneValid) document.getElementById('field-phone').focus();

    if (!nameValid || !phoneValid) return;

    var lines = [
      'Yeni Bilgi Talebi — Web Sitesi',
      'Ad Soyad: ' + name,
      'Telefon: ' + phone
    ];
    if (branch) lines.push('İlgilendiği Branş: ' + branch);
    if (message) lines.push('Mesaj: ' + message);

    var waUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(lines.join('\n'));

    statusEl.classList.add('is-visible');
    form.reset();

    window.open(waUrl, '_blank', 'noopener');
  });

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

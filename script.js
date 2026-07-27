/* ─── script.js — DedSec2 interaction layer ─────────────────── */

(function () {
  'use strict';

  /* ── Sticky header shadow on scroll ─────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 2px 24px rgba(0,0,0,0.7), 0 1px 0 rgba(0,212,232,0.18)'
        : '0 1px 0 rgba(0,212,232,0.12)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Join form validation + feedback ────────────────────── */
  const form = document.getElementById('joinForm');
  const note = document.getElementById('formNote');

  var FORM_SUBMIT_DELAY_MS = 1200;

  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Reset
      note.textContent = '';
      note.className = 'form-note';

      var alias   = form.elements['alias'];
      var email   = form.elements['email'];
      var message = form.elements['message'];

      // Validation — leverage browser built-in checks for email
      if (!alias.value.trim()) {
        setNote('// ERROR: Alias field required.', 'error');
        alias.focus();
        return;
      }
      if (!email.checkValidity() || !email.value.trim()) {
        setNote('// ERROR: Invalid secure channel address.', 'error');
        email.focus();
        return;
      }
      if (!message.value.trim()) {
        setNote('// ERROR: Message field required.', 'error');
        message.focus();
        return;
      }

      // Simulate async transmission
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Transmitting...';
      }

      setTimeout(function () {
        setNote('// TRANSMISSION SUCCESSFUL — We will make contact.', 'success');
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Transmit Request';
        }
      }, FORM_SUBMIT_DELAY_MS);
    });
  }

  function setNote(text, type) {
    if (!note) return;
    note.textContent = text;
    note.className = 'form-note ' + (type || '');
  }

  /* ── Smooth active nav link highlight ───────────────────── */
  const sections   = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks   = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              const active = link.getAttribute('href') === '#' + entry.target.id;
              link.style.color = active ? 'var(--cyan)' : '';
              link.style.borderColor = active ? 'var(--border-accent)' : '';
              link.style.background = active ? 'var(--cyan-dim)' : '';
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-60px 0px 0px 0px' }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

})();

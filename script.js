/* ============================================================
   DedSec2 — script.js
   ============================================================ */
'use strict';

/* ---------- Helpers --------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Glitch: random burst -------------------------- */
function scheduleGlitch() {
  const el = $('.glitch');
  if (!el) return;

  function burst() {
    el.classList.add('glitch-burst');
    setTimeout(() => el.classList.remove('glitch-burst'), 600);
    const next = 3000 + Math.random() * 6000;
    setTimeout(burst, next);
  }
  setTimeout(burst, 2500 + Math.random() * 3000);
}

/* ---------- Typing effect for eyebrow -------------------- */
function typeEyebrow() {
  const el = $('.eyebrow');
  if (!el) return;

  const text = el.textContent.trim();
  el.textContent = '';
  el.setAttribute('aria-label', text);

  // cursor
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.appendChild(cursor);

  let i = 0;
  function tick() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(tick, 45 + Math.random() * 50);
    } else {
      // keep cursor blinking for a moment then remove
      setTimeout(() => cursor.remove(), 2200);
    }
  }
  setTimeout(tick, 400);
}

/* ---------- Scroll reveal --------------------------------- */
function initReveal() {
  const targets = $$('.section, .card, .member, .join-form');
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => io.observe(el));
}

/* ---------- Active nav link on scroll -------------------- */
function initActiveNav() {
  const sections = $$('section[id]');
  const links = $$('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => io.observe(s));
}

/* ---------- Inject member avatars ------------------------- */
function injectAvatars() {
  $$('.member').forEach(el => {
    const name = $('h3', el)?.textContent.trim() ?? '?';
    const initial = name[0].toUpperCase();
    const avatar = document.createElement('div');
    avatar.className = 'member-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = initial;
    el.prepend(avatar);
  });
}

/* ---------- Inject op status badges ----------------------- */
function injectOpStatus() {
  const statuses = ['ACTIVE', 'ACTIVE', 'PENDING'];
  $$('.card').forEach((card, i) => {
    const badge = document.createElement('span');
    badge.className = 'op-status';
    badge.textContent = statuses[i] ?? 'ACTIVE';
    card.prepend(badge);
  });
}

/* ---------- Form handling --------------------------------- */
function initForm() {
  const form = $('#joinForm');
  const note = $('#formNote');
  if (!form || !note) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    note.className = 'form-note';
    note.textContent = '';

    // clear previous error states
    $$('input, textarea', form).forEach(f => f.classList.remove('error'));

    // validate
    const fields = $$('[required]', form);
    let valid = true;
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.classList.add('error');
        valid = false;
      }
    });

    // email check
    const emailField = $('input[type="email"]', form);
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      note.textContent = '// ERROR: all fields required.';
      note.classList.add('error');
      return;
    }

    // success simulation
    note.textContent = '// Transmitting…';
    note.style.color = 'var(--clr-muted)';

    setTimeout(() => {
      note.textContent = '// Request encrypted & queued. Welcome, operative.';
      note.classList.add('success');
      form.reset();
    }, 1100);
  });

  // clear error on input
  $$('input, textarea', form).forEach(f => {
    f.addEventListener('input', () => {
      f.classList.remove('error');
      if (note.classList.contains('error')) {
        note.textContent = '';
        note.className = 'form-note';
      }
    });
  });
}

/* ---------- Occasional background glitch strip ----------- */
function initBgGlitch() {
  const strip = document.createElement('div');
  strip.setAttribute('aria-hidden', 'true');
  Object.assign(strip.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    pointerEvents: 'none',
    zIndex: '9997',
    height: '3px',
    background: 'var(--clr-cyan)',
    opacity: '0',
    mixBlendMode: 'screen',
  });
  document.body.appendChild(strip);

  function flash() {
    const top = Math.random() * 100;
    strip.style.top = top + 'vh';
    strip.style.opacity = (0.3 + Math.random() * 0.5).toString();
    strip.style.transform = `scaleX(${0.3 + Math.random() * 0.7})`;
    strip.style.transformOrigin = Math.random() > 0.5 ? 'left' : 'right';
    setTimeout(() => { strip.style.opacity = '0'; }, 80 + Math.random() * 100);
    setTimeout(flash, 4000 + Math.random() * 8000);
  }
  setTimeout(flash, 3000);
}

/* ---------- Boot ----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  typeEyebrow();
  injectAvatars();
  injectOpStatus();
  scheduleGlitch();
  initReveal();
  initActiveNav();
  initForm();
  initBgGlitch();
});

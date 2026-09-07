/* ============================================
   BRK Group — Main JavaScript
   Motion budget: ONE orchestrated hero moment.
   Everything else gets a single calm reveal.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  updateCopyrightYear();
  initMotion();
});


/* ============================================
   Motion controller
   Respects prefers-reduced-motion and missing GSAP.
   ============================================ */

function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    // Leave everything in its natural, visible state.
    return;
  }

  // Signal to CSS that JS-driven animation is live (pre-hides hero + mark).
  document.body.classList.add('js-anim');

  initHeroMoment();
  initCalmReveals();
}


/* ============================================
   The hero moment — headline rises, growth mark draws
   ============================================ */

function initHeroMoment() {
  const hasGsap = typeof window.gsap !== 'undefined';

  if (!hasGsap) {
    // Graceful fallback: reveal instantly if GSAP failed to load.
    document.body.classList.remove('js-anim');
    return;
  }

  // Prepare the growth-mark strokes for a draw-on animation.
  const strokes = document.querySelectorAll('.hero-mark path');
  strokes.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.opacity = 1;
  });

  // Explicit start states (elements are pre-hidden by the .js-anim CSS).
  gsap.set('.hero-meta', { y: 10 });
  gsap.set('.hero-title .line', { yPercent: 60 });
  gsap.set('.hero-description', { y: 18 });
  gsap.set('.hero-actions', { y: 18 });

  const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

  tl.to('.hero-meta', { opacity: 1, y: 0, duration: 0.5 })
    .to('.hero-title .line', { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.2')
    // draw the rising growth line, then the arrowhead, alongside the headline
    .to('.mark-line', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, '-=0.9')
    .to('.mark-head', { strokeDashoffset: 0, duration: 0.4 }, '-=0.25')
    .to('.mark-arc',  { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=1.0')
    .to('.hero-description', { opacity: 1, y: 0, duration: 0.6 }, '-=0.7')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.45');
}


/* ============================================
   Calm reveals — one lightweight fade-up per block,
   via IntersectionObserver (no per-card hover animation).
   ============================================ */

function initCalmReveals() {
  const pending = Array.from(document.querySelectorAll(
    '.section-head, .capability, .who-pole, .ethos-inner, .step, .about-body, .contact-form'
  ));

  pending.forEach(el => el.classList.add('reveal'));

  // A scroll sweep (not IntersectionObserver) so nothing can be skipped and
  // left permanently invisible during fast/flick/anchor scrolling.
  let ticking = false;

  const sweep = () => {
    ticking = false;
    const trigger = window.innerHeight * 0.92;
    for (let i = pending.length - 1; i >= 0; i--) {
      const el = pending[i];
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('is-visible');
        pending.splice(i, 1);
      }
    }
    if (pending.length === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(sweep);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Reveal whatever is already in view on load, and re-check shortly after
  // in case late assets (fonts, images) shift the layout.
  sweep();
  setTimeout(sweep, 350);

  // Absolute failsafe: never leave content hidden, even if scroll events
  // somehow don't fire (embeds, unusual scroll containers).
  setTimeout(() => pending.slice().forEach(el => el.classList.add('is-visible')), 2500);
}


/* ============================================
   Mobile menu
   ============================================ */

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  const setState = (open) => {
    menu.classList.toggle('active', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setState(!menu.classList.contains('active')));

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setState(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setState(false);
  });
}


/* ============================================
   Smooth scroll (with sticky-nav offset)
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}


/* ============================================
   Contact form (formsubmit.co AJAX endpoint — unchanged)
   ============================================ */

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const success = form.querySelector('.form-success');
    const data = Object.fromEntries(new FormData(form));

    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        form.querySelectorAll('.form-group, button[type="submit"]').forEach(el => el.style.display = 'none');
        success.style.display = 'block';
      } else {
        throw new Error('Bad response');
      }
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      alert('Something went wrong. Please email us directly at marketing@brkgroup.co.za');
    }
  });
}


/* ============================================
   Copyright year
   ============================================ */

function updateCopyrightYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
}

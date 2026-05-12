/* ============================================
   BRK Group — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
});


/* ============================================
   Hero Kinetic Typography
   ============================================ */

function splitTextIntoChars(element) {
  const text = element.innerHTML;
  const chars = text.split('');
  element.innerHTML = chars.map(char => {
    if (char === ' ') return ' ';
    return `<span class="char">${char}</span>`;
  }).join('');
}

function splitItalicLine(element) {
  const em = element.querySelector('em');
  if (em) {
    const text = em.textContent;
    const chars = text.split('');
    em.innerHTML = chars.map(char => {
      if (char === ' ') return ' ';
      return `<span class="char">${char}</span>`;
    }).join('');
  }
}

function initHeroAnimation() {
  const line1 = document.querySelector('.hero-title .line-1');
  const line2 = document.querySelector('.hero-title .line-2');

  if (!line1 || !line2) return;

  // Split text into characters
  splitTextIntoChars(line1);
  splitItalicLine(line2);

  // Create timeline
  const tl = gsap.timeline({ delay: 0.3 });

  // Set initial states
  gsap.set('.hero-label', { opacity: 0, y: 10 });
  gsap.set('.line-1 .char', { opacity: 0, y: 80, rotationX: -40 });
  gsap.set('.line-2 .char', { opacity: 0, y: 60, rotationX: -30 });
  gsap.set('.hero-tagline', { opacity: 0, y: 10 });
  gsap.set('.hero-description', { opacity: 0, y: 20 });
  gsap.set('.hero-actions', { opacity: 0, y: 20 });

  // Animation sequence
  tl.to('.hero-label', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to('.line-1 .char', {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.8,
    stagger: 0.035,
    ease: 'power3.out'
  }, '-=0.3')
  .to('.line-2 .char', {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.9,
    stagger: 0.03,
    ease: 'power2.out'
  }, '-=0.5')
  .to('.hero-tagline', {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.4')
  .to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3')
  .to('.hero-actions', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');
}


/* ============================================
   Mobile Menu
   ============================================ */

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}


/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Animate section headers
  gsap.utils.toArray('.section-eyebrow').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate pillars
  gsap.utils.toArray('.pillar').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate stats
  gsap.utils.toArray('.stat').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate stat numbers (count up)
  gsap.utils.toArray('.stat-number').forEach(el => {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const hasX = text.includes('x');
    const hasHr = text.includes('hr');

    let num = parseInt(text.replace(/[^0-9]/g, ''));

    if (!isNaN(num)) {
      const obj = { val: 0 };

      gsap.to(obj, {
        val: num,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          let display = Math.floor(obj.val);
          if (hasPlus) display += '+';
          if (hasX) display += 'x';
          if (hasHr) display += 'hr';
          el.textContent = display;
        }
      });
    }
  });

  // Animate industries grid
  gsap.utils.toArray('.industry').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      delay: i * 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.industries-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate portfolio items
  gsap.utils.toArray('.portfolio-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      scale: 0.98,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate CTA band
  gsap.from('.cta-band h2', {
    opacity: 0,
    x: -40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-band',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.cta-band .btn', {
    opacity: 0,
    x: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-band',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // Animate contact form
  gsap.from('.contact-form', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  // Animate process steps
  gsap.utils.toArray('.step').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate WhatsApp button entrance
  gsap.from('.whatsapp-float', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    delay: 2,
    ease: 'back.out(1.7)'
  });
}


/* ============================================
   Smooth Scroll
   ============================================ */

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ============================================
   Form Handling
   ============================================ */

// Form submission is handled by FormSubmit.co
// No JavaScript interception needed - form submits directly to the service
// which then emails marketing@brkgroup.co.za

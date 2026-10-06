/* ================================================================
   TENDAI ERNEST — Portfolio Interactions
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Custom Cursor (desktop only) ──────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorDot = cursor.querySelector('.cursor-dot');
  const cursorRing = cursor.querySelector('.cursor-ring');
  let cX = -100, cY = -100, rX = -100, rY = -100;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', e => { cX = e.clientX; cY = e.clientY; });

    const animCursor = () => {
      rX += (cX - rX) * 0.1;
      rY += (cY - rY) * 0.1;
      cursor.style.transform = `translate(${cX}px, ${cY}px)`;
      cursorRing.style.transform = `translate(${rX - cX}px, ${rY - cY}px)`;
      requestAnimationFrame(animCursor);
    };
    animCursor();

    document.querySelectorAll('a, button, [tabindex="0"], .proj-card, .cap-cluster, .channel, .ctag, .chip')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
  }


  // ── 2. Header scroll effect ───────────────────────────────────
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ── 3. Mobile menu ────────────────────────────────────────────
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobClose = document.getElementById('mobClose');

  const openMenu = () => {
    mobileMenu.hidden = false;
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileMenu.querySelector('.mob-link')?.focus();
  };
  const closeMenu = () => {
    mobileMenu.hidden = true;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  };

  burger.addEventListener('click', () => mobileMenu.hidden ? openMenu() : closeMenu());
  if (mobClose) mobClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu(); });
  mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });


  // ── 4. Hero descriptor cycling ────────────────────────────────
  const cycleEl = document.getElementById('descriptorCycle');
  const words = ['scale.', 'connect.', 'last.', 'matter.', 'work.'];
  let wIdx = 0;

  const cycleWord = () => {
    cycleEl.style.opacity = '0';
    cycleEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      wIdx = (wIdx + 1) % words.length;
      cycleEl.textContent = words[wIdx];
      cycleEl.style.opacity = '1';
      cycleEl.style.transform = 'translateY(0)';
    }, 300);
  };

  cycleEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  const cycleInterval = setInterval(cycleWord, 2800);


  // ── 5. Scroll reveal (IntersectionObserver) ───────────────────
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));


  // ── 6. Active nav link highlight ─────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
  sections.forEach(s => navObs.observe(s));


  // ── 7. Smooth scroll for all anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });


  // ── 8. Project cards — 3D tilt on hover ──────────────────────
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rX = ((y - r.height / 2) / r.height) * -8;
      const rY = ((x - r.width / 2) / r.width) * 8;
      card.style.transform = `perspective(600px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    // Keyboard: allow Enter to focus-reveal
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });


  // ── 9. Capability cluster — expand on click (mobile friendly) ──
  document.querySelectorAll('.cap-cluster').forEach(cluster => {
    cluster.addEventListener('click', () => {
      cluster.classList.toggle('expanded');
    });
  });


  // ── 10. Contact form ──────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('formSubmit');
      const textEl = btn.querySelector('.submit-text');
      const originalText = textEl.textContent;

      // Simple validation
      const fields = form.querySelectorAll('[required]');
      let valid = true;
      fields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#f43f5e';
          valid = false;
        }
      });
      if (!valid) return;

      // Submit feedback
      btn.disabled = true;
      textEl.textContent = 'Message sent!';
      btn.style.background = '#10b981';
      btn.style.color = 'white';

      // Small confetti burst
      burst();

      setTimeout(() => {
        textEl.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
        fields.forEach(f => f.style.borderColor = '');
      }, 3500);
    });
  }


  // ── 11. Confetti burst (contact form success) ─────────────────
  function burst() {
    const colours = ['#c8a96e','#10b981','#6366f1','#f43f5e','#f59e0b'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 8 + 4;
      el.style.cssText = `
        position:fixed;
        width:${size}px;height:${size}px;
        background:${colours[Math.floor(Math.random() * colours.length)]};
        left:${Math.random()*100}vw;top:-10px;
        border-radius:${Math.random()>.5?'50%':'2px'};
        pointer-events:none;z-index:10000;
        animation:confettiFall ${Math.random()*2+1.5}s ease-out forwards;
        transform:rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
    if (!document.getElementById('confettiKF')) {
      const s = document.createElement('style');
      s.id = 'confettiKF';
      s.textContent = '@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
      document.head.appendChild(s);
    }
  }


  // ── 12. Easter egg ────────────────────────────────────────────
  const egg = document.getElementById('easterEgg');
  if (egg) {
    let clicks = 0;
    const activate = () => {
      clicks++;
      if (clicks >= 3) {
        egg.classList.add('discovered');
        egg.setAttribute('title', 'You found it. 👾');
      }
    };
    egg.addEventListener('click', activate);
    egg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  }

});
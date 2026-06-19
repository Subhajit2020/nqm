'use strict';

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
(function () {
  // Respect reduced motion
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var animClasses = [
    '.scroll-fade-up',
    '.scroll-fade-left',
    '.scroll-fade-right',
    '.scroll-scale-in',
  ];

  var elements = document.querySelectorAll(animClasses.join(', '));

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(function (el) {
      el.classList.add('in-view');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
(function () {
  var btn = document.querySelector('.newsletter-btn');
  var input = document.querySelector('.newsletter-input');
  if (!btn || !input) return;

  btn.addEventListener('click', function () {
    var email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#ef4444';
      input.focus();
      setTimeout(function () {
        input.style.borderColor = '';
      }, 2000);
      return;
    }
    btn.textContent = 'Joined!';
    btn.style.background = '#22c55e';
    input.value = '';
    setTimeout(function () {
      btn.textContent = 'JOIN';
      btn.style.background = '';
    }, 3000);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL (offset for fixed navbar)
   ============================================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

// Toggle menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Highlight nav link aktif sesuai scroll
const sections = document.querySelectorAll('section[id], header[id]');
const links = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(sec => navObserver.observe(sec));

// Nav bar jadi lebih tegas begitu halaman mulai discroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Animasi muncul halus saat discroll
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.exp-item, .cert-card, .proof-card').forEach(el => el.classList.add('show'));
  document.querySelector('.hero-photo')?.classList.add('loaded');
} else {
  const revealGroups = document.querySelectorAll('.card-grid, .cert-grid');
  revealGroups.forEach(group => {
    group.querySelectorAll('.proof-card, .cert-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const revealEls = document.querySelectorAll('.exp-item, .cert-card, .proof-card');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Foto hero muncul pelan begitu halaman pertama dibuka
  window.addEventListener('load', () => {
    document.querySelector('.hero-photo')?.classList.add('loaded');
  });
}

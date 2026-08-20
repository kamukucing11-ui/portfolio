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
const revealSelector = '.exp-item, .cert-card, .proof-card, .reveal-el';

if (prefersReducedMotion) {
  document.querySelectorAll(revealSelector).forEach(el => el.classList.add('show'));
} else {
  const revealGroups = document.querySelectorAll('.card-grid, .cert-grid');
  revealGroups.forEach(group => {
    group.querySelectorAll('.proof-card, .cert-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const revealEls = document.querySelectorAll(revealSelector);
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}



/* ===== Modern interaction layer — content unchanged ===== */
(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');

  // Scroll progress indicator.
  const progress = document.createElement('div');
  progress.setAttribute('aria-hidden','true');
  progress.style.cssText = `
    position:fixed;left:0;top:0;height:3px;width:0;z-index:10000;
    background:linear-gradient(90deg,#0071e3,#5e5ce6);
    border-radius:0 999px 999px 0;pointer-events:none;
    transition:width .08s linear;
  `;
  document.body.appendChild(progress);

  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    if (nav) nav.classList.toggle('scrolled', scrollY > 24);
  };
  addEventListener('scroll', updateScrollUI, {passive:true});
  updateScrollUI();

  // Add a tasteful 3D hover tilt to larger media cards on pointer devices.
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.proof-card,.cert-card,.file-photo').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform=''; });
    });
  }

  // Native lazy loading for existing images; no image source changes.
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
    img.style.background = '#f2f2f4';
  });
})();

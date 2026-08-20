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

// Menu mobile (hamburger -> fullscreen overlay)
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');

function closeMobileNav(){
  navToggle.classList.remove('open');
  navOverlay.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
}

// Animasi muncul halus saat discroll — replay tiap masuk/keluar layar,
// pakai threshold persen (bukan px) supaya konsisten di HP maupun desktop.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealSelector = [
  '.exp-item', '.cert-card', '.proof-card', '.reveal-el',
  '.section-kicker', '.section-title', '.file-card',
  '.profile-grid > div:first-child', '.edu-grid > div:first-child',
  '.skills-grid > div', '.contact-wrap > div:first-child'
].join(', ');

if (prefersReducedMotion) {
  document.querySelectorAll(revealSelector).forEach(el => el.classList.add('show'));
} else {
  document.querySelectorAll('.card-grid, .cert-grid').forEach(group => {
    group.querySelectorAll('.proof-card, .cert-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  document.querySelectorAll('.profile-grid, .edu-grid, .skills-grid, .contact-wrap').forEach(group => {
    Array.from(group.children).forEach((el, i) => {
      el.style.transitionDelay = `${i * 130}ms`;
    });
  });

  const revealEls = document.querySelectorAll(revealSelector);
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -12% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// Progress bar tipis di atas, mengikuti posisi scroll halaman
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

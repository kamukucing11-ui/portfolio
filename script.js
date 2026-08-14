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
const revealSelector = [
  '.exp-item', '.cert-card', '.proof-card', '.reveal-el',
  '.section-kicker', '.section-title', '.file-card',
  '.profile-grid > div:first-child', '.edu-grid > div:first-child',
  '.skills-grid > div', '.contact-wrap > div:first-child'
].join(', ');

if (prefersReducedMotion) {
  document.querySelectorAll(revealSelector).forEach(el => el.classList.add('show'));
} else {
  // Stagger kartu bukti/sertifikat dalam satu grid
  document.querySelectorAll('.card-grid, .cert-grid').forEach(group => {
    group.querySelectorAll('.proof-card, .cert-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  // Stagger blok teks vs foto dalam satu baris (mis. profil, edukasi, skills, kontak)
  document.querySelectorAll('.profile-grid, .edu-grid, .skills-grid, .contact-wrap').forEach(group => {
    Array.from(group.children).forEach((el, i) => {
      el.style.transitionDelay = `${i * 130}ms`;
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

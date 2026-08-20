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

// Animasi muncul halus saat discroll — main SEKALI per elemen (bukan
// bolak-balik tiap masuk/keluar layar). Toggle show/hide berulang pada
// elemen yang pakai backdrop-filter itulah yang bikin GPU kerja keras dan
// muncul kedip/putih pas scroll cepat di HP. Reveal sekali = jauh lebih mulus.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealSelector = [
  '.exp-item', '.cert-card', '.proof-card', '.reveal-el',
  '.section-kicker', '.section-title',
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
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // will-change dipasang hanya sesaat sebelum transisi jalan, lalu
      // dilepas begitu selesai — bukan dipasang permanen di semua kartu
      // sekaligus (itu yang bikin browser HP kehabisan memori layer GPU
      // dan sesekali "gagal render" jadi putih sekilas).
      el.style.willChange = 'opacity, transform';
      el.classList.add('show');
      el.addEventListener('transitionend', () => {
        el.style.willChange = 'auto';
      }, { once: true });
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// Foto fade-in halus begitu selesai dimuat/didekode — mencegah kotak putih
// kosong nongol duluan sebelum gambar siap (ini penyebab utama efek
// "loading putih-putih" saat scroll cepat di koneksi HP yang lebih lambat).
document.querySelectorAll('img').forEach(img => {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('is-loaded');
    return;
  }
  const markLoaded = () => img.classList.add('is-loaded');
  img.addEventListener('load', markLoaded, { once: true });
  img.addEventListener('error', markLoaded, { once: true }); // gambar gagal load pun jangan nyangkut transparan
});

// Efek ketik pada tag hero — jalan sekali di awal, sesudah animasi fadeUp-nya.
const heroTag = document.getElementById('heroTag');
if (heroTag && !prefersReducedMotion) {
  const fullText = heroTag.textContent;
  heroTag.textContent = '';
  setTimeout(() => {
    heroTag.classList.add('typing');
    let i = 0;
    (function typeStep() {
      heroTag.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(typeStep, 34);
      } else {
        setTimeout(() => heroTag.classList.remove('typing'), 900);
      }
    })();
  }, 500);
}

// Nav bar jadi lebih tegas + progress bar tipis di atas — digabung jadi satu
// listener scroll yang dibatch lewat requestAnimationFrame, supaya kerjanya
// selaras dengan siklus render browser (bukan dieksekusi berkali-kali mentah
// tiap event scroll, yang bikin momentum-scroll di HP terasa kurang mulus).
const nav = document.querySelector('.nav');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

let scrollTicking = false;
function onScrollFrame() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  nav.classList.toggle('scrolled', scrollTop > 20);
  scrollTicking = false;
}
function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(onScrollFrame);
    scrollTicking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScrollFrame);
onScrollFrame();

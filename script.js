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
// pakai threshold persen (bukan px) supaya konsisten di HP maupun desktop,
// dan tanpa filter:blur (berat/kurang stabil di sebagian browser HP).
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

/* =======================================================================
   MODE TERANG / GELAP
   ======================================================================= */
const THEME_KEY = 'aqiz-theme';
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem(THEME_KEY);
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
let currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f4efe3' : '#000000');
  currentTheme = theme;
}
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    themeToggle.animate(
      [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(.8) rotate(-25deg)' }, { transform: 'scale(1) rotate(0deg)' }],
      { duration: 420, easing: 'cubic-bezier(.34,1.4,.4,1)' }
    );
  });
}

/* =======================================================================
   TERJEMAHAN / TRANSLATE (ID <-> EN)
   ======================================================================= */
const LANG_KEY = 'aqiz-lang';
const langToggle = document.getElementById('langToggle');
const langCode = document.querySelector('[data-lang-current]');

const dict = {
  'nav.profile':      { id: 'Profile',    en: 'Profile' },
  'nav.experience':   { id: 'Experience', en: 'Experience' },
  'nav.certificate':  { id: 'Certificate',en: 'Certificate' },
  'nav.contact':      { id: 'Contact',    en: 'Contact' },

  'hero.tag': { id: 'Berkas Profesional · 2026', en: 'Professional Dossier · 2026' },

  'profile.text': {
    id: `Lulusan S1 Manajemen (IPK 3,58/4,00) dengan pengalaman lintas fungsi di operasional,
        pemasaran digital, dan riset perilaku konsumen. Terbiasa menerjemahkan data dan tren
        digital menjadi strategi promosi yang terukur — dibuktikan lewat penjualan lebih dari
        200 unit produk dalam satu kampanye dan penelitian skripsi tentang pengaruh live
        streaming, ulasan online, dan keamanan transaksi terhadap minat beli di TikTok Shop.
        Bersertifikasi BNSP Digital Marketing, siap berkontribusi langsung pada efisiensi
        operasional dan pertumbuhan penjualan berbasis data.`,
    en: `Bachelor's graduate in Management (GPA 3.58/4.00) with cross-functional experience in
        operations, digital marketing, and consumer behavior research. Skilled at turning data
        and digital trends into measurable promotional strategy — proven through selling over
        200 product units in a single campaign and a thesis study on how live streaming, online
        reviews, and transaction security affect purchase intent on TikTok Shop. BNSP-certified
        in Digital Marketing, ready to contribute directly to operational efficiency and
        data-driven sales growth.`
  },
  'profile.badge3':  { id: 'Riset Perilaku Konsumen', en: 'Consumer Behavior Research' },
  'profile.photocap':{ id: 'Foto — Profil', en: 'Photo — Profile' },

  'edu.kicker': { id: '02 · Riwayat Pendidikan', en: '02 · Education History' },
  'edu.note': {
    id: `Riset: Pengaruh Live Streaming, Online Customer Review, dan Security terhadap Minat
        Beli pada TikTok Shop — riset pemasaran digital dan perilaku konsumen.`,
    en: `Thesis: The Influence of Live Streaming, Online Customer Reviews, and Security on
        Purchase Intention on TikTok Shop — digital marketing and consumer behavior research.`
  },
  'edu.photocap': { id: 'Foto — Wisuda', en: 'Photo — Graduation' },

  'skills.kicker': { id: '03 · Kemampuan', en: '03 · Capabilities' },
  'exp.kicker': { id: '04 · Rekam Jejak', en: '04 · Track Record' },

  'exp1.desc': {
    id: `Merancang dan mengembangkan sistem serta mekanik gim menggunakan Lua untuk aset
        digital kustom sesuai spesifikasi klien. Membangun reputasi transaksi token game
        (Robux) dan aset digital melalui strategi promosi terarah, meningkatkan kepercayaan
        dan volume penjualan di pasar.`,
    en: `Designed and developed game systems and mechanics using Lua for custom digital
        assets to client specifications. Built a trusted track record for in-game currency
        (Robux) and digital asset transactions through targeted promotion, growing buyer
        trust and marketplace sales volume.`
  },
  'exp1.label1': { id: 'Komunitas', en: 'Community' },
  'exp1.label2': { id: 'Pembuatan Aset', en: 'Asset Creation' },
  'exp1.label3': { id: 'Pembelian', en: 'Purchase' },

  'exp2.desc': {
    id: `Mengakuisisi pengguna baru aplikasi PosPay dan PosAja untuk memperluas penetrasi
        layanan digital perusahaan. Menyusun laporan penjualan harian dan menginput lebih
        dari 200 data paket per hari ke sistem internal secara akurat dan tepat waktu.
        Mendokumentasikan kegiatan operasional cabang untuk kebutuhan pelaporan manajemen
        dan konten publikasi Instagram.`,
    en: `Acquired new users for the PosPay and PosAja apps to expand the company's digital
        service reach. Compiled daily sales reports and entered over 200 parcel records per
        day into the internal system accurately and on time. Documented branch operations
        for management reporting and Instagram content.`
  },
  'exp2.label1': { id: 'Pembuatan Konten', en: 'Content Creation' },
  'exp2.label2': { id: 'Dokumentasi', en: 'Documentation' },
  'exp2.label3': { id: 'Mengimput Paket', en: 'Parcel Data Entry' },

  'exp3.desc': {
    id: `Menjalankan proses administrasi dan verifikasi surat suara sesuai prosedur resmi
        Pemilu, termasuk pencatatan hasil penghitungan pada Sertifikat Hasil dan Formulir
        Berita Acara. Berkontribusi menjaga akurasi dan integritas proses pemungutan suara
        di tingkat TPS.`,
    en: `Carried out ballot administration and verification per official election procedure,
        including recording vote-count results on official certificates and minutes.
        Helped maintain the accuracy and integrity of the polling process at the station
        level.`
  },
  'exp3.label1': { id: 'Buku Panduan', en: 'Handbook' },
  'exp3.label2': { id: 'Pelaksanaan', en: 'Execution' },
  'exp3.label3': { id: 'Kotak Suara', en: 'Ballot Box' },

  'exp4.desc': {
    id: `Membangun layanan jasa digital marketing dan mengakuisisi klien UMKM yang belum
        memiliki kehadiran digital. Memproduksi total 36 konten Instagram untuk klien dan
        akun ForAds secara rutin setiap bulan, serta menyusun laporan pertanggungjawaban
        PKM secara menyeluruh.`,
    en: `Built a digital marketing service and acquired small-business clients with no
        prior digital presence. Produced 36 Instagram content pieces for clients and the
        ForAds account on a regular monthly basis, and compiled a comprehensive program
        accountability report.`
  },
  'exp4.label1': { id: 'Pembuatan Konten', en: 'Content Creation' },
  'exp4.label2': { id: 'Pemilik UMKM', en: 'Business Owner' },

  'exp5.desc': {
    id: `Mengelola produksi camilan berbahan dasar susu sapi dari hulu ke hilir dan menerapkan
        sistem Purchase Order via Instagram untuk efisiensi manajemen stok dan pesanan.
        Memasarkan produk hingga terjual lebih dari 200 unit dalam satu periode kegiatan.`,
    en: `Managed end-to-end production of a milk-based snack product and implemented an
        Instagram-based purchase-order system for efficient stock and order management.
        Marketed the product to sell over 200 units within a single event period.`
  },
  'exp5.label1': { id: 'Produk', en: 'Product' },
  'exp5.label2': { id: 'Desain Promosi', en: 'Promo Design' },
  'exp5.label3': { id: 'Laporan', en: 'Report' },

  'exp6.desc': {
    id: `Memproduksi 10 materi konten pemasaran Instagram berbasis Canva untuk memperkuat
        daya tarik visual produk mitra UMKM. Mendigitalisasi pencatatan laporan keuangan
        usaha dan memfasilitasi penerbitan Nomor Induk Berusaha (NIB) melalui sistem OSS.`,
    en: `Produced 10 Canva-based Instagram marketing content pieces to strengthen the visual
        appeal of a partner business's products. Digitized the business's financial
        record-keeping and facilitated issuance of a Business ID Number (NIB) through the
        OSS system.`
  },
  'exp6.label1': { id: 'Pembuatan Konten', en: 'Content Creation' },
  'exp6.label2': { id: 'Pemilik UMKM', en: 'Business Owner' },

  'exp7.desc': {
    id: `Merancang alur strategi pemasaran dan halaman situs yang fokus pada konversi
        penjualan. Mengelola iklan berbayar untuk meningkatkan trafik. Mengoptimasi
        peringkat pencarian dan membangun interaksi audiens di media sosial.`,
    en: `Designed marketing strategy flows and landing pages focused on sales conversion.
        Managed paid ads to increase traffic. Optimized search rankings and built audience
        engagement on social media.`
  },
  'exp7.label1': { id: 'Pengenalan', en: 'Introduction' },
  'exp7.label2': { id: 'Materi', en: 'Materials' },
  'exp7.label3': { id: 'Praktik', en: 'Practice' },

  'exp8.label1': { id: 'Pelatihan SPSS', en: 'SPSS Training' },
  'exp8.label2': { id: 'Pelatihan Digital Marketing', en: 'Digital Marketing Training' },

  'cert.kicker': { id: '05 · Bukti Kompetensi', en: '05 · Proof of Competency' },

  'contact.kicker': { id: '06 · Selesai', en: '06 · Closing' },
  'contact.title': { id: 'Terima<br>Kasih', en: 'Thank<br>You' },
  'contact.lead': {
    id: 'Terbuka untuk peluang di bidang operasional, pemasaran digital, dan riset konsumen. Silakan hubungi lewat salah satu kanal berikut.',
    en: 'Open to opportunities in operations, digital marketing, and consumer research. Feel free to reach out through any of the channels below.'
  },
  'contact.label': { id: 'Kontak', en: 'Contact' }
};

function applyLang(lang) {
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'id');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const entry = dict[key];
    if (!entry) return;
    el.innerHTML = entry[lang] || entry.id;
  });
  if (langCode) langCode.textContent = lang === 'en' ? 'EN' : 'ID';
}

const savedLang = localStorage.getItem(LANG_KEY) || 'id';
applyLang(savedLang);
let currentLang = savedLang;

if (langToggle) {
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    langToggle.classList.add('switching');
    setTimeout(() => {
      applyLang(currentLang);
      langToggle.classList.remove('switching');
    }, 160);
    localStorage.setItem(LANG_KEY, currentLang);
  });
}

/* =======================================================================
   ANIMASI MEWAH — cursor glow, tilt 3D, spotlight kartu
   Semua dinonaktifkan otomatis untuk perangkat sentuh & prefers-reduced-motion.
   ======================================================================= */
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouchDevice) {

  // --- Ambient cursor glow yang mengikuti pointer ---
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  let glowActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!glowActive) { glow.classList.add('active'); glowActive = true; }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
    glowActive = false;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);

  // Membesar saat berada di atas elemen interaktif
  const magnetTargets = 'a, button, .util-btn, .skill-tags span, .tool-tile, .contact-list li';
  document.querySelectorAll(magnetTargets).forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('big'));
    el.addEventListener('mouseleave', () => glow.classList.remove('big'));
  });

  // --- Spotlight radial di kartu kaca, mengikuti posisi kursor ---
  document.querySelectorAll('.ios-card, .exp-item, .file-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // --- Tilt 3D pada foto & kartu bukti/sertifikat ---
  const MAX_TILT = 9;
  document.querySelectorAll('.tilt').forEach(card => {
    const fx = card.querySelector('.tilt-fx');
    if (!fx) return;

    card.addEventListener('mouseenter', () => card.classList.add('tilting'));

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1
      const ry = (px - 0.5) * (MAX_TILT * 2);
      const rx = (0.5 - py) * (MAX_TILT * 2);
      fx.style.setProperty('--rx', `${rx}deg`);
      fx.style.setProperty('--ry', `${ry}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      fx.style.setProperty('--rx', '0deg');
      fx.style.setProperty('--ry', '0deg');
    });
  });

  // --- Parallax lembut pada hero mengikuti posisi kursor ---
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    window.addEventListener('mousemove', (e) => {
      const relX = (e.clientX / window.innerWidth) - 0.5;
      const relY = (e.clientY / window.innerHeight) - 0.5;
      heroInner.style.transform = `translate(${relX * -14}px, ${relY * -10}px)`;
    }, { passive: true });
  }
}

// ===== copy IP =====
const copyIpBtn = document.getElementById('copyIpBtn');
const ipText = document.getElementById('ipText');

if (copyIpBtn && ipText) {
  copyIpBtn.addEventListener('click', () => {
    const originalText = ipText.textContent;
    navigator.clipboard.writeText(originalText.trim())
      .then(() => {
        ipText.textContent = 'Disalin!';
        setTimeout(() => { ipText.textContent = originalText; }, 1200);
      })
      .catch(() => {
        ipText.textContent = 'Gagal menyalin';
        setTimeout(() => { ipText.textContent = originalText; }, 1200);
      });
  });
}

// ===== status server live (pemain online, online/offline) =====
// Pakai API publik gratis mcsrvstat.us, cukup ping IP server, nggak perlu bikin backend sendiri.
const SERVER_IP = ipText ? ipText.textContent.trim() : 'legacyschool.my.id:25040';

const onlineCountEl = document.getElementById('onlineCount');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusDesc = document.getElementById('statusDesc');

async function updateServerStatus(isFirstLoad = false) {
  // kasih tanda lagi loading cuma pas pertama kali buka halaman,
  // biar keliatan jelas prosesnya jalan (bukan macet) tanpa bikin kedip tiap auto-refresh
  if (isFirstLoad) {
    if (onlineCountEl) onlineCountEl.textContent = 'Memuat...';
    if (statusDesc) statusDesc.textContent = 'Mengecek status server...';
  }

  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
    const data = await res.json();

    if (data.online) {
      if (onlineCountEl) {
        const online = data.players?.online ?? 0;
        const max = data.players?.max ?? '?';
        onlineCountEl.textContent = `${online} / ${max}`;
      }
      if (statusDot) statusDot.classList.remove('status-dot--red');
      if (statusText) {
        statusText.textContent = 'ONLINE';
        statusText.classList.remove('status-item__value--red');
        statusText.classList.add('status-item__value--green');
      }
      if (statusDesc) statusDesc.textContent = 'Server berjalan dengan normal!';
    } else {
      if (onlineCountEl) onlineCountEl.textContent = '0 / 0';
      if (statusDot) statusDot.classList.add('status-dot--red');
      if (statusText) {
        statusText.textContent = 'OFFLINE';
        statusText.classList.remove('status-item__value--green');
        statusText.classList.add('status-item__value--red');
      }
      if (statusDesc) statusDesc.textContent = 'Server sedang tidak dapat diakses.';
    }
  } catch (err) {
    if (statusDesc) statusDesc.textContent = 'Status server belum bisa dimuat, coba refresh halaman.';
  }
}

if (onlineCountEl || statusDot) {
  updateServerStatus(true);
  setInterval(() => updateServerStatus(false), 60000); // refresh tiap 60 detik
}

// ===== dev credit: 3D skin head (skinview3d) + popup card =====
const devAvatarBtn = document.getElementById('devAvatarBtn');
const devCard = document.getElementById('devCard');
const devSkinCanvas = document.getElementById('devSkinCanvas');

// klik avatar buka/tutup card info developer
if (devAvatarBtn && devCard) {
  devAvatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    devCard.classList.toggle('is-open');
  });

  document.addEventListener('click', (e) => {
    if (!devCard.contains(e.target) && e.target !== devAvatarBtn) {
      devCard.classList.remove('is-open');
    }
  });
}

// render kepala 3D pakai skinview3d, di-lazy-load SETELAH halaman selesai dimuat
// (biar library ~500KB ini nggak ngerem loading konten utama / SEO performance)
if (devSkinCanvas) {
  function initDevSkinViewer() {
    const viewer = new skinview3d.SkinViewer({
      canvas: devSkinCanvas,
      width: 56,
      height: 56,
      skin: 'skin-zakki.png',
    });

    viewer.controls.enableZoom = false;
    viewer.controls.enableRotate = false;
    viewer.controls.enablePan = false;
    viewer.autoRotate = false;
    viewer.zoom = 1.7; // zoom in biar kepala kelihatan penuh di kotak kecil
    viewer.camera.position.set(0, 2, 20); // fokus kamera sejajar kepala

    // sembunyiin badan/tangan/kaki, sisain kepala doang
    const { skin } = viewer.playerObject;
    skin.body.visible = false;
    skin.leftArm.visible = false;
    skin.rightArm.visible = false;
    skin.leftLeg.visible = false;
    skin.rightLeg.visible = false;

    // animasi noleh halus (lerp) ke arah target tiap hover, bukan snap langsung
    let targetY = 0;
    let currentY = 0;
    (function animate() {
      currentY += (targetY - currentY) * 0.12;
      skin.head.rotation.y = currentY;
      requestAnimationFrame(animate);
    })();

    // noleh ke kiri 45 derajat pas di-hover/tap.
    // Kalau arahnya kebalik (malah noleh ke kanan), tinggal ganti jadi -Math.PI / 4
    const TURN_ANGLE = Math.PI / 4;
    devAvatarBtn.addEventListener('mouseenter', () => { targetY = TURN_ANGLE; });
    devAvatarBtn.addEventListener('mouseleave', () => { targetY = 0; });
    devAvatarBtn.addEventListener('touchstart', () => { targetY = targetY === 0 ? TURN_ANGLE : 0; }, { passive: true });
  }

  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/skinview3d@3.4.1/bundles/skinview3d.bundle.js';
    script.defer = true;
    script.onload = initDevSkinViewer;
    document.body.appendChild(script);
  });
}
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navMenu.classList.remove('is-open'));
  });
}

// ===== navbar active underline (ikut link yang diklik + scroll-spy) =====
if (navMenu) {
  const navLinks = Array.from(navMenu.querySelectorAll('a[href^="#"]'));

  function setActiveLink(link) {
    navLinks.forEach((a) => a.classList.remove('is-active'));
    if (link) link.classList.add('is-active');
  }

  // klik langsung pindahkan garis ke link yang ditekan
  navLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveLink(link));
  });

  // scroll-spy: perbarui otomatis saat section terkait terlihat di layar
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = navLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
            if (match) setActiveLink(match);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

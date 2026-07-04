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

async function updateServerStatus() {
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
  updateServerStatus();
  setInterval(updateServerStatus, 60000); // refresh tiap 60 detik
}

// ===== mobile nav toggle =====
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

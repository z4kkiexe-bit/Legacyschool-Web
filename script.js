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

/**
 * Mahdi Ghannad Portfolio - Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // ۱. راه‌اندازی فال‌بک تصاویر پیش از بارگذاری
  setupImageFallbacks();

  // ۲. ناوبری و مهارت‌ها
  setupSkillsReveal();
  setupScrollSpy();

  // ۳. مودال‌ها، لایت‌باکس و کلیپ‌بورد
  setupLightbox();
  setupContactModal();
  setupClipboardActions();
  setupScrollToTop();
});

function setupSkillsReveal() {
  const skillsGrid = document.getElementById('skillsGrid');
  if (!skillsGrid) return;

  const cards = skillsGrid.querySelectorAll('.skill-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((card) => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillsGrid);
}

function setupLightbox() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');

  const open = (src, text) => {
    img.src = src;
    caption.textContent = text || '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    img.src = '';
  };

  document.querySelectorAll('.zoomable-mockup').forEach((el) => {
    el.addEventListener('click', () => {
      open(el.src, el.getAttribute('data-caption'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

function setupContactModal() {
  const modal = document.getElementById('contactModal');
  const openBtns = [
    document.getElementById('openContactBtn'),
    document.getElementById('footerContactBtn')
  ];
  const closeBtn = document.getElementById('closeContactBtn');

  const open = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  openBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', open);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

function setupClipboardActions() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-clipboard');
      const msg = btn.getAttribute('data-msg') || 'کپی شد!';
      copyText(text, msg);
    });
  });
}

function copyText(text, message) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2400);
  }
}

function setupScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-[#34D399]', 'font-medium');
      const href = link.getAttribute('href');
      if (href && href.includes(current)) {
        link.classList.add('text-[#34D399]', 'font-medium');
      }
    });
  });
}

function setupImageFallbacks() {
  document.querySelectorAll('.fallback-img').forEach((img) => {
    img.addEventListener('error', function () {
      const title = this.getAttribute('data-title') || 'پروژه';
      const size = this.getAttribute('data-size') || '600x400';
      this.src = generateSvgPlaceholder(title, size);
      this.onerror = null;
    });
  });
}

function generateSvgPlaceholder(title, dimensions) {
  let width = 800;
  let height = 480;
  if (dimensions && dimensions.includes('x')) {
    const parts = dimensions.split('x');
    width = parseInt(parts[0], 10) || 800;
    height = parseInt(parts[1], 10) || 480;
  }
  const cy = Math.round(height * 0.42);
  const ty = Math.round(height * 0.58);
  const dy = Math.round(height * 0.68);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18181B" />
          <stop offset="100%" stop-color="#0E0E10" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#grid)"/>
      <circle cx="${width / 2}" cy="${cy}" r="38" fill="#1F2937" stroke="#34D399" stroke-width="2"/>
      <path d="M${width / 2 - 14} ${cy + 12} L${width / 2 - 4} ${cy - 8} L${width / 2 + 8} ${cy + 4} L${width / 2 + 14} ${cy - 4} L${width / 2 + 20} ${cy + 12} Z" fill="#34D399" opacity="0.8"/>
      <text x="${width / 2}" y="${ty}" fill="#E4E4E7" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle" direction="rtl">${title}</text>
      <text x="${width / 2}" y="${dy}" fill="#71717A" font-size="13" font-family="sans-serif" text-anchor="middle">${dimensions}</text>
    </svg>
  `;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
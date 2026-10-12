/**
 * Mahdi Ghannad Portfolio - Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // ۱. راه‌اندازی فال‌بک تصاویر هوشمند پیش از بارگذاری
  setupImageFallbacks();

  // ۲. ناوبری و انیمیشن مهارت‌ها
  setupSkillsReveal();
  setupScrollSpy();

  // ۳. مودال‌ها، لایت‌باکس و اقدامات کاربر
  setupLightbox();
  setupContactModal();
  setupClipboardActions();
  setupScrollToTop();
});

/* انیمیشن نرم نمایش مهارت‌ها هنگام اسکرول */
function setupSkillsReveal() {
  const skillsGrid = document.getElementById('skillsGrid');
  if (!skillsGrid) return;

  const cards = skillsGrid.querySelectorAll('.skill-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;
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
  }, { threshold: 0.2 });

  observer.observe(skillsGrid);
}

/* لایت‌باکس بزرگنمایی نمونه‌کارها */
function setupLightbox() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');

  if (!modal || !img) return;

  const open = (src, text) => {
    img.src = src;
    if (caption) caption.textContent = text || '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // قفل اسکرول در حالت نمایش بزرگ
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    img.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.zoomable-mockup').forEach((el) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      open(el.src, el.getAttribute('data-caption'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

/* مودال تماس با من */
function setupContactModal() {
  const modal = document.getElementById('contactModal');
  const openBtns = [
    document.getElementById('openContactBtn'),
    document.getElementById('footerContactBtn')
  ];
  const closeBtn = document.getElementById('closeContactBtn');

  if (!modal) return;

  const open = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  openBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', open);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

/* کپی هوشمند آیدی تلگرام و جیمیل با پاپ‌آپ Toast */
function setupClipboardActions() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-clipboard');
      const msg = btn.getAttribute('data-msg') || 'کپی شد!';
      if (text) copyText(text, msg);
    });
  });
}

function copyText(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(message))
      .catch(() => fallbackCopyText(text, message));
  } else {
    fallbackCopyText(text, message);
  }
}

function fallbackCopyText(text, message) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    console.error('امکان کپی خودکار وجود ندارد', err);
  }
  document.body.removeChild(el);
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2400);
}

/* اسکرول روان به بالای صفحه */
function setupScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* هایلایت خودکار منو با اسکرول (ScrollSpy) */
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const activeIndicator = document.querySelector('.active-indicator');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const top = section.offsetTop - 180;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isTarget = href && href.includes(currentId);
      
      if (isTarget) {
        link.classList.add('text-[#34D399]', 'font-medium');
        link.classList.remove('text-zinc-300');
        if (activeIndicator && !link.contains(activeIndicator)) {
          link.appendChild(activeIndicator);
        }
      } else {
        link.classList.remove('text-[#34D399]', 'font-medium');
        link.classList.add('text-zinc-300');
      }
    });
  });
}

/* فال‌بک تصاویر: در صورت عدم وجود فایل در پوشه img */
function setupImageFallbacks() {
  document.querySelectorAll('.fallback-img').forEach((img) => {
    const handleFallback = () => {
      const title = img.getAttribute('data-title') || 'پروژه';
      const size = img.getAttribute('data-size') || '600x400';
      img.src = generateSvgPlaceholder(title, size);
      img.onerror = null;
    };

    img.addEventListener('error', handleFallback);
    
    // اگر عکس قبلاً شکسته شده باشد
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

/* ساخت پلیس‌هولدر SVG هماهنگ با تم تیره و خطوط نئونی */
function generateSvgPlaceholder(title, dimensions) {

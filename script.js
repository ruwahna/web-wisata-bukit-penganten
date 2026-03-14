// ── ACTIVE NAV SAAT SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length > 0 && navLinks.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.getAttribute('id');
      }
    });

    if (!current) return;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        link.classList.remove('active');
      }

      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ── NAVBAR SHADOW + SHRINK SAAT SCROLL ──
const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');

if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!nav.contains(target)) {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 980) {
      nav.style.height = 'auto';
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      return;
    }

    if (window.scrollY > 10) {
      nav.style.height = '52px';
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
      nav.style.height = '62px';
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }
  });
}

// ── SMOOTH SCROLL TOMBOL HERO ──
const heroScrollButtons = document.querySelectorAll('.hero-scroll-btn');

heroScrollButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSelector = btn.dataset.target || btn.getAttribute('href');
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && heroScrollButtons.length > 0) {
  const triggerHeroButtonPop = (btn) => {
    btn.classList.remove('hero-btn-js-pop');
    void btn.offsetWidth;
    btn.classList.add('hero-btn-js-pop');
  };

  heroScrollButtons.forEach((btn, index) => {
    setTimeout(() => triggerHeroButtonPop(btn), 650 + (index * 180));
  });

  let heroBtnIndex = 0;
  setInterval(() => {
    triggerHeroButtonPop(heroScrollButtons[heroBtnIndex]);
    heroBtnIndex = (heroBtnIndex + 1) % heroScrollButtons.length;
  }, 3200);
}

// ── ANIMASI FADE UP SAAT SCROLL (HOME + TENTANG KAMI) ──
const fadeTargets = document.querySelectorAll(
  '.mengenal-kiri, .mengenal-card, .about-section, .about-image-row img, .about-banner img, .about-komitmen-card, .about-lokasi-wrap, .about-lokasi-map, .about-lokasi-info, .about-lokasi-info li'
);

if (fadeTargets.length > 0) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    fadeTargets.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeTargets.forEach((el) => {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  }
}

// ── SETUP DRAG SCROLL + LIHAT SEMUA UNTUK SEMUA SLIDER ──
const setupHorizontalSlider = ({ sliderId, cardSelector, buttonSelector }) => {
  const sliderEl = document.getElementById(sliderId);
  if (!sliderEl) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  sliderEl.addEventListener('mousedown', (e) => {
    isDown = true;
    sliderEl.classList.add('dragging');
    startX = e.pageX - sliderEl.offsetLeft;
    scrollLeft = sliderEl.scrollLeft;
  });

  sliderEl.addEventListener('mouseleave', () => {
    isDown = false;
    sliderEl.classList.remove('dragging');
  });

  sliderEl.addEventListener('mouseup', () => {
    isDown = false;
    sliderEl.classList.remove('dragging');
  });

  sliderEl.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderEl.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderEl.scrollLeft = scrollLeft - walk;
  });

  sliderEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - sliderEl.offsetLeft;
    scrollLeft = sliderEl.scrollLeft;
  });

  sliderEl.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - sliderEl.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderEl.scrollLeft = scrollLeft - walk;
  });

  const actionButton = document.querySelector(buttonSelector);
  const cardEl = sliderEl.querySelector(cardSelector);
  if (!actionButton || !cardEl) return;

  const updateButtonText = () => {
    const maxScroll = sliderEl.scrollWidth - sliderEl.clientWidth;
    if (sliderEl.scrollLeft < 10) {
      actionButton.textContent = 'Lihat Semua ›';
    } else if (sliderEl.scrollLeft >= maxScroll - 10) {
      actionButton.textContent = 'Kembali ke Awal ›';
    } else {
      actionButton.textContent = 'Selanjutnya ›';
    }
  };

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();
    const cardWidth = cardEl.offsetWidth + 20;
    const maxScroll = sliderEl.scrollWidth - sliderEl.clientWidth;

    if (sliderEl.scrollLeft >= maxScroll - 10) {
      sliderEl.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      sliderEl.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  });

  sliderEl.addEventListener('scroll', updateButtonText);
  updateButtonText();
};

setupHorizontalSlider({
  sliderId: 'slider',
  cardSelector: '.mengenal-card',
  buttonSelector: '.mengenal-lihat'
});

setupHorizontalSlider({
  sliderId: 'slider2',
  cardSelector: '.daya-tarik-card',
  buttonSelector: '.daya-tarik-lihat'
});

setupHorizontalSlider({
  sliderId: 'slider3',
  cardSelector: '.galeri-card',
  buttonSelector: '.galeri-lihat'
});
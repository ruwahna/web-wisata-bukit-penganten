// ── ACTIVE NAV SAAT SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


// ── NAVBAR SHADOW + SHRINK SAAT SCROLL ──
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.style.height = '52px';
    nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  } else {
    nav.style.height = '62px';
    nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  }
});


// ── SMOOTH SCROLL TOMBOL HERO ──
const heroScrollButtons = document.querySelectorAll('.hero-scroll-btn');

heroScrollButtons.forEach((btn) => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const targetSelector = btn.dataset.target || btn.getAttribute('href');
    const target = document.querySelector(targetSelector);
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


// ── ANIMASI FADE UP SAAT SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 150);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.mengenal-kiri, .mengenal-card').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});


// ── DRAG SCROLL SLIDER ──
const slider = document.getElementById('slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('dragging');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;
  slider.scrollLeft = scrollLeft - walk;
});


// ── TOUCH SUPPORT (HP) ──
slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;
  slider.scrollLeft = scrollLeft - walk;
});


// ── TOMBOL LIHAT SEMUA ──
const lihatSemua = document.querySelector('.mengenal-lihat');

lihatSemua.addEventListener('click', function(e) {
  e.preventDefault();
  const cardWidth = slider.querySelector('.mengenal-card').offsetWidth + 20;
  const maxScroll = slider.scrollWidth - slider.clientWidth;

  if (slider.scrollLeft >= maxScroll - 10) {
    slider.scrollTo({ left: 0, behavior: 'smooth' });
    lihatSemua.textContent = 'Lihat Semua ›';
  } else {
    slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    lihatSemua.textContent = 'Selanjutnya ›';
  }
});

slider.addEventListener('scroll', function() {
  const maxScroll = slider.scrollWidth - slider.clientWidth;
  if (slider.scrollLeft < 10) {
    lihatSemua.textContent = 'Lihat Semua ›';
  } else if (slider.scrollLeft >= maxScroll - 10) {
    lihatSemua.textContent = 'Kembali ke Awal ›';
  } else {
    lihatSemua.textContent = 'Selanjutnya ›';
  }
});

// ── DRAG SCROLL SLIDER2 ──
const slider2 = document.getElementById('slider2');
let isDown2 = false;
let startX2;
let scrollLeft2;

slider2.addEventListener('mousedown', (e) => {
  isDown2 = true;
  slider2.classList.add('dragging');
  startX2 = e.pageX - slider2.offsetLeft;
  scrollLeft2 = slider2.scrollLeft;
});

slider2.addEventListener('mouseleave', () => {
  isDown2 = false;
  slider2.classList.remove('dragging');
});

slider2.addEventListener('mouseup', () => {
  isDown2 = false;
  slider2.classList.remove('dragging');
});

slider2.addEventListener('mousemove', (e) => {
  if (!isDown2) return;
  e.preventDefault();
  const x = e.pageX - slider2.offsetLeft;
  const walk = (x - startX2) * 1.5;
  slider2.scrollLeft = scrollLeft2 - walk;
});

slider2.addEventListener('touchstart', (e) => {
  startX2 = e.touches[0].pageX - slider2.offsetLeft;
  scrollLeft2 = slider2.scrollLeft;
});

slider2.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - slider2.offsetLeft;
  const walk = (x - startX2) * 1.5;
  slider2.scrollLeft = scrollLeft2 - walk;
});

// ── TOMBOL LIHAT SEMUA DAYA TARIK ──
const lihatDayaTarik = document.querySelector('.daya-tarik-lihat');

lihatDayaTarik.addEventListener('click', function(e) {
  e.preventDefault();
  const cardWidth = slider2.querySelector('.daya-tarik-card').offsetWidth + 20;
  const maxScroll = slider2.scrollWidth - slider2.clientWidth;

  if (slider2.scrollLeft >= maxScroll - 10) {
    slider2.scrollTo({ left: 0, behavior: 'smooth' });
    lihatDayaTarik.textContent = 'Lihat Semua ›';
  } else {
    slider2.scrollBy({ left: cardWidth, behavior: 'smooth' });
    lihatDayaTarik.textContent = 'Selanjutnya ›';
  }
});

slider2.addEventListener('scroll', function() {
  const maxScroll = slider2.scrollWidth - slider2.clientWidth;
  if (slider2.scrollLeft < 10) {
    lihatDayaTarik.textContent = 'Lihat Semua ›';
  } else if (slider2.scrollLeft >= maxScroll - 10) {
    lihatDayaTarik.textContent = 'Kembali ke Awal ›';
  } else {
    lihatDayaTarik.textContent = 'Selanjutnya ›';
  }
});

// ── DRAG SCROLL SLIDER3 (GALERI) ──
const slider3 = document.getElementById('slider3');
const lihatGaleri = document.querySelector('.galeri-lihat');

if (slider3 && lihatGaleri) {
  let isDown3 = false;
  let startX3;
  let scrollLeft3;

  slider3.addEventListener('mousedown', (e) => {
    isDown3 = true;
    slider3.classList.add('dragging');
    startX3 = e.pageX - slider3.offsetLeft;
    scrollLeft3 = slider3.scrollLeft;
  });

  slider3.addEventListener('mouseleave', () => {
    isDown3 = false;
    slider3.classList.remove('dragging');
  });

  slider3.addEventListener('mouseup', () => {
    isDown3 = false;
    slider3.classList.remove('dragging');
  });

  slider3.addEventListener('mousemove', (e) => {
    if (!isDown3) return;
    e.preventDefault();
    const x = e.pageX - slider3.offsetLeft;
    const walk = (x - startX3) * 1.5;
    slider3.scrollLeft = scrollLeft3 - walk;
  });

  slider3.addEventListener('touchstart', (e) => {
    startX3 = e.touches[0].pageX - slider3.offsetLeft;
    scrollLeft3 = slider3.scrollLeft;
  });

  slider3.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - slider3.offsetLeft;
    const walk = (x - startX3) * 1.5;
    slider3.scrollLeft = scrollLeft3 - walk;
  });

  lihatGaleri.addEventListener('click', function(e) {
    e.preventDefault();
    const cardWidth = slider3.querySelector('.galeri-card').offsetWidth + 20;
    const maxScroll = slider3.scrollWidth - slider3.clientWidth;

    if (slider3.scrollLeft >= maxScroll - 10) {
      slider3.scrollTo({ left: 0, behavior: 'smooth' });
      lihatGaleri.textContent = 'Lihat Semua ›';
    } else {
      slider3.scrollBy({ left: cardWidth, behavior: 'smooth' });
      lihatGaleri.textContent = 'Selanjutnya ›';
    }
  });

  slider3.addEventListener('scroll', function() {
    const maxScroll = slider3.scrollWidth - slider3.clientWidth;
    if (slider3.scrollLeft < 10) {
      lihatGaleri.textContent = 'Lihat Semua ›';
    } else if (slider3.scrollLeft >= maxScroll - 10) {
      lihatGaleri.textContent = 'Kembali ke Awal ›';
    } else {
      lihatGaleri.textContent = 'Selanjutnya ›';
    }
  });
}
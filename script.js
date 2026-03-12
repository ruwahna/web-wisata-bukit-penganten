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
document.querySelector('.hero-btn').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#mengenal').scrollIntoView({ behavior: 'smooth' });
});


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
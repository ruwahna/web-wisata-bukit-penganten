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

document.que
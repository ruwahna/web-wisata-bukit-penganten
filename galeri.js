const galeriGrid = document.getElementById('slider3');

const escapeValue = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const imagePath = (url) => {
  if (!url) return 'assets/gmbr1.jpg';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

const renderGaleri = (items) => {
  if (!galeriGrid || !Array.isArray(items) || items.length === 0) return;

  galeriGrid.innerHTML = items
    .map(
      (item) => `
      <div class="galeri-card">
        <div class="galeri-img">
          <img src="${imagePath(item.gambar_url)}" alt="${escapeValue(item.judul)}" loading="lazy" decoding="async"/>
          <div class="overlay-hover"></div>
        </div>
        <div class="galeri-body">
          <h3>${escapeValue(item.judul)}</h3>
        </div>
      </div>
    `
    )
    .join('');
};

const loadGaleriPublik = async () => {
  if (!galeriGrid) return;

  try {
    const rows = await window.apiFetchJson('/api/galeri?kategori=galeri');
    renderGaleri(rows);
  } catch (_error) {
    // Fallback ke konten statis di HTML.
  }
};

loadGaleriPublik();

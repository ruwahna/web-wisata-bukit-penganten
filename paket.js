const paketGrid = document.getElementById('paketGrid');

const htmlEscape = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const mapImage = (url) => {
  if (!url) return 'assets/gmbr1.jpg';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

const renderPaket = (items) => {
  if (!items.length) {
    paketGrid.innerHTML = '<p>Belum ada data paket wisata.</p>';
    return;
  }

  paketGrid.innerHTML = items
    .map(
      (item) => `
      <article class="paket-card fade-up visible">
        <h3>${htmlEscape(item.nama_paket)}</h3>
        <div class="paket-thumb">
          <img src="${mapImage(item.gambar_url)}" alt="${htmlEscape(item.nama_paket)}" loading="lazy" decoding="async"/>
        </div>
        <p class="paket-harga">${htmlEscape(item.harga_label)}</p>
        <p class="paket-desc">${htmlEscape(item.deskripsi)}</p>
        <a href="${htmlEscape(item.detail_url || '#')}" class="paket-btn">Lihat Detail</a>
      </article>
    `
    )
    .join('');
};

const loadPaketPublik = async () => {
  if (!paketGrid) return;

  try {
    const data = await window.apiFetchJson('/api/paket');
    renderPaket(data);
  } catch (_error) {
    // Jika API belum dijalankan, konten statis di HTML tetap tampil.
  }
};

loadPaketPublik();

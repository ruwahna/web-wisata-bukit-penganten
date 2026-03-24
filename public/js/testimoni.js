const testimoniList = document.getElementById('testimoniList');

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const renderStars = (rating) => {
  const safe = Math.max(1, Math.min(5, Number(rating) || 5));
  return '★'.repeat(safe) + '☆'.repeat(5 - safe);
};

const parseHighlights = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

const renderTestimoni = (items) => {
  if (!testimoniList || !Array.isArray(items) || items.length === 0) return;

  testimoniList.innerHTML = items
    .map((item) => {
      const highlights = parseHighlights(item.highlights);
      const highlightItems = highlights.length
        ? highlights.map((text) => `<li>${escapeHtml(text)}</li>`).join('')
        : '<li>Pengalaman menyenangkan bersama keluarga</li>';

      return `
        <article class="review-card fade-up visible">
          <div class="review-stars">${renderStars(item.rating)}</div>
          <h3>${escapeHtml(item.nama_pengunjung)} - ${escapeHtml(item.kota)}</h3>
          <ul>
            ${highlightItems}
          </ul>
          <p>${escapeHtml(item.komentar)}</p>
        </article>
      `;
    })
    .join('');
};

const loadTestimoniPublik = async () => {
  if (!testimoniList) return;

  try {
    const rows = await window.apiFetchJson('/api/testimoni');
    renderTestimoni(rows);
  } catch (_error) {
    // Fallback ke konten statis di HTML.
  }
};

loadTestimoniPublik();

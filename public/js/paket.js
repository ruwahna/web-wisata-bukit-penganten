const paketGrid = document.getElementById('paketGrid');
const DEFAULT_WA_NUMBER = '6285233749306';

let paketItems = [];
let paketById = new Map();
let selectedPaketId = null;

const htmlEscape = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const mapImage = (url) => {
  if (!url) return 'assets/gmbr1.jpg';
  return url;
};

const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'paket';

const formatRupiah = (value) => {
  const amount = Number(value) || 0;
  return `Rp${amount.toLocaleString('id-ID')}`;
};

const normalizeHargaLabel = (label) => {
  const text = String(label ?? '').trim();
  if (!text) return 'Harga belum tersedia';
  return /^harga\s*:/i.test(text) ? text : `Harga: ${text}`;
};

const extractHargaUtama = (hargaLabel) => {
  const match = String(hargaLabel ?? '').match(/Rp\s*([\d.]+)/i);
  if (!match) return 0;
  return Number(match[1].replace(/\./g, '')) || 0;
};

const getPaketMeta = (namaPaket, hargaLabel) => {
  const name = String(namaPaket ?? '').toLowerCase();
  const isPerPaket = /\/\s*paket/i.test(String(hargaLabel ?? ''));

  if (name.includes('adventure') || name.includes('goa & bukit')) {
    return {
      durasi: '4-5 jam',
      jadwal: 'Sesi pagi atau siang (08.00-15.00 WIB)',
      peserta: 'Minimal 1 orang',
      unitLabel: 'orang',
      fasilitas: ['Pemandu lokal', 'Tiket masuk area Goa & Bukit', 'Briefing keamanan', 'Dokumentasi spot utama'],
      catatan: 'Direkomendasikan memakai sepatu anti-slip dan membawa air minum.'
    };
  }

  if (name.includes('river') || name.includes('underground')) {
    return {
      durasi: '3-4 jam',
      jadwal: 'Sesi terbatas (09.00-14.00 WIB)',
      peserta: 'Minimal 2 orang',
      unitLabel: 'orang',
      fasilitas: ['Pemandu cave tubing', 'Peralatan safety standar', 'Pendamping area sungai bawah tanah', 'Foto dokumentasi titik utama'],
      catatan: 'Wajib mengikuti instruksi pemandu karena kontur medan basah.'
    };
  }

  if (name.includes('sunset') || name.includes('family') || name.includes('relax')) {
    return {
      durasi: '2-3 jam',
      jadwal: 'Sore hari (15.30-18.00 WIB)',
      peserta: 'Ideal untuk 2-4 orang',
      unitLabel: isPerPaket ? 'paket' : 'orang',
      fasilitas: ['Akses area sunset point', 'Spot foto keluarga', 'Pemandu ringan', 'Area santai keluarga'],
      catatan: 'Cocok untuk keluarga dan rombongan kecil.'
    };
  }

  return {
    durasi: '2-4 jam',
    jadwal: 'Menyesuaikan konfirmasi admin',
    peserta: 'Fleksibel sesuai paket',
    unitLabel: isPerPaket ? 'paket' : 'orang',
    fasilitas: ['Tiket masuk', 'Pendamping lokal', 'Briefing sebelum aktivitas'],
    catatan: 'Detail teknis akan dikirim setelah konfirmasi pemesanan.'
  };
};

const createPaketId = (item, index) => {
  const nameSlug = slugify(item.nama_paket);
  const baseId = item.id ?? index + 1;
  return `paket-${baseId}-${nameSlug}`;
};

const normalizeItems = (items) =>
  items.map((item, index) => {
    const hargaLabel = normalizeHargaLabel(item.harga_label);
    const meta = getPaketMeta(item.nama_paket, hargaLabel);

    return {
      ...item,
      _uid: createPaketId(item, index),
      harga_label: hargaLabel,
      _hargaUtama: extractHargaUtama(hargaLabel),
      _meta: meta,
      _unitLabel: meta.unitLabel,
    };
  });

const collectStaticItems = () => {
  if (!paketGrid) return [];

  const cards = [...paketGrid.querySelectorAll('.paket-card')];
  return cards.map((card, index) => {
    const title = card.querySelector('h3')?.textContent?.trim() || `Paket ${index + 1}`;
    const harga = card.querySelector('.paket-harga')?.textContent?.trim() || '';
    const desc = card.querySelector('.paket-desc')?.textContent?.trim() || '';
    const imageUrl = card.querySelector('.paket-thumb img')?.getAttribute('src') || '';
    const detailUrl = card.querySelector('.paket-btn')?.getAttribute('href') || '#';

    return {
      id: `static-${index + 1}`,
      nama_paket: title,
      harga_label: harga,
      deskripsi: desc,
      detail_url: detailUrl,
      gambar_url: imageUrl,
    };
  });
};

const setPaketData = (items) => {
  paketItems = normalizeItems(items);
  paketById = new Map(paketItems.map((item) => [item._uid, item]));
};

const buildCheckoutMessage = ({ item, qty, tanggal, total }) => {
  const tanggalText = tanggal || '-';
  return [
    'Halo Admin Wisata Goa Asrep & Bukit Penganten, saya ingin pesan tiket:',
    '',
    `Paket: ${item.nama_paket}`,
    `${item.harga_label}`,
    `Jumlah: ${qty} ${item._unitLabel}`,
    `Tanggal kunjungan: ${tanggalText}`,
    `Estimasi total: ${formatRupiah(total)}`,
    '',
    'Mohon info ketersediaan jadwal dan langkah pembayaran ya. Terima kasih.',
  ].join('\n');
};

const ensurePaketModal = () => {
  if (document.getElementById('paketDetailModal')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="paket-modal" id="paketDetailModal" aria-hidden="true">
      <div class="paket-modal-backdrop" data-close-paket-modal></div>
      <section class="paket-modal-panel" role="dialog" aria-modal="true" aria-labelledby="paketModalTitle">
        <button type="button" class="paket-modal-close" data-close-paket-modal aria-label="Tutup detail paket">&times;</button>
        <p class="paket-modal-label">Detail Paket & Pembelian Tiket</p>
        <h3 id="paketModalTitle" class="paket-modal-title"></h3>
        <p id="paketModalHarga" class="paket-modal-harga"></p>
        <p id="paketModalDesc" class="paket-modal-desc"></p>

        <div class="paket-modal-meta">
          <div><span>Durasi</span><strong id="paketModalDurasi"></strong></div>
          <div><span>Jadwal</span><strong id="paketModalJadwal"></strong></div>
          <div><span>Peserta</span><strong id="paketModalPeserta"></strong></div>
        </div>

        <ul id="paketModalFasilitas" class="paket-modal-fasilitas"></ul>
        <p id="paketModalCatatan" class="paket-modal-catatan"></p>

        <div class="paket-modal-order-box">
          <label for="paketQty">Jumlah tiket/paket</label>
          <input id="paketQty" type="number" min="1" max="20" value="1"/>

          <label for="paketTanggal">Tanggal kunjungan</label>
          <input id="paketTanggal" type="date"/>

          <p id="paketModalTotal" class="paket-modal-total"></p>

          <div class="paket-modal-actions">
            <a id="paketBtnWA" class="paket-btn paket-btn-primary" target="_blank" rel="noopener noreferrer">Pesan via WhatsApp</a>
            <a id="paketBtnForm" class="paket-btn paket-btn-secondary" href="kontak.html">Lanjut Isi Form Pemesanan</a>
            <a id="paketBtnDetailUrl" class="paket-link-more" target="_blank" rel="noopener noreferrer">Lihat halaman detail paket</a>
          </div>
        </div>
      </section>
    </div>
  `;

  document.body.appendChild(wrapper.firstElementChild);

  const modal = document.getElementById('paketDetailModal');
  const closeButtons = modal.querySelectorAll('[data-close-paket-modal]');
  const qtyInput = document.getElementById('paketQty');
  const dateInput = document.getElementById('paketTanggal');

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('paket-modal-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('paket-modal-open');
    }
  });

  qtyInput.addEventListener('input', updateCheckoutLinks);
  dateInput.addEventListener('change', updateCheckoutLinks);
};

const updateCheckoutLinks = () => {
  const item = paketById.get(selectedPaketId);
  if (!item) return;

  const qtyInput = document.getElementById('paketQty');
  const dateInput = document.getElementById('paketTanggal');
  const totalLabel = document.getElementById('paketModalTotal');
  const btnWA = document.getElementById('paketBtnWA');
  const btnForm = document.getElementById('paketBtnForm');

  const qty = Math.max(1, Math.min(20, Number(qtyInput.value) || 1));
  const tanggal = dateInput.value || '';
  const hargaSatuan = item._hargaUtama;
  const total = hargaSatuan > 0 ? hargaSatuan * qty : 0;

  totalLabel.textContent = hargaSatuan > 0
    ? `Estimasi total: ${formatRupiah(total)} (${qty} ${item._unitLabel})`
    : 'Estimasi total: menunggu informasi harga dari admin';

  const message = buildCheckoutMessage({ item, qty, tanggal, total });
  btnWA.href = `https://wa.me/${DEFAULT_WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const params = new URLSearchParams({
    paket: item.nama_paket,
    harga: item.harga_label,
    jumlah: `${qty} ${item._unitLabel}`,
    tanggal: tanggal || '-',
    total: total > 0 ? formatRupiah(total) : 'Konfirmasi admin',
  });
  btnForm.href = `kontak.html?${params.toString()}`;
};

const openPaketModal = (paketId) => {
  const item = paketById.get(paketId);
  if (!item) return;

  ensurePaketModal();
  selectedPaketId = paketId;

  const modal = document.getElementById('paketDetailModal');
  const title = document.getElementById('paketModalTitle');
  const harga = document.getElementById('paketModalHarga');
  const desc = document.getElementById('paketModalDesc');
  const durasi = document.getElementById('paketModalDurasi');
  const jadwal = document.getElementById('paketModalJadwal');
  const peserta = document.getElementById('paketModalPeserta');
  const fasilitas = document.getElementById('paketModalFasilitas');
  const catatan = document.getElementById('paketModalCatatan');
  const qtyInput = document.getElementById('paketQty');
  const dateInput = document.getElementById('paketTanggal');
  const btnDetailUrl = document.getElementById('paketBtnDetailUrl');

  title.textContent = item.nama_paket;
  harga.textContent = item.harga_label;
  desc.textContent = item.deskripsi || 'Detail deskripsi paket akan disampaikan oleh admin.';
  durasi.textContent = item._meta.durasi;
  jadwal.textContent = item._meta.jadwal;
  peserta.textContent = item._meta.peserta;
  catatan.textContent = item._meta.catatan;

  fasilitas.innerHTML = item._meta.fasilitas
    .map((row) => `<li>${htmlEscape(row)}</li>`)
    .join('');

  qtyInput.value = '1';
  dateInput.value = '';

  if (item.detail_url && item.detail_url !== '#') {
    btnDetailUrl.href = item.detail_url;
    btnDetailUrl.style.display = 'inline-flex';
  } else {
    btnDetailUrl.removeAttribute('href');
    btnDetailUrl.style.display = 'none';
  }

  updateCheckoutLinks();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('paket-modal-open');
};

const renderPaket = (items) => {
  if (!items.length) {
    paketGrid.innerHTML = '<p>Belum ada data paket wisata.</p>';
    return;
  }

  setPaketData(items);

  paketGrid.innerHTML = paketItems
    .map(
      (item) => `
      <article class="paket-card fade-up visible">
        <h3>${htmlEscape(item.nama_paket)}</h3>
        <div class="paket-thumb">
          <img src="${mapImage(item.gambar_url)}" alt="${htmlEscape(item.nama_paket)}" loading="lazy" decoding="async"/>
        </div>
        <p class="paket-harga">${htmlEscape(item.harga_label)}</p>
        <p class="paket-desc">${htmlEscape(item.deskripsi)}</p>
        <button type="button" class="paket-btn js-paket-detail" data-paket-id="${htmlEscape(item._uid)}">Lihat Detail &amp; Beli Tiket</button>
      </article>
    `
    )
    .join('');
};

const bindPaketEvents = () => {
  if (!paketGrid) return;

  paketGrid.addEventListener('click', (event) => {
    const trigger = event.target.closest('.js-paket-detail');
    if (!trigger) return;

    openPaketModal(trigger.dataset.paketId || '');
  });
};

const loadPaketPublik = async () => {
  if (!paketGrid) return;

  const staticItems = collectStaticItems();
  if (staticItems.length) {
    renderPaket(staticItems);
  }

  try {
    const data = await window.apiFetchJson('/api/paket');
    renderPaket(data);
  } catch (_error) {
    // Jika API belum dijalankan, konten statis di HTML tetap tampil.
  }
};

bindPaketEvents();
loadPaketPublik();

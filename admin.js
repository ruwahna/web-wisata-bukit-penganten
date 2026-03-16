const paketForm = document.getElementById('paketForm');
const paketResetBtn = document.getElementById('paketReset');
const paketTableBody = document.getElementById('paketTableBody');
const galeriForm = document.getElementById('galeriForm');
const galeriTableBody = document.getElementById('galeriTableBody');
const fasilitasForm = document.getElementById('fasilitasForm');
const fasilitasTableBody = document.getElementById('fasilitasTableBody');
const pesanTableBody = document.getElementById('pesanTableBody');

const toImagePath = (src) => {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('/')) return src;
  return `/${src}`;
};

const htmlEscape = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const fmtDate = (isoDate) => {
  try {
    return new Date(isoDate).toLocaleString('id-ID');
  } catch {
    return '-';
  }
};

const notify = (message) => {
  window.alert(message);
};

const resetPaketForm = () => {
  paketForm.reset();
  document.getElementById('paketId').value = '';
  document.getElementById('detail_url').value = '#';
};

const loadPaket = async () => {
  const response = await fetch('/api/admin/paket');
  const rows = await response.json();

  paketTableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${htmlEscape(row.nama_paket)}</td>
        <td>${htmlEscape(row.harga_label)}</td>
        <td><img class="admin-thumb" src="${toImagePath(row.gambar_url)}" alt="${htmlEscape(row.nama_paket)}" loading="lazy" decoding="async"/></td>
        <td class="admin-actions-cell">
          <button type="button" data-edit='${JSON.stringify(row).replaceAll("'", '&#39;')}' class="btn-secondary btn-edit">Edit</button>
          <button type="button" data-id="${row.id}" class="btn-danger btn-delete-paket">Hapus</button>
        </td>
      </tr>
    `
    )
    .join('');
};

const loadGaleri = async () => {
  const response = await fetch('/api/admin/galeri');
  const rows = await response.json();

  galeriTableBody.innerHTML = rows
    .filter((row) => row.kategori === 'galeri')
    .map(
      (row) => `
      <tr>
        <td>${htmlEscape(row.judul)}</td>
        <td><img class="admin-thumb" src="${toImagePath(row.gambar_url)}" alt="${htmlEscape(row.judul)}" loading="lazy" decoding="async"/></td>
        <td><button type="button" data-id="${row.id}" class="btn-danger btn-delete-galeri">Hapus</button></td>
      </tr>
    `
    )
    .join('');
};

const loadFasilitas = async () => {
  const response = await fetch('/api/admin/fasilitas');
  const rows = await response.json();

  fasilitasTableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${htmlEscape(row.nama_fasilitas)}</td>
        <td><img class="admin-thumb" src="${toImagePath(row.gambar_url)}" alt="${htmlEscape(row.nama_fasilitas)}" loading="lazy" decoding="async"/></td>
        <td><button type="button" data-id="${row.id}" class="btn-danger btn-delete-fasilitas">Hapus</button></td>
      </tr>
    `
    )
    .join('');
};

const loadPesan = async () => {
  const response = await fetch('/api/admin/pesan');
  const rows = await response.json();

  pesanTableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${htmlEscape(row.nama)}</td>
        <td>${htmlEscape(row.email)}</td>
        <td>${htmlEscape(row.pesan)}</td>
        <td>${fmtDate(row.created_at)}</td>
      </tr>
    `
    )
    .join('');
};

const loadAll = async () => {
  try {
    await Promise.all([loadPaket(), loadGaleri(), loadFasilitas(), loadPesan()]);
  } catch (error) {
    notify(`Gagal memuat data admin: ${error.message}`);
  }
};

paketForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const paketId = document.getElementById('paketId').value;
  const formData = new FormData(paketForm);

  try {
    const endpoint = paketId ? `/api/admin/paket/${paketId}` : '/api/admin/paket';
    const method = paketId ? 'PUT' : 'POST';

    const response = await fetch(endpoint, { method, body: formData });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal menyimpan paket.');
    }

    notify(result.message || 'Data paket tersimpan.');
    resetPaketForm();
    await loadPaket();
  } catch (error) {
    notify(error.message);
  }
});

paketResetBtn.addEventListener('click', () => {
  resetPaketForm();
});

document.addEventListener('click', async (event) => {
  const editBtn = event.target.closest('.btn-edit');
  if (editBtn) {
    const data = JSON.parse(editBtn.getAttribute('data-edit').replaceAll('&#39;', "'"));
    document.getElementById('paketId').value = data.id;
    document.getElementById('nama_paket').value = data.nama_paket || '';
    document.getElementById('harga_label').value = data.harga_label || '';
    document.getElementById('deskripsi').value = data.deskripsi || '';
    document.getElementById('detail_url').value = data.detail_url || '#';
    return;
  }

  const deletePaketBtn = event.target.closest('.btn-delete-paket');
  if (deletePaketBtn) {
    if (!window.confirm('Hapus paket ini?')) return;

    const id = deletePaketBtn.getAttribute('data-id');
    const response = await fetch(`/api/admin/paket/${id}`, { method: 'DELETE' });
    const result = await response.json();
    notify(result.message || 'Paket dihapus.');
    await loadPaket();
    return;
  }

  const deleteGaleriBtn = event.target.closest('.btn-delete-galeri');
  if (deleteGaleriBtn) {
    if (!window.confirm('Hapus gambar galeri ini?')) return;

    const id = deleteGaleriBtn.getAttribute('data-id');
    const response = await fetch(`/api/admin/galeri/${id}`, { method: 'DELETE' });
    const result = await response.json();
    notify(result.message || 'Galeri dihapus.');
    await loadGaleri();
    return;
  }

  const deleteFasilitasBtn = event.target.closest('.btn-delete-fasilitas');
  if (deleteFasilitasBtn) {
    if (!window.confirm('Hapus gambar fasilitas ini?')) return;

    const id = deleteFasilitasBtn.getAttribute('data-id');
    const response = await fetch(`/api/admin/fasilitas/${id}`, { method: 'DELETE' });
    const result = await response.json();
    notify(result.message || 'Fasilitas dihapus.');
    await loadFasilitas();
  }
});

galeriForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(galeriForm);
  formData.set('kategori', 'galeri');

  try {
    const response = await fetch('/api/admin/galeri', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal upload galeri.');
    }

    notify(result.message || 'Upload galeri berhasil.');
    galeriForm.reset();
    await loadGaleri();
  } catch (error) {
    notify(error.message);
  }
});

fasilitasForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(fasilitasForm);

  try {
    const response = await fetch('/api/admin/fasilitas', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal upload fasilitas.');
    }

    notify(result.message || 'Upload fasilitas berhasil.');
    fasilitasForm.reset();
    await loadFasilitas();
  } catch (error) {
    notify(error.message);
  }
});

loadAll();

const paketForm = document.getElementById('paketForm');
const paketResetBtn = document.getElementById('paketReset');
const paketTableBody = document.getElementById('paketTableBody');
const testimoniForm = document.getElementById('testimoniForm');
const testimoniTableBody = document.getElementById('testimoniTableBody');
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
  const rows = await window.apiFetchJson('/api/admin/paket');

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

const loadTestimoni = async () => {
  const rows = await window.apiFetchJson('/api/admin/testimoni');

  testimoniTableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${htmlEscape(row.nama_pengunjung)}</td>
        <td>${htmlEscape(row.kota)}</td>
        <td>${htmlEscape(row.rating)}</td>
        <td>${htmlEscape(row.komentar)}</td>
        <td><button type="button" data-id="${row.id}" class="btn-danger btn-delete-testimoni">Hapus</button></td>
      </tr>
    `
    )
    .join('');
};

const loadGaleri = async () => {
  const rows = await window.apiFetchJson('/api/admin/galeri');

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
  const rows = await window.apiFetchJson('/api/admin/fasilitas');

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
  const rows = await window.apiFetchJson('/api/admin/pesan');

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
    await Promise.all([loadPaket(), loadTestimoni(), loadGaleri(), loadFasilitas(), loadPesan()]);
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

    const result = await window.apiFetchJson(endpoint, { method, body: formData });

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
    const result = await window.apiFetchJson(`/api/admin/paket/${id}`, { method: 'DELETE' });
    notify(result.message || 'Paket dihapus.');
    await loadPaket();
    return;
  }

  const deleteTestimoniBtn = event.target.closest('.btn-delete-testimoni');
  if (deleteTestimoniBtn) {
    if (!window.confirm('Hapus testimoni ini?')) return;

    const id = deleteTestimoniBtn.getAttribute('data-id');
    const result = await window.apiFetchJson(`/api/admin/testimoni/${id}`, { method: 'DELETE' });
    notify(result.message || 'Testimoni dihapus.');
    await loadTestimoni();
    return;
  }

  const deleteGaleriBtn = event.target.closest('.btn-delete-galeri');
  if (deleteGaleriBtn) {
    if (!window.confirm('Hapus gambar galeri ini?')) return;

    const id = deleteGaleriBtn.getAttribute('data-id');
    const result = await window.apiFetchJson(`/api/admin/galeri/${id}`, { method: 'DELETE' });
    notify(result.message || 'Galeri dihapus.');
    await loadGaleri();
    return;
  }

  const deleteFasilitasBtn = event.target.closest('.btn-delete-fasilitas');
  if (deleteFasilitasBtn) {
    if (!window.confirm('Hapus gambar fasilitas ini?')) return;

    const id = deleteFasilitasBtn.getAttribute('data-id');
    const result = await window.apiFetchJson(`/api/admin/fasilitas/${id}`, { method: 'DELETE' });
    notify(result.message || 'Fasilitas dihapus.');
    await loadFasilitas();
  }
});

testimoniForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(testimoniForm);
  const payload = {
    nama_pengunjung: (formData.get('nama_pengunjung') || '').toString().trim(),
    kota: (formData.get('kota') || '').toString().trim(),
    rating: Number(formData.get('rating') || 5),
    highlights: (formData.get('highlights') || '').toString().trim(),
    komentar: (formData.get('komentar') || '').toString().trim(),
  };

  try {
    const result = await window.apiFetchJson('/api/admin/testimoni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    notify(result.message || 'Testimoni tersimpan.');
    testimoniForm.reset();
    document.getElementById('rating_pengunjung').value = '5';
    await loadTestimoni();
  } catch (error) {
    notify(error.message);
  }
});

galeriForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(galeriForm);
  formData.set('kategori', 'galeri');

  try {
    const result = await window.apiFetchJson('/api/admin/galeri', {
      method: 'POST',
      body: formData,
    });

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
    const result = await window.apiFetchJson('/api/admin/fasilitas', {
      method: 'POST',
      body: formData,
    });

    notify(result.message || 'Upload fasilitas berhasil.');
    fasilitasForm.reset();
    await loadFasilitas();
  } catch (error) {
    notify(error.message);
  }
});

loadAll();

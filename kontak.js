const kontakForm = document.getElementById('kontakForm');
const kontakStatus = document.getElementById('kontakStatus');

if (kontakForm && kontakStatus) {
  kontakForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(kontakForm);
    const payload = {
      nama: (formData.get('nama') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      pesan: (formData.get('pesan') || '').toString().trim(),
    };

    if (!payload.nama || !payload.email || !payload.pesan) {
      kontakStatus.textContent = 'Mohon isi nama, email, dan pesan.';
      kontakStatus.className = 'kontak-status error';
      return;
    }

    try {
      kontakStatus.textContent = 'Mengirim pesan...';
      kontakStatus.className = 'kontak-status loading';

      const result = await window.apiFetchJson('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      kontakStatus.textContent = result.message || 'Pesan berhasil dikirim.';
      kontakStatus.className = 'kontak-status success';
      kontakForm.reset();
    } catch (error) {
      kontakStatus.textContent = error.message;
      kontakStatus.className = 'kontak-status error';
    }
  });
}

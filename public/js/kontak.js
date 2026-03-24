const kontakForm = document.getElementById('kontakForm');
const kontakStatus = document.getElementById('kontakStatus');
const kontakWaLink = document.getElementById('kontakWaLink');
const ADMIN_WA_NUMBER = '6285233749306';

const normalizeWaNumber = (value) => {
  const raw = String(value || '').replace(/[^\d+]/g, '').trim();
  if (!raw) return '';

  if (raw.startsWith('+62')) return `62${raw.slice(3)}`;
  if (raw.startsWith('62')) return raw;
  if (raw.startsWith('0')) return `62${raw.slice(1)}`;
  return raw;
};

const buildAdminWaMessage = (payload) => [
  'Halo Admin Wisata Goa Asrep & Bukit Penganten, saya mengirim form pemesanan:',
  '',
  `Nama: ${payload.nama}`,
  `Email: ${payload.email}`,
  `WhatsApp: ${payload.no_wa}`,
  '',
  'Pesan:',
  payload.pesan,
].join('\n');

const prefillFromPaketCheckout = () => {
  if (!kontakForm) return;

  const params = new URLSearchParams(window.location.search);
  const paket = params.get('paket');
  const harga = params.get('harga');
  const jumlah = params.get('jumlah');
  const tanggal = params.get('tanggal');
  const total = params.get('total');

  if (!paket) return;

  const pesanInput = kontakForm.querySelector('#kontak_pesan');
  if (!pesanInput) return;

  if (pesanInput.value.trim()) return;

  const prefilledMessage = [
    'Halo Admin, saya ingin melakukan pemesanan tiket wisata.',
    '',
    `Paket: ${paket}`,
    `Harga: ${harga || '-'}`,
    `Jumlah: ${jumlah || '-'}`,
    `Tanggal kunjungan: ${tanggal || '-'}`,
    `Estimasi total: ${total || '-'}`,
    '',
    'Mohon konfirmasi ketersediaan dan informasi pembayarannya. Terima kasih.',
  ].join('\n');

  pesanInput.value = prefilledMessage;
};

if (kontakForm && kontakStatus) {
  prefillFromPaketCheckout();

  kontakForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(kontakForm);
    const payload = {
      nama: (formData.get('nama') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      no_wa: normalizeWaNumber((formData.get('no_wa') || '').toString().trim()),
      pesan: (formData.get('pesan') || '').toString().trim(),
    };

    if (!payload.nama || !payload.email || !payload.no_wa || !payload.pesan) {
      kontakStatus.textContent = 'Mohon isi nama, email, nomor WhatsApp, dan pesan.';
      kontakStatus.className = 'kontak-status error';
      if (kontakWaLink) {
        kontakWaLink.hidden = true;
      }
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

      if (kontakWaLink) {
        const waText = buildAdminWaMessage(payload);
        kontakWaLink.href = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waText)}`;
        kontakWaLink.hidden = false;
      }

      kontakForm.reset();
    } catch (error) {
      kontakStatus.textContent = error.message;
      kontakStatus.className = 'kontak-status error';
      if (kontakWaLink) {
        kontakWaLink.hidden = true;
      }
    }
  });
}

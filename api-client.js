(function () {
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  const defaultBase = isLocal && window.location.port !== '3000' ? 'http://localhost:3000' : '';

  window.API_BASE = window.API_BASE || defaultBase;

  window.apiFetchJson = async function apiFetchJson(path, options) {
    const url = `${window.API_BASE}${path}`;
    const response = await fetch(url, options || {});
    const rawText = await response.text();

    let result = {};
    if (rawText) {
      try {
        result = JSON.parse(rawText);
      } catch (_error) {
        throw new Error(
          `Endpoint ${url} tidak mengembalikan JSON. Pastikan backend aktif lewat: npm start`
        );
      }
    }

    if (!response.ok) {
      throw new Error(result.message || `Request gagal (${response.status}).`);
    }

    return result;
  };
})();

(function () {
  const host = window.location.hostname;
  const protocol = window.location.protocol || 'http:';
  const customBase = (window.API_BASE || '').trim();

  const uniq = (items) => Array.from(new Set(items.filter(Boolean)));

  const getBaseCandidates = () => {
    if (customBase) return [customBase];

    const list = [''];

    if (window.location.port !== '3000') {
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        list.push(`${protocol}//${host}:3000`);
      }

      list.push('http://localhost:3000');
      list.push('http://127.0.0.1:3000');
    }

    return uniq(list);
  };

  window.apiFetchJson = async function apiFetchJson(path, options) {
    const safePath = String(path || '').startsWith('/') ? path : `/${path}`;
    const candidates = getBaseCandidates();

    let lastError = null;

    for (let index = 0; index < candidates.length; index += 1) {
      const base = candidates[index];
      const url = `${base}${safePath}`;

      try {
        const response = await fetch(url, options || {});
        const rawText = await response.text();

        let result = {};
        if (rawText) {
          try {
            result = JSON.parse(rawText);
          } catch (_parseError) {
            const isLast = index === candidates.length - 1;
            if (!isLast) {
              continue;
            }

            throw new Error(
              `Endpoint ${url} tidak mengembalikan JSON. Pastikan backend aktif lewat: npm start`
            );
          }
        }

        if (!response.ok) {
          throw new Error(result.message || `Request gagal (${response.status}).`);
        }

        if (!customBase && base) {
          window.API_BASE = base;
        }

        return result;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Tidak dapat terhubung ke API. Pastikan backend aktif lewat: npm start');
  };
})();

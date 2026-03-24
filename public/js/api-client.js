(function () {
  /**
   * API Client — auto-detects base URL.
   * Karena frontend di-serve oleh server Express yang sama,
   * kita cukup pakai relative URL (tanpa host:port).
   */
  window.apiFetchJson = async function apiFetchJson(path, options) {
    const safePath = String(path || '').startsWith('/') ? path : `/${path}`;

    try {
      const response = await fetch(safePath, options || {});
      const rawText = await response.text();

      let result = {};
      if (rawText) {
        try {
          result = JSON.parse(rawText);
        } catch (_parseError) {
          throw new Error(
            `Endpoint ${safePath} tidak mengembalikan JSON. Pastikan backend aktif lewat: npm start`
          );
        }
      }

      if (!response.ok) {
        throw new Error(result.message || `Request gagal (${response.status}).`);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };
})();

// Fiş fotoğraflarını IndexedDB'de saklar (localStorage'ı doldurmamak için).
// Görseller kaydedilmeden önce küçültülür.

const DB_NAME = "harcama_fotolar";
const STORE = "fotolar";

function dbAc() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function fotoKaydet(id, blob) {
  const db = await dbAc();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function fotoGetir(id) {
  if (!id) return null;
  try {
    const db = await dbAc();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const r = tx.objectStore(STORE).get(id);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    });
  } catch (e) {
    return null;
  }
}

export async function fotoSil(id) {
  if (!id) return;
  try {
    const db = await dbAc();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    /* yoksay */
  }
}

export async function tumFotolariSil() {
  try {
    const db = await dbAc();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    /* yoksay */
  }
}

export const yeniFotoId = () =>
  "foto_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Görseli en fazla `maxKenar` piksele küçültüp JPEG blob döndürür.
// Herhangi bir adım başarısız olursa orijinal dosyayı döndürür.
export async function goruntuKucult(file, maxKenar = 1400, kalite = 0.72) {
  try {
    const dataUrl = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
    const img = await new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = dataUrl;
    });
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;
    if (w > maxKenar || h > maxKenar) {
      const oran = Math.min(maxKenar / w, maxKenar / h);
      w = Math.round(w * oran);
      h = Math.round(h * oran);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", kalite));
    return blob || file;
  } catch (e) {
    return file;
  }
}

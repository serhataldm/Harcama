// Verileri tarayıcının localStorage'ında saklar.
// (Artifact ortamındaki window.storage yerine normal web için localStorage.)

const STORAGE_KEY = "harcama_defteri_v1";

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.servisler)) return d;
    }
  } catch (e) {
    // bozuk/erişilemez veri — boş başla
  }
  return null;
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // kota dolu veya erişilemez — yoksay
  }
}

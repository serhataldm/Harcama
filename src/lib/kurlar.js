// Canlı döviz kurları — "1 [DÖVİZ] kaç ₺?"
// Ücretsiz ve anahtarsız bir API kullanır (open.er-api.com, ₺ tabanlı).
// Sonuç localStorage'a önbelleklenir; internet yokken (yurt dışında) son
// bilinen kurlar buradan okunur. Kur her zaman elle değiştirilebilir.

const CACHE_KEY = "harcama_kurlar_v1";
const API_URL = "https://open.er-api.com/v6/latest/TRY";
const TAZE_ARALIK = 10 * 60 * 1000; // aynı oturumda en fazla 10 dakikada bir istek

let sonIstek = 0;

// Önbellekteki kayıt: { ts, rates: { EUR: 0.0187, ... } }  (1 ₺ = rates[kod] döviz)
export function kurOnbellek() {
  try {
    const d = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (d && d.rates) return d;
  } catch {
    // bozuk kayıt — yok say
  }
  return null;
}

// 1 [kod] kaç ₺? Bilinmiyorsa null. (₺ tabanlı oranın tersi.)
export function guncelKur(kod) {
  if (kod === "TRY") return 1;
  const perTRY = kurOnbellek()?.rates?.[kod];
  if (!perTRY || perTRY <= 0) return null;
  return 1 / perTRY;
}

// Kurların en son ne zaman güncellendiği (ms). Yoksa null.
export function kurZamani() {
  return kurOnbellek()?.ts ?? null;
}

// İnternet varsa kurları tazeler ve önbelleğe yazar. Hata/çevrimdışı durumunda
// sessizce mevcut önbelleği döndürür (asla hata fırlatmaz).
export async function kurlariTazele() {
  const simdi = Date.now();
  const mevcut = kurOnbellek();
  if (mevcut && simdi - sonIstek < TAZE_ARALIK) return mevcut;
  sonIstek = simdi;
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();
    if (data && data.result === "success" && data.rates) {
      const kayit = { ts: Date.now(), rates: data.rates };
      localStorage.setItem(CACHE_KEY, JSON.stringify(kayit));
      return kayit;
    }
  } catch {
    // çevrimdışı ya da API hatası — önbellek kullanılacak
  }
  return mevcut;
}

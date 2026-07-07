// Sayı, para ve tarih biçimlendirme yardımcıları

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// "35,20" veya "1.234,56" gibi girdileri güvenli şekilde sayıya çevirir
export function parseNum(str) {
  if (str == null) return NaN;
  let s = String(str).trim().replace(/\s/g, "");
  if (s === "") return NaN;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) s = s.replace(/\./g, "").replace(",", ".");
  else if (hasComma) s = s.replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

const nfTL = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const nfRate = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export const fmt = (n) => nfTL.format(Number.isFinite(n) ? n : 0);
export const fmtRate = (n) => nfRate.format(Number.isFinite(n) ? n : 0);
export const tl = (n) => fmt(n) + " ₺";

export function bugunISO() {
  const d = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function tarihGoster(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Bir harcamanın TL karşılığı
export const harcamaTL = (h) =>
  (Number.isFinite(h.tutar) ? h.tutar : 0) * (Number.isFinite(h.kur) ? h.kur : 0);

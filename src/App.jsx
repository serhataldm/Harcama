import React, { useState, useEffect } from "react";
import { Plus, Wallet, Luggage, Coins } from "lucide-react";
import { loadData, saveData } from "./lib/storage.js";
import { uid, fmt, harcamaTL } from "./lib/format.js";
import { fotoSil, tumFotolariSil } from "./lib/photos.js";
import ServisKart from "./components/ServisKart.jsx";
import ServisDetay from "./components/ServisDetay.jsx";
import ServisFormu from "./components/ServisFormu.jsx";
import HarcamaFormu from "./components/HarcamaFormu.jsx";
import OzetModal from "./components/OzetModal.jsx";

export default function App() {
  const [data, setData] = useState(() => loadData() || { version: 1, servisler: [] });
  const [ekran, setEkran] = useState("liste"); // liste | detay
  const [aktifId, setAktifId] = useState(null);
  const [modal, setModal] = useState(null); // yeniServis | servisDuzenle | harcama | ozet
  const [duzenlenenHarcama, setDuzenlenenHarcama] = useState(null);

  // Her değişiklikte kalıcı olarak sakla
  useEffect(() => {
    saveData(data);
  }, [data]);

  const aktifServis = data.servisler.find((s) => s.id === aktifId) || null;

  /* --- veri işlemleri --- */
  const servisEkle = ({ ad, avans, not }) => {
    const yeni = { id: uid(), ad, avans, not, olusturma: Date.now(), harcamalar: [], sonKurlar: {} };
    setData((d) => ({ ...d, servisler: [yeni, ...d.servisler] }));
    setAktifId(yeni.id);
    setEkran("detay");
    setModal(null);
  };
  const servisGuncelle = (id, patch) =>
    setData((d) => ({ ...d, servisler: d.servisler.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const servisSil = (id) => {
    const s = data.servisler.find((x) => x.id === id);
    if (s) s.harcamalar.forEach((h) => h.fotoId && fotoSil(h.fotoId));
    setData((d) => ({ ...d, servisler: d.servisler.filter((s) => s.id !== id) }));
    setEkran("liste");
    setAktifId(null);
    setModal(null);
  };
  const harcamaKaydet = (servisId, h) => {
    setData((d) => ({
      ...d,
      servisler: d.servisler.map((s) => {
        if (s.id !== servisId) return s;
        const varMi = s.harcamalar.some((x) => x.id === h.id);
        const harcamalar = varMi ? s.harcamalar.map((x) => (x.id === h.id ? h : x)) : [...s.harcamalar, h];
        return { ...s, harcamalar, sonKurlar: { ...(s.sonKurlar || {}), [h.dovizKodu]: h.kur } };
      }),
    }));
    setModal(null);
    setDuzenlenenHarcama(null);
  };
  const harcamaSil = (servisId, harcamaId) => {
    const s = data.servisler.find((x) => x.id === servisId);
    const h = s && s.harcamalar.find((x) => x.id === harcamaId);
    if (h && h.fotoId) fotoSil(h.fotoId);
    setData((d) => ({
      ...d,
      servisler: d.servisler.map((s) =>
        s.id === servisId ? { ...s, harcamalar: s.harcamalar.filter((x) => x.id !== harcamaId) } : s
      ),
    }));
    setModal(null);
    setDuzenlenenHarcama(null);
  };
  const hepsiniSifirla = () => {
    if (confirm("Tüm servisler ve harcamalar kalıcı olarak silinsin mi? Bu işlem geri alınamaz.")) {
      tumFotolariSil();
      setData({ version: 1, servisler: [] });
      setEkran("liste");
      setAktifId(null);
    }
  };

  const genelToplam = data.servisler.reduce(
    (s, sv) => s + sv.harcamalar.reduce((a, h) => a + harcamaTL(h), 0),
    0
  );

  return (
    <div className="hd-root">
      {ekran === "liste" && (
        <div>
          {/* üst bar */}
          <div style={{ background: "var(--ink)", position: "sticky", top: 0, zIndex: 20, paddingTop: "env(safe-area-inset-top)" }}>
            <div style={{ maxWidth: 540, margin: "0 auto", padding: "18px 18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(199,162,78,.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                  <Wallet size={19} />
                </div>
                <div>
                  <div className="hd-disp" style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: ".02em" }}>Harcama Defteri</div>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: 11.5, marginTop: -1 }}>yurt dışı iş avansı takibi</div>
                </div>
              </div>
              {data.servisler.length > 0 && (
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11, letterSpacing: ".1em", fontWeight: 600, textTransform: "uppercase" }}>Tüm servisler — toplam</div>
                    <div className="hd-disp hd-num" style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginTop: 2 }}>
                      {fmt(genelToplam)} <span style={{ fontSize: 17, color: "rgba(255,255,255,.6)" }}>₺</span>
                    </div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12.5, textAlign: "right", paddingBottom: 4 }}>
                    {data.servisler.length} servis
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ maxWidth: 540, margin: "0 auto", padding: "18px 16px 40px" }}>
            {data.servisler.length === 0 ? (
              <div className="hd-card" style={{ padding: "40px 24px", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Luggage size={28} style={{ color: "var(--accent)" }} />
                </div>
                <div className="hd-disp" style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>İlk servisini oluştur</div>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, margin: "0 auto 22px", maxWidth: 320 }}>
                  Her görev / seyahat bir <b>servis</b>. Avansını gir, yurt dışında yaptığın döviz harcamalarını kuruyla birlikte ekle; TL karşılığı ve kalan bakiye otomatik hesaplansın.
                </p>
                <button className="hd-btn hd-btn-primary hd-tap" style={{ width: "100%", maxWidth: 280 }} onClick={() => setModal("yeniServis")}>
                  <Plus size={19} /> Yeni servis oluştur
                </button>
              </div>
            ) : (
              <>
                <button
                  className="hd-btn hd-btn-ghost hd-tap"
                  style={{ width: "100%", marginBottom: 14, borderStyle: "dashed", color: "var(--accent-2)" }}
                  onClick={() => setModal("yeniServis")}
                >
                  <Plus size={19} /> Yeni servis
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.servisler.map((s) => (
                    <ServisKart
                      key={s.id}
                      servis={s}
                      onClick={() => { setAktifId(s.id); setEkran("detay"); }}
                      onSil={() => servisSil(s.id)}
                    />
                  ))}
                </div>
              </>
            )}

            <div style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "var(--muted-2)", lineHeight: 1.6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Coins size={13} /> Veriler yalnızca bu cihazda saklanır.
              </div>
              {data.servisler.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={hepsiniSifirla}
                    style={{ background: "none", border: "none", color: "var(--muted-2)", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 4 }}
                  >
                    Tüm verileri sıfırla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {ekran === "detay" && aktifServis && (
        <ServisDetay
          servis={aktifServis}
          onGeri={() => { setEkran("liste"); setAktifId(null); }}
          onDuzenle={() => setModal("servisDuzenle")}
          onHarcamaEkle={() => { setDuzenlenenHarcama(null); setModal("harcama"); }}
          onHarcamaSec={(h) => { setDuzenlenenHarcama(h); setModal("harcama"); }}
          onOzet={() => setModal("ozet")}
        />
      )}

      {/* modallar */}
      {modal === "yeniServis" && <ServisFormu onSave={servisEkle} onClose={() => setModal(null)} />}
      {modal === "servisDuzenle" && aktifServis && (
        <ServisFormu
          initial={aktifServis}
          onSave={(patch) => { servisGuncelle(aktifServis.id, patch); setModal(null); }}
          onClose={() => setModal(null)}
          onDelete={() => servisSil(aktifServis.id)}
        />
      )}
      {modal === "harcama" && aktifServis && (
        <HarcamaFormu
          servis={aktifServis}
          initial={duzenlenenHarcama}
          onSave={(h) => harcamaKaydet(aktifServis.id, h)}
          onClose={() => { setModal(null); setDuzenlenenHarcama(null); }}
          onDelete={duzenlenenHarcama ? () => harcamaSil(aktifServis.id, duzenlenenHarcama.id) : undefined}
        />
      )}
      {modal === "ozet" && aktifServis && <OzetModal servis={aktifServis} onClose={() => setModal(null)} />}
    </div>
  );
}

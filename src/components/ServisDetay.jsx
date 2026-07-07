import React, { useMemo } from "react";
import { ChevronLeft, Pencil, FileText, Plus, Luggage, Receipt } from "lucide-react";
import { KATEGORILER, KAT_MAP } from "../data/categories.js";
import { PB_MAP } from "../data/currencies.js";
import { fmt, fmtRate, tarihGoster, harcamaTL } from "../lib/format.js";
import Donut from "./Donut.jsx";
import KategoriRozeti from "./KategoriRozeti.jsx";
import { FotoKucuk } from "./Foto.jsx";

function BoardFigure({ etiket, deger, renk, vurgu }) {
  return (
    <div
      style={{
        flex: 1,
        background: vurgu ? "rgba(255,255,255,.06)" : "transparent",
        borderRadius: 12,
        padding: vurgu ? "10px 12px" : "10px 2px",
      }}
    >
      <div style={{ fontSize: 10.5, letterSpacing: ".08em", color: "rgba(255,255,255,.5)", fontWeight: 600, textTransform: "uppercase" }}>
        {etiket}
      </div>
      <div className="hd-disp hd-num" style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: renk }}>{deger}</div>
    </div>
  );
}

export default function ServisDetay({ servis, onGeri, onDuzenle, onHarcamaEkle, onHarcamaSec, onOzet }) {
  const toplam = servis.harcamalar.reduce((s, h) => s + harcamaTL(h), 0);
  const kalan = servis.avans != null ? servis.avans - toplam : null;
  const asim = kalan != null && kalan < 0;

  const katToplam = useMemo(() => {
    const m = {};
    servis.harcamalar.forEach((h) => {
      m[h.kategori] = (m[h.kategori] || 0) + harcamaTL(h);
    });
    return KATEGORILER.map((kat) => ({ ...kat, value: m[kat.k] || 0 }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [servis]);

  const segments = katToplam.map((k) => ({ value: k.value, color: k.renk }));

  const dovizToplam = useMemo(() => {
    const m = {};
    servis.harcamalar.forEach((h) => {
      m[h.dovizKodu] = (m[h.dovizKodu] || 0) + (Number.isFinite(h.tutar) ? h.tutar : 0);
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [servis]);

  const sirali = [...servis.harcamalar].sort((a, b) => (a.tarih === b.tarih ? 0 : a.tarih < b.tarih ? 1 : -1));

  return (
    <div style={{ paddingBottom: 96 }}>
      {/* üst bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--ink)", paddingTop: "env(safe-area-inset-top)" }}>
        <div style={{ maxWidth: 540, margin: "0 auto", display: "flex", alignItems: "center", gap: 4, padding: "8px 8px" }}>
          <button className="hd-icon-btn dark" style={{ color: "#fff" }} onClick={onGeri} aria-label="Geri">
            <ChevronLeft size={24} />
          </button>
          <div
            className="hd-disp"
            style={{ flex: 1, color: "#fff", fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {servis.ad}
          </div>
          <button className="hd-icon-btn dark" style={{ color: "#fff" }} onClick={onOzet} aria-label="Teslim özeti">
            <FileText size={20} />
          </button>
          <button className="hd-icon-btn dark" style={{ color: "#fff" }} onClick={onDuzenle} aria-label="Servisi düzenle">
            <Pencil size={19} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "16px 16px 0" }}>
        {/* board — özet göstergesi */}
        <div className="hd-board" style={{ padding: "20px 20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11.5, letterSpacing: ".14em", color: "rgba(255,255,255,.55)", fontWeight: 600, textTransform: "uppercase" }}>
              Toplam Harcama
            </span>
            <Luggage size={17} style={{ color: "rgba(255,255,255,.5)" }} />
          </div>
          <div className="hd-disp hd-num" style={{ fontSize: 40, fontWeight: 700, marginTop: 4, lineHeight: 1.05 }}>
            {fmt(toplam)} <span style={{ fontSize: 22, color: "rgba(255,255,255,.7)" }}>₺</span>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,.12)", margin: "18px 0 14px" }} />

          <div style={{ display: "flex", gap: 10 }}>
            <BoardFigure etiket="Alınan avans" deger={servis.avans != null ? fmt(servis.avans) + " ₺" : "—"} renk="rgba(255,255,255,.9)" />
            <BoardFigure
              etiket={asim ? "Fazla harcanan" : "Kalan / iade"}
              deger={kalan != null ? (asim ? "−" : "") + fmt(Math.abs(kalan)) + " ₺" : "—"}
              renk={kalan == null ? "rgba(255,255,255,.9)" : asim ? "#F19B92" : "#7ED9BE"}
              vurgu
            />
          </div>
        </div>

        {/* dağılım */}
        {katToplam.length > 0 && (
          <div className="hd-card" style={{ padding: 18, marginTop: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 14 }}>
              Kategori dağılımı
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Donut segments={segments} total={toplam} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600 }}>TOPLAM</div>
                  <div className="hd-disp hd-num" style={{ fontSize: 16, fontWeight: 700 }}>{fmt(toplam)}</div>
                  <div style={{ fontSize: 10.5, color: "var(--muted-2)" }}>₺</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {katToplam.map((k) => (
                  <div key={k.k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: k.renk, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--ink-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {k.ad}
                    </span>
                    <span className="hd-num" style={{ fontSize: 13, fontWeight: 700 }}>{fmt(k.value)}</span>
                    <span style={{ fontSize: 11, color: "var(--muted-2)", width: 34, textAlign: "right" }}>
                      {toplam > 0 ? Math.round((k.value / toplam) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {dovizToplam.length > 0 && (
              <>
                <div style={{ height: 1, background: "var(--line-2)", margin: "6px 0 12px" }} />
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>Para birimine göre (fiş toplamı)</div>
                <div className="hd-scroll-x" style={{ display: "flex", gap: 8, paddingBottom: 2 }}>
                  {dovizToplam.map(([kod, t]) => (
                    <div
                      key={kod}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        borderRadius: 10,
                        padding: "7px 10px",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{(PB_MAP[kod] || {}).bayrak}</span>
                      <span className="hd-num" style={{ fontSize: 12.5, fontWeight: 700 }}>{fmt(t)}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>{kod}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* harcama listesi */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 4px 12px" }}>
          <div className="hd-disp" style={{ fontWeight: 700, fontSize: 15 }}>Harcamalar</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{servis.harcamalar.length} kayıt</div>
        </div>

        {sirali.length === 0 ? (
          <div className="hd-card" style={{ padding: "34px 20px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Receipt size={24} style={{ color: "var(--accent)" }} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Henüz harcama yok</div>
            <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
              Sağ alttaki + ile ilk fişini ekle.
              <br />
              Dövizi ve kuru gir, TL karşılığı otomatik çıksın.
            </div>
          </div>
        ) : (
          <div className="hd-card" style={{ padding: 6, overflow: "hidden" }}>
            {sirali.map((h, i) => {
              const pb = PB_MAP[h.dovizKodu] || {};
              return (
                <button
                  key={h.id}
                  className="hd-tap"
                  onClick={() => onHarcamaSec(h)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 10px",
                    background: "transparent",
                    border: "none",
                    borderTop: i === 0 ? "none" : "1px solid var(--line-2)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <KategoriRozeti k={h.kategori} boyut={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h.aciklama || (KAT_MAP[h.kategori] || KAT_MAP.diger).ad}
                    </div>
                    <div className="hd-num" style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      {tarihGoster(h.tarih)} · {fmt(h.tutar)} {h.dovizKodu} × {fmtRate(h.kur)}
                    </div>
                  </div>
                  {h.fotoId && <FotoKucuk id={h.fotoId} boyut={40} />}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="hd-disp hd-num" style={{ fontWeight: 700, fontSize: 15.5, color: "var(--accent-2)" }}>{fmt(harcamaTL(h))} ₺</div>
                    <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{pb.bayrak} {h.dovizKodu}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button className="hd-fab hd-tap" onClick={onHarcamaEkle} aria-label="Harcama ekle">
        <Plus size={28} />
      </button>
    </div>
  );
}

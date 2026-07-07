import React from "react";
import { Trash2 } from "lucide-react";
import { fmt, harcamaTL } from "../lib/format.js";

export default function ServisKart({ servis, onClick, onSil }) {
  const toplam = servis.harcamalar.reduce((s, h) => s + harcamaTL(h), 0);
  const oran = servis.avans && servis.avans > 0 ? Math.min(1, toplam / servis.avans) : 0;
  const asim = servis.avans != null && toplam > servis.avans;
  const adet = servis.harcamalar.length;
  const paraBirimleri = [...new Set(servis.harcamalar.map((h) => h.dovizKodu))];

  const sil = (e) => {
    e.stopPropagation();
    if (confirm(`"${servis.ad}" servisi ve içindeki tüm harcamalar silinsin mi?`)) onSil();
  };

  return (
    <div
      className="hd-card hd-tap"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      style={{ width: "100%", textAlign: "left", padding: 18, cursor: "pointer", border: "1px solid var(--line)", position: "relative" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            className="hd-disp"
            style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {servis.ad}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {adet} harcama{paraBirimleri.length > 0 ? ` · ${paraBirimleri.slice(0, 4).join(" · ")}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div className="hd-disp hd-num" style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{fmt(toplam)}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 600 }}>₺ harcandı</div>
          </div>
          <button
            className="hd-tap"
            onClick={sil}
            aria-label="Servisi sil"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "none",
              background: "var(--coral-soft)",
              color: "var(--coral)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: -2,
            }}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {servis.avans != null && (
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 7, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${oran * 100}%`,
                background: asim ? "var(--coral)" : "var(--accent)",
                borderRadius: 99,
                transition: "width .3s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: 12 }}>
            <span style={{ color: "var(--muted)" }}>
              Avans <b className="hd-num" style={{ color: "var(--ink-2)" }}>{fmt(servis.avans)} ₺</b>
            </span>
            <span className="hd-num" style={{ fontWeight: 700, color: asim ? "var(--coral)" : "var(--accent)" }}>
              {asim ? "−" : ""}
              {fmt(Math.abs(servis.avans - toplam))} ₺ {asim ? "aşım" : "kalan"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

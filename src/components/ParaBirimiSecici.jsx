import React, { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { PARA_BIRIMLERI, PB_MAP } from "../data/currencies.js";
import Modal from "./Modal.jsx";

export default function ParaBirimiSecici({ deger, onChange }) {
  const [acik, setAcik] = useState(false);
  const [q, setQ] = useState("");
  const pb = PB_MAP[deger] || PARA_BIRIMLERI[0];

  const liste = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr");
    if (!s) return PARA_BIRIMLERI;
    return PARA_BIRIMLERI.filter(
      (p) => p.kod.toLocaleLowerCase("tr").includes(s) || p.ad.toLocaleLowerCase("tr").includes(s)
    );
  }, [q]);

  return (
    <>
      <button
        type="button"
        className="hd-input hd-tap"
        onClick={() => { setAcik(true); setQ(""); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{pb.bayrak}</span>
          <span style={{ fontWeight: 700 }}>{pb.kod}</span>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>{pb.sembol}</span>
        </span>
        <span style={{ color: "var(--muted-2)", fontSize: 13 }}>değiştir</span>
      </button>

      {acik && (
        <Modal baslik="Para birimi" onClose={() => setAcik(false)}>
          <div style={{ padding: "6px 16px 8px", position: "sticky", top: 0, background: "var(--surface)" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 13, top: 14, color: "var(--muted-2)" }} />
              <input
                className="hd-input"
                autoFocus
                placeholder="Ara: EUR, dolar, frank…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          <div style={{ padding: "4px 10px 20px" }}>
            {liste.map((p) => {
              const secili = p.kod === deger;
              return (
                <button
                  key={p.kod}
                  type="button"
                  className="hd-tap"
                  onClick={() => { onChange(p.kod); setAcik(false); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 12px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    background: secili ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{p.bayrak}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.kod}</span>
                    <span style={{ color: "var(--muted)", fontSize: 13.5, marginLeft: 8 }}>{p.ad}</span>
                  </span>
                  {secili && <Check size={18} style={{ color: "var(--accent)" }} />}
                </button>
              );
            })}
            {liste.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "24px 0" }}>Sonuç yok</div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

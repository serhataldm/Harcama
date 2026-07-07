import React, { useState, useRef, useMemo } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { KATEGORILER, KAT_MAP } from "../data/categories.js";
import { PB_MAP } from "../data/currencies.js";
import { fmt, fmtRate, tarihGoster, harcamaTL } from "../lib/format.js";
import Modal from "./Modal.jsx";

export default function OzetModal({ servis, onClose }) {
  const kopyaRef = useRef(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const metin = useMemo(() => {
    const sat = [];
    sat.push(servis.ad);
    if (servis.not) sat.push(servis.not);
    sat.push("");
    const sirali = [...servis.harcamalar].sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
    sat.push("HARCAMALAR");
    sirali.forEach((h, i) => {
      const bas =
        `${i + 1}) ${tarihGoster(h.tarih)} · ${(KAT_MAP[h.kategori] || KAT_MAP.diger).ad}` +
        (h.aciklama ? ` · ${h.aciklama}` : "");
      sat.push(bas);
      sat.push(`   ${fmt(h.tutar)} ${h.dovizKodu} × ${fmtRate(h.kur)} = ${fmt(harcamaTL(h))} ₺`);
    });
    sat.push("");
    sat.push("KATEGORİ TOPLAMLARI");
    KATEGORILER.forEach((kat) => {
      const t = servis.harcamalar.filter((h) => h.kategori === kat.k).reduce((s, h) => s + harcamaTL(h), 0);
      if (t > 0) sat.push(`${kat.ad}: ${fmt(t)} ₺`);
    });
    sat.push("");
    const toplam = servis.harcamalar.reduce((s, h) => s + harcamaTL(h), 0);
    if (servis.avans != null) sat.push(`Alınan avans: ${fmt(servis.avans)} ₺`);
    sat.push(`Toplam harcama: ${fmt(toplam)} ₺`);
    if (servis.avans != null) {
      const kalan = servis.avans - toplam;
      sat.push(`${kalan >= 0 ? "İade edilecek" : "Fazla harcanan"}: ${fmt(Math.abs(kalan))} ₺`);
    }
    return sat.join("\n");
  }, [servis]);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1800);
    } catch (e) {
      kopyaRef.current = true;
      alert("Panoya kopyalanamadı. Aşağıdaki metni elle seçip kopyalayabilirsin.");
    }
  };

  return (
    <Modal baslik="Teslim özeti" onClose={onClose}>
      <div style={{ padding: "4px 16px 22px" }}>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
          Aşağıdaki dökümü kopyalayıp teslim maline / dokümanına yapıştırabilirsin.
        </p>
        <pre
          className="hd-num"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: 14,
            fontSize: 12.5,
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'Space Grotesk', ui-monospace, monospace",
            color: "var(--ink-2)",
            margin: 0,
            maxHeight: "48vh",
            overflow: "auto",
          }}
        >
          {metin}
        </pre>
        <button className="hd-btn hd-btn-primary hd-tap" style={{ width: "100%", marginTop: 14 }} onClick={kopyala}>
          {kopyalandi ? (
            <>
              <CheckCircle2 size={19} /> Kopyalandı
            </>
          ) : (
            <>
              <Copy size={18} /> Panoya kopyala
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

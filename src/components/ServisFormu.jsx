import React, { useState, useEffect, useRef } from "react";
import { Check, Trash2 } from "lucide-react";
import { parseNum } from "../lib/format.js";
import Modal from "./Modal.jsx";

export default function ServisFormu({ initial, onSave, onClose, onDelete }) {
  const [ad, setAd] = useState(initial?.ad || "");
  const [avans, setAvans] = useState(initial?.avans != null ? String(initial.avans).replace(".", ",") : "");
  const [not, setNot] = useState(initial?.not || "");
  const adRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => adRef.current && adRef.current.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const avansN = parseNum(avans);
  const gecerli = ad.trim().length > 0;

  const kaydet = () => {
    if (!gecerli) return;
    onSave({
      ad: ad.trim(),
      avans: avans.trim() === "" ? null : Number.isFinite(avansN) ? avansN : null,
      not: not.trim(),
    });
  };

  return (
    <Modal
      baslik={initial ? "Servisi düzenle" : "Yeni servis"}
      onClose={onClose}
      sagButon={
        <button
          className="hd-icon-btn light"
          onClick={kaydet}
          disabled={!gecerli}
          style={{ color: gecerli ? "var(--accent)" : "var(--muted-2)" }}
          aria-label="Kaydet"
        >
          <Check size={22} />
        </button>
      }
    >
      <div style={{ padding: "6px 16px 22px" }}>
        <div style={{ marginBottom: 16 }}>
          <label className="hd-label">Servis adı</label>
          <input
            ref={adRef}
            className="hd-input"
            placeholder="örn. Almanya Sahası — Mart 2026"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="hd-label">Alınan avans (₺) — isteğe bağlı</label>
          <input
            className="hd-input hd-num"
            inputMode="decimal"
            placeholder="örn. 25.000,00"
            value={avans}
            onChange={(e) => setAvans(e.target.value)}
          />
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 7, lineHeight: 1.5 }}>
            Şirketin verdiği TL avansı yazarsan, harcadıkça kalan / iade edilecek tutar otomatik hesaplanır.
          </p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="hd-label">Not (isteğe bağlı)</label>
          <input className="hd-input" placeholder="örn. Proje kodu, şehir…" value={not} onChange={(e) => setNot(e.target.value)} />
        </div>
        <button className="hd-btn hd-btn-primary hd-tap" style={{ width: "100%" }} onClick={kaydet} disabled={!gecerli}>
          <Check size={19} /> {initial ? "Kaydet" : "Servisi oluştur"}
        </button>
        {initial && onDelete && (
          <button
            className="hd-btn hd-btn-danger hd-tap"
            style={{ width: "100%", marginTop: 10 }}
            onClick={() => { if (confirm("Bu servis ve içindeki tüm harcamalar silinsin mi?")) onDelete(); }}
          >
            <Trash2 size={18} /> Servisi sil
          </button>
        )}
      </div>
    </Modal>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Check, Trash2, ArrowRight, Camera, Maximize2 } from "lucide-react";
import { KATEGORILER } from "../data/categories.js";
import { PB_MAP } from "../data/currencies.js";
import { parseNum, fmt, tl, bugunISO, uid } from "../lib/format.js";
import { goruntuKucult, fotoKaydet, fotoSil, yeniFotoId } from "../lib/photos.js";
import Modal from "./Modal.jsx";
import ParaBirimiSecici from "./ParaBirimiSecici.jsx";
import { useFotoURL, FotoBuyut } from "./Foto.jsx";

export default function HarcamaFormu({ servis, initial, onSave, onClose, onDelete }) {
  const [tarih, setTarih] = useState(initial?.tarih || bugunISO());
  const [kategori, setKategori] = useState(initial?.kategori || "yemek");
  const [aciklama, setAciklama] = useState(initial?.aciklama || "");
  const [tutar, setTutar] = useState(initial ? String(initial.tutar).replace(".", ",") : "");
  const [doviz, setDoviz] = useState(initial?.dovizKodu || "EUR");
  const [kur, setKur] = useState(initial ? String(initial.kur).replace(".", ",") : "");
  const [fotoId, setFotoId] = useState(initial?.fotoId || null);
  const [fotoYukleniyor, setFotoYukleniyor] = useState(false);
  const [buyut, setBuyut] = useState(false);
  const tutarRef = useRef(null);
  const dosyaRef = useRef(null);
  const ilkFotoId = useRef(initial?.fotoId || null);
  const oturumEklenen = useRef([]); // bu formda IndexedDB'ye eklenen id'ler

  const onizlemeUrl = useFotoURL(fotoId);

  // Döviz değişince, o serviste en son kullanılan kuru otomatik doldur
  useEffect(() => {
    if (initial) return;
    const son = servis?.sonKurlar?.[doviz];
    if (son != null) setKur(String(son).replace(".", ","));
    else setKur("");
  }, [doviz]); // eslint-disable-line

  useEffect(() => {
    const t = setTimeout(() => tutarRef.current && tutarRef.current.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const tutarN = parseNum(tutar);
  const kurN = parseNum(kur);
  const tlN = (Number.isFinite(tutarN) ? tutarN : 0) * (Number.isFinite(kurN) ? kurN : 0);
  const gecerli = Number.isFinite(tutarN) && tutarN > 0 && Number.isFinite(kurN) && kurN > 0;
  const pb = PB_MAP[doviz];

  const dosyaSecildi = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!file) return;
    setFotoYukleniyor(true);
    try {
      const blob = await goruntuKucult(file);
      const yid = yeniFotoId();
      await fotoKaydet(yid, blob);
      oturumEklenen.current.push(yid);
      setFotoId(yid);
    } catch (err) {
      alert("Fotoğraf eklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setFotoYukleniyor(false);
    }
  };

  // İptal: bu oturumda eklenip kaydedilmeyen fotoları sil
  const iptalKapat = async () => {
    for (const id of oturumEklenen.current) await fotoSil(id);
    onClose();
  };

  const kaydet = async () => {
    if (!gecerli) return;
    // Bu oturumda eklenip artık kullanılmayanları sil
    for (const id of oturumEklenen.current) {
      if (id !== fotoId) await fotoSil(id);
    }
    // Orijinal foto değiştirildi/kaldırıldıysa sil
    if (ilkFotoId.current && ilkFotoId.current !== fotoId) await fotoSil(ilkFotoId.current);

    onSave({
      id: initial?.id || uid(),
      tarih,
      kategori,
      aciklama: aciklama.trim(),
      tutar: tutarN,
      dovizKodu: doviz,
      kur: kurN,
      fotoId: fotoId || null,
    });
  };

  const sil = () => {
    if (!confirm("Bu harcama silinsin mi?")) return;
    // bu oturumda eklenen geçici fotoları temizle (kalıcı foto App tarafında silinir)
    oturumEklenen.current.forEach((id) => fotoSil(id));
    onDelete();
  };

  return (
    <>
      <Modal
        baslik={initial ? "Harcamayı düzenle" : "Harcama ekle"}
        onClose={iptalKapat}
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
        <div style={{ padding: "6px 16px 20px" }}>
          {/* Tutar + döviz */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1.3 }}>
              <label className="hd-label">Tutar (fiş)</label>
              <input
                ref={tutarRef}
                className="hd-input hd-num"
                inputMode="decimal"
                placeholder="0,00"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                style={{ fontSize: 20, fontWeight: 700 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="hd-label">Döviz</label>
              <ParaBirimiSecici deger={doviz} onChange={setDoviz} />
            </div>
          </div>

          {/* Kur */}
          <div style={{ marginBottom: 8 }}>
            <label className="hd-label">Kur — 1 {doviz} kaç ₺?</label>
            <input
              className="hd-input hd-num"
              inputMode="decimal"
              placeholder="örn. 35,20"
              value={kur}
              onChange={(e) => setKur(e.target.value)}
              style={{ fontSize: 17, fontWeight: 600 }}
            />
          </div>

          {/* TL önizleme */}
          <div
            className="hd-num"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "var(--accent-soft)",
              borderRadius: 14,
              padding: "13px 14px",
              margin: "8px 0 18px",
              color: "var(--accent-2)",
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 15, opacity: 0.85 }}>
              {fmt(Number.isFinite(tutarN) ? tutarN : 0)} {pb.sembol}
            </span>
            <ArrowRight size={16} />
            <span className="hd-disp" style={{ fontSize: 22 }}>{tl(tlN)}</span>
          </div>

          {/* Kategori */}
          <label className="hd-label" style={{ marginBottom: 10 }}>Kategori</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {KATEGORILER.map((kat) => {
              const secili = kat.k === kategori;
              const Icon = kat.Icon;
              return (
                <button
                  key={kat.k}
                  type="button"
                  className="hd-chip hd-tap"
                  onClick={() => setKategori(kat.k)}
                  style={{
                    borderColor: secili ? kat.renk : "var(--line)",
                    background: secili ? kat.renk + "17" : "var(--surface-2)",
                    color: secili ? kat.renk : "var(--ink-2)",
                  }}
                >
                  <Icon size={16} strokeWidth={2.2} /> {kat.ad}
                </button>
              );
            })}
          </div>

          {/* Fiş fotoğrafı */}
          <label className="hd-label" style={{ marginBottom: 8 }}>Fiş fotoğrafı (isteğe bağlı)</label>
          {fotoId ? (
            <div style={{ marginBottom: 18 }}>
              <div style={{ position: "relative" }} onClick={() => setBuyut(true)}>
                {onizlemeUrl && (
                  <img
                    src={onizlemeUrl}
                    alt="Fiş"
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                      borderRadius: 14,
                      display: "block",
                      border: "1px solid var(--line)",
                      cursor: "zoom-in",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(16,26,46,.6)",
                    color: "#fff",
                    borderRadius: 9,
                    padding: 6,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Maximize2 size={16} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="hd-btn hd-btn-ghost hd-tap" style={{ flex: 1 }} onClick={() => dosyaRef.current && dosyaRef.current.click()}>
                  <Camera size={17} /> Değiştir
                </button>
                <button className="hd-btn hd-btn-danger hd-tap" style={{ flex: 1 }} onClick={() => setFotoId(null)}>
                  <Trash2 size={17} /> Kaldır
                </button>
              </div>
            </div>
          ) : (
            <button
              className="hd-btn hd-btn-ghost hd-tap"
              style={{ width: "100%", marginBottom: 18, borderStyle: "dashed", color: "var(--accent-2)" }}
              onClick={() => dosyaRef.current && dosyaRef.current.click()}
              disabled={fotoYukleniyor}
            >
              <Camera size={18} /> {fotoYukleniyor ? "Yükleniyor…" : "Fiş fotoğrafı ekle"}
            </button>
          )}
          <input ref={dosyaRef} type="file" accept="image/*" onChange={dosyaSecildi} style={{ display: "none" }} />

          {/* Açıklama + tarih */}
          <div style={{ marginBottom: 14 }}>
            <label className="hd-label">Açıklama (isteğe bağlı)</label>
            <input
              className="hd-input"
              placeholder="örn. Öğle yemeği — Berlin"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="hd-label">Tarih</label>
            <input className="hd-input hd-num" type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} />
          </div>

          <button className="hd-btn hd-btn-primary hd-tap" style={{ width: "100%" }} onClick={kaydet} disabled={!gecerli}>
            <Check size={19} /> {initial ? "Değişiklikleri kaydet" : "Harcamayı ekle"}
          </button>

          {initial && onDelete && (
            <button className="hd-btn hd-btn-danger hd-tap" style={{ width: "100%", marginTop: 10 }} onClick={sil}>
              <Trash2 size={18} /> Harcamayı sil
            </button>
          )}
        </div>
      </Modal>

      {buyut && fotoId && <FotoBuyut id={fotoId} onClose={() => setBuyut(false)} />}
    </>
  );
}

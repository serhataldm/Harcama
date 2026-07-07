import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fotoGetir } from "../lib/photos.js";

// Bir foto id'sinden gösterilebilir bir URL üretir (ve temizler).
export function useFotoURL(id) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let aktif = true;
    let objUrl = null;
    if (!id) {
      setUrl(null);
      return;
    }
    fotoGetir(id)
      .then((blob) => {
        if (!aktif) return;
        if (!blob) {
          setUrl(null);
          return;
        }
        objUrl = URL.createObjectURL(blob);
        setUrl(objUrl);
      })
      .catch(() => aktif && setUrl(null));
    return () => {
      aktif = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [id]);
  return url;
}

// Küçük önizleme (liste satırında gösterge olarak)
export function FotoKucuk({ id, boyut = 40, radius = 9, onClick }) {
  const url = useFotoURL(id);
  if (!url) return null;
  return (
    <img
      src={url}
      alt="Fiş"
      onClick={onClick}
      style={{
        width: boyut,
        height: boyut,
        objectFit: "cover",
        borderRadius: radius,
        flexShrink: 0,
        border: "1px solid var(--line)",
        cursor: onClick ? "pointer" : "default",
      }}
    />
  );
}

// Tam ekran büyütme
export function FotoBuyut({ id, onClose }) {
  const url = useFotoURL(id);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(8,14,26,.93)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        paddingTop: "calc(16px + env(safe-area-inset-top))",
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Kapat"
        style={{
          position: "absolute",
          top: "calc(12px + env(safe-area-inset-top))",
          right: 12,
          width: 42,
          height: 42,
          borderRadius: 12,
          border: "none",
          background: "rgba(255,255,255,.16)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={24} />
      </button>
      {url && (
        <img
          src={url}
          alt="Fiş"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, objectFit: "contain" }}
        />
      )}
    </div>
  );
}

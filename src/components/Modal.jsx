import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ children, onClose, baslik, sagButon }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="hd-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hd-sheet" role="dialog" aria-modal="true">
        <div className="hd-grab" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 4px" }}>
          <button className="hd-icon-btn light" onClick={onClose} aria-label="Kapat">
            <X size={22} />
          </button>
          <div className="hd-disp" style={{ fontWeight: 700, fontSize: 16 }}>{baslik}</div>
          <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>{sagButon}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

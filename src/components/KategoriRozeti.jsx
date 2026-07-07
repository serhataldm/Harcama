import React from "react";
import { KAT_MAP } from "../data/categories.js";

export default function KategoriRozeti({ k, boyut = 40 }) {
  const kat = KAT_MAP[k] || KAT_MAP.diger;
  const Icon = kat.Icon;
  const ikon = Math.round(boyut * 0.46);
  return (
    <div
      style={{
        width: boyut,
        height: boyut,
        borderRadius: boyut * 0.32,
        flexShrink: 0,
        background: kat.renk + "1F",
        color: kat.renk,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={ikon} strokeWidth={2.1} />
    </div>
  );
}

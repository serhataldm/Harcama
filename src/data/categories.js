// Harcama kategorileri: her biri bir renk ve ikon taşır.
import {
  Utensils,
  BedDouble,
  Plane,
  Car,
  Fuel,
  ShoppingBag,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";

export const KATEGORILER = [
  { k: "yemek",     ad: "Yemek & İçecek", renk: "#E8804B", Icon: Utensils },
  { k: "konaklama", ad: "Konaklama",      renk: "#7C6BE8", Icon: BedDouble },
  { k: "ulasim",    ad: "Ulaşım",         renk: "#2E93D6", Icon: Plane },
  { k: "arac",      ad: "Araç Kiralama",  renk: "#10A594", Icon: Car },
  { k: "yakit",     ad: "Yakıt",          renk: "#D9962B", Icon: Fuel },
  { k: "alisveris", ad: "Alışveriş",      renk: "#DD5AA6", Icon: ShoppingBag },
  { k: "iletisim",  ad: "İletişim",       renk: "#5B7CFA", Icon: Smartphone },
  { k: "diger",     ad: "Diğer",          renk: "#8A96A6", Icon: MoreHorizontal },
];

export const KAT_MAP = Object.fromEntries(KATEGORILER.map((k) => [k.k, k]));

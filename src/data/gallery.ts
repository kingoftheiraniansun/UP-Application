import { DRIVE, driveImage, driveThumb } from "./assets";

export type Category = "all" | "fashion" | "portrait" | "sport" | "art";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "fashion", label: "مد و فشن" },
  { id: "portrait", label: "پرتره" },
  { id: "sport", label: "ورزشی" },
  { id: "art", label: "هنری" },
];

export interface GalleryItem {
  id: string;
  index: number;
  driveId: string;
  src: string; // full-size (w2000)
  thumb: string; // grid thumbnail (w800)
  fallback: string; // alternate CDN endpoint
  category: Exclude<Category, "all">;
  title: string;
  alt: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Category metadata for the 17 Drive gallery files (in Drive order).
 * Adjust `category` values here if the studio wants a different grouping — the UI reads only from this list.
 */
const META: { category: GalleryItem["category"]; title: string }[] = [
  { category: "fashion", title: "ادیتوریال ۰۱" },
  { category: "portrait", title: "پرتره ۰۱" },
  { category: "fashion", title: "ادیتوریال ۰۲" },
  { category: "art", title: "هنری ۰۱" },
  { category: "portrait", title: "پرتره ۰۲" },
  { category: "sport", title: "ورزشی ۰۱" },
  { category: "fashion", title: "ادیتوریال ۰۳" },
  { category: "portrait", title: "پرتره ۰۳" },
  { category: "art", title: "هنری ۰۲" },
  { category: "sport", title: "ورزشی ۰۲" },
  { category: "fashion", title: "ادیتوریال ۰۴" },
  { category: "portrait", title: "پرتره ۰۴" },
  { category: "art", title: "هنری ۰۳" },
  { category: "fashion", title: "ادیتوریال ۰۵" },
  { category: "sport", title: "ورزشی ۰۳" },
  { category: "portrait", title: "پرتره ۰۵" },
  { category: "art", title: "هنری ۰۴" },
];

export const GALLERY: GalleryItem[] = DRIVE.gallery.map((driveId, i) => {
  const n = i + 1;
  const m = META[i] ?? { category: "portrait" as const, title: `اثر ${pad(n)}` };
  return {
    id: `p${pad(n)}`,
    index: n,
    driveId,
    src: driveImage(driveId, 2000),
    thumb: driveImage(driveId, 800),
    fallback: driveThumb(driveId, 1600),
    category: m.category,
    title: m.title,
    alt: `${m.title} — ${CATEGORIES.find((c) => c.id === m.category)?.label} — آپ استودیو`,
  };
});

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
  fileName: string;
  src: string;
  thumb: string;
  fallback: string;
  category: Exclude<Category, "all">;
  title: string;
  alt: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
* Category metadata for the 17 UP Studio gallery files.
* The order matches the gallery filenames in assets.ts.
*/
const META: {
  category: GalleryItem["category"];
  title: string;
}[] = [
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

export const GALLERY: GalleryItem[] = DRIVE.gallery.map((fileName, i) => {
  const n = i + 1;

  const m = META[i] ?? {
    category: "portrait" as const,
    title: `اثر ${pad(n)}`,
  };

  return {
    id: `p${pad(n)}`,
    index: n,
    fileName,
    src: driveImage(fileName, 2000),
    thumb: driveImage(fileName, 800),
    fallback: driveThumb(fileName, 1600),
    category: m.category,
    title: m.title,
    alt: `${m.title} — ${
      CATEGORIES.find((c) => c.id === m.category)?.label
    } — آپ استودیو`,
  };
});

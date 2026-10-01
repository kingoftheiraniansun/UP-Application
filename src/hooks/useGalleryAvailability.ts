import { useEffect, useState } from "react";
import { GALLERY } from "../data/gallery";

type Availability = Record<string, boolean>;

// Module-level cache so every page shares a single probe pass.
let cache: Availability = {};
let probing: Promise<Availability> | null = null;
const listeners = new Set<(a: Availability) => void>();

function probe(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function start() {
  if (probing) return probing;
  probing = Promise.all(
    GALLERY.map(async (g) => {
      const ok = (await probe(g.thumb)) || (await probe(g.fallback));
      cache = { ...cache, [g.id]: ok };
      listeners.forEach((l) => l(cache));
    }),
  ).then(() => cache);
  return probing;
}

/** Returns a map of gallery id -> whether the full-size file resolves. Unknown ids are `undefined` while probing. */
export function useGalleryAvailability() {
  const [state, setState] = useState<Availability>(cache);
  useEffect(() => {
    const l = (a: Availability) => setState(a);
    listeners.add(l);
    start();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return state;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, Check } from "lucide-react";
import type { GalleryItem } from "../data/gallery";
import { CATEGORIES } from "../data/gallery";
import { toFa } from "../data/brand";
import { cn } from "../utils/cn";

interface Props {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export default function Lightbox({ items, index, onClose, onIndex }: Props) {
  const item = items[index];
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    setUseFallback(false);
  }, [item?.src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // RTL: ArrowRight = previous, ArrowLeft = next
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };

  const download = async () => {
    try {
      const res = await fetch(item.src);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.id}-upstudio.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("تصویر ذخیره شد");
    } catch {
      // Cross-origin without CORS: hand off to Drive's own download endpoint
      window.open(`https://drive.google.com/uc?export=download&id=${item.driveId}`, "_blank", "noopener");
      showToast("دانلود در تب جدید آغاز شد");
    }
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.hash = `/gallery?img=${item.id}`;
    const data = { title: `آپ استودیو — ${item.title}`, text: item.title, url: url.toString() };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      showToast("لینک کپی شد");
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      showToast("اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود");
    }
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-[#0a0a0a] text-paper"
      role="dialog"
      aria-modal="true"
      aria-label={`نمایش تمام‌صفحه: ${item.title}`}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-4 py-3"
        style={{ paddingTop: "calc(var(--sat) + 12px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtn}
          onClick={onClose}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label="بستن"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold">{item.title}</p>
          <p className="text-[11px] text-paper/50">
            {CATEGORIES.find((c) => c.id === item.category)?.label} · {toFa(index + 1)} / {toFa(items.length)}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={share} className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="اشتراک‌گذاری">
            <Share2 className="h-5 w-5" />
          </button>
          <button onClick={download} className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="ذخیره تصویر">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            // swipe left -> next (RTL), swipe right -> prev
            dx < 0 ? next() : prev();
          } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
            onClose();
          }
        }}
      >
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-paper/20 border-t-paper" />
          </div>
        )}
        {error ? (
          <div className="text-center text-paper/60" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm">این تصویر در دسترس نیست.</p>
            <button onClick={next} className="focus-ring mt-4 rounded-full border border-paper/30 px-5 py-2 text-xs">تصویر بعدی</button>
          </div>
        ) : (
          <img
            key={item.src}
            src={useFallback ? item.fallback : item.src}
            alt={item.alt}
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            onError={() => (useFallback ? setError(true) : setUseFallback(true))}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-h-full max-w-full select-none object-contain transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
            )}
            draggable={false}
          />
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="focus-ring absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 md:flex"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="focus-ring absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 md:flex"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      <div
        className="no-scrollbar relative z-10 flex gap-2 overflow-x-auto px-4 py-3"
        style={{ paddingBottom: "calc(var(--sab) + 12px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => onIndex(i)}
            className={cn(
              "focus-ring h-14 w-11 shrink-0 overflow-hidden rounded-md transition-all",
              i === index ? "ring-2 ring-gold" : "opacity-50 hover:opacity-90",
            )}
            aria-label={`${it.title}`}
            aria-current={i === index}
          >
            <img src={it.thumb} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-semibold text-ink shadow-xl" role="status">
          <Check className="h-4 w-4 text-gold" />
          {toast}
        </div>
      )}
    </div>
  );
}

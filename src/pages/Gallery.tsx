import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Maximize2 } from "lucide-react";
import { CATEGORIES, GALLERY, type Category } from "../data/gallery";
import { toFa } from "../data/brand";
import SmartImage from "../components/SmartImage";
import Lightbox from "../components/Lightbox";
import { useGalleryAvailability } from "../hooks/useGalleryAvailability";
import { cn } from "../utils/cn";

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const catParam = (params.get("cat") as Category | null) ?? "all";
  const cat: Category = CATEGORIES.some((c) => c.id === catParam) ? catParam : "all";
  const imgParam = params.get("img");
  const availability = useGalleryAvailability();
  const probed = Object.keys(availability).length === GALLERY.length;

  const visible = useMemo(
    () => GALLERY.filter((g) => availability[g.id] === true && (cat === "all" || g.category === cat)),
    [cat, availability],
  );

  const [open, setOpen] = useState<number | null>(null);

  // deep link ?img=p03
  useEffect(() => {
    if (!imgParam) return;
    const idx = visible.findIndex((g) => g.id === imgParam);
    if (idx >= 0) setOpen(idx);
  }, [imgParam, visible]);

  const setCat = (c: Category) => {
    const next = new URLSearchParams(params);
    if (c === "all") next.delete("cat");
    else next.set("cat", c);
    next.delete("img");
    setParams(next, { replace: true });
  };

  const openAt = (i: number) => {
    setOpen(i);
    const next = new URLSearchParams(params);
    next.set("img", visible[i].id);
    setParams(next, { replace: true });
  };

  const close = () => {
    setOpen(null);
    const next = new URLSearchParams(params);
    next.delete("img");
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 md:pt-16">
      <header className="mb-8 md:mb-12">
        <p className="eyebrow mb-2">گالری</p>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">نمونه‌کارها</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted md:text-base">
          گزیده‌ای از پروژه‌های مد، پرتره، ورزشی و هنری. برای نمایش تمام‌صفحه روی هر قاب بزنید.
        </p>
      </header>

      {/* filters */}
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="دسته‌بندی گالری">
        {CATEGORIES.map((c) => {
          const count = GALLERY.filter((g) => availability[g.id] === true && (c.id === "all" || g.category === c.id)).length;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "focus-ring flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                cat === c.id ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink-2 hover:border-ink",
              )}
            >
              {c.label}
              <span className={cn("text-[11px]", cat === c.id ? "text-paper/60" : "text-muted")}>{toFa(count)}</span>
            </button>
          );
        })}
      </div>

      {/* grid */}
      {!probed && visible.length === 0 ? (
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4" aria-busy="true" aria-label="در حال بارگذاری گالری">
          {[260, 340, 220, 300, 280, 360, 240, 320].map((h, i) => (
            <div key={i} className="skeleton mb-3 w-full rounded-lg md:mb-4" style={{ height: h }} />
          ))}
        </div>
      ) : visible.length === 0 && probed ? (
        <div className="rounded-2xl border border-dashed border-line py-20 text-center text-muted">
          <p className="text-sm">در این دسته هنوز اثری منتشر نشده است.</p>
          <button onClick={() => setCat("all")} className="focus-ring mt-4 text-sm font-semibold text-gold">نمایش همه</button>
        </div>
      ) : (
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {visible.map((g, i) => (
            <button
              key={g.id}
              onClick={() => openAt(i)}
              className="focus-ring group relative mb-3 block w-full overflow-hidden rounded-lg bg-paper-2 text-right md:mb-4"
              aria-label={`نمایش تمام‌صفحه ${g.title}`}
            >
              <SmartImage
                src={g.thumb}
                fallbacks={[g.src, g.fallback]}
                alt={g.alt}
                loading={i < 6 ? "eager" : "lazy"}
                decoding="async"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                wrapperClassName="min-h-[120px]"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-bold text-paper">{g.title}</span>
                <Maximize2 className="h-4 w-4 text-paper" />
              </div>
            </button>
          ))}
        </div>
      )}

      {open !== null && visible[open] && (
        <Lightbox items={visible} index={open} onClose={close} onIndex={(i) => openAt(i)} />
      )}
    </div>
  );
}

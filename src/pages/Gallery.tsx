import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Maximize2, Play, Volume2, VolumeX } from "lucide-react";
import { CATEGORIES, GALLERY, type Category } from "../data/gallery";
import { toFa } from "../data/brand";
import { ASSETS } from "../data/assets";
import SmartImage from "../components/SmartImage";
import Lightbox from "../components/Lightbox";
import { cn } from "../utils/cn";

function FeaturedReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) {
      void video.play().catch(() => undefined);
      setPlaying(true);
    }
  };

  return (
    <div className="relative mx-0 mb-8 overflow-hidden rounded-[28px] bg-ink">
      <video
        ref={videoRef}
        src={ASSETS.introVideo}
        poster={ASSETS.introPoster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[4/5] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-paper sm:p-5">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-paper/60" dir="ltr">SHOWREEL</p>
          <p className="mt-1 font-bold">ریل معرفی استودیو</p>
        </div>
        <div className="flex gap-2">
          {!playing && (
            <button aria-label="پخش" onClick={() => { void videoRef.current?.play(); }} className="grid h-11 w-11 place-items-center rounded-full bg-paper/15 backdrop-blur">
              <Play className="h-5 w-5" />
            </button>
          )}
          <button
            aria-label={muted ? "روشن کردن صدا" : "بی‌صدا"}
            onClick={toggleSound}
            className="flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {muted ? "صدا" : "بی‌صدا"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const catParam = (params.get("cat") as Category | null) ?? "all";
  const cat: Category = CATEGORIES.some((c) => c.id === catParam) ? catParam : "all";
  const imgParam = params.get("img");
  const visible = useMemo(() => GALLERY.filter((g) => cat === "all" || g.category === cat), [cat]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!imgParam) return;
    const idx = visible.findIndex((g) => g.id === imgParam);
    if (idx >= 0) setOpen(idx);
  }, [imgParam, visible]);

  // Warm the tiny WebP thumbnails shortly after first paint. This keeps the first
  // render light while making category switches feel instant on Android.
  useEffect(() => {
    let cancelled = false;
    const warm = () => {
      if (cancelled) return;
      GALLERY.forEach((item) => {
        const img = new Image();
        img.decoding = "async";
        img.src = item.thumb;
      });
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const timer = idle ? idle(warm) : window.setTimeout(warm, 350);
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(timer);
    };
  }, []);

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
    <div className="mx-auto max-w-7xl px-3 pb-16 pt-8 sm:px-5 md:pt-12">
      <header className="mb-6 px-2 md:mb-8">
        <p className="eyebrow mb-2">Portfolio</p>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">گالری</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">۱۷ قاب منتخب از پروژه‌های آپ استودیو — برای نمایش تمام‌صفحه روی هر قاب بزنید.</p>
      </header>

      <FeaturedReel />

      <div className="no-scrollbar sticky top-16 z-30 -mx-3 flex gap-2 overflow-x-auto border-b border-line bg-paper/90 px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5" role="tablist" aria-label="دسته‌بندی گالری">
        {CATEGORIES.map((c) => {
          const count = GALLERY.filter((g) => c.id === "all" || g.category === c.id).length;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "focus-ring flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition",
                cat === c.id ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink-2 hover:border-ink",
              )}
            >
              {c.label}
              <span className={cn("text-[10px]", cat === c.id ? "text-paper/60" : "text-muted")}>{toFa(count)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line py-20 text-center text-muted">
            <p className="text-sm">در این دسته هنوز اثری منتشر نشده است.</p>
            <button onClick={() => setCat("all")} className="focus-ring mt-4 text-sm font-semibold text-gold">نمایش همه</button>
          </div>
        ) : (
          <div className="columns-2 gap-3 md:columns-3 md:gap-4">
            {visible.map((g, i) => (
              <button
                key={g.id}
                onClick={() => openAt(i)}
                className="focus-ring group relative mb-3 block w-full overflow-hidden rounded-2xl bg-paper-2 text-right md:mb-4"
                aria-label={`نمایش تمام‌صفحه ${g.title}`}
              >
                <SmartImage
                  src={g.thumb}
                  fallbacks={[g.src]}
                  alt={g.alt}
                  loading={i < 6 ? "eager" : "lazy"}
                  fetchPriority={i < 3 ? "high" : "auto"}
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
      </div>

      {open !== null && visible[open] && (
        <Lightbox items={visible} index={open} onClose={close} onIndex={(i) => openAt(i)} />
      )}
    </div>
  );
}

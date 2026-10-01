import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { BRAND } from "../data/brand";
import { ASSETS } from "../data/assets";
import { cn } from "../utils/cn";

const SESSION_KEY = "upstudio_intro_seen";
const MAX_MS = 15000;
const VIDEO_SRC = ASSETS.introVideo; // upstudiointro.mp4 from the UP Studio Drive folder
const POSTER_SRC = ASSETS.introPoster;
const POSTER_FALLBACK = ASSETS.heroImage;

export function introAlreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(onDone, 650);
  };

  useEffect(() => {
    const t = window.setTimeout(finish, MAX_MS);
    const r = window.setTimeout(() => setReady(true), 400);
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {
        /* autoplay blocked: poster remains visible */
      });
    }
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(r);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-end overflow-hidden bg-ink text-paper transition-all duration-700",
        leaving ? "pointer-events-none scale-[1.03] opacity-0" : "opacity-100",
      )}
      role="dialog"
      aria-label="معرفی آپ استودیو"
    >
      {/* media */}
      <div className="absolute inset-0">
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          className={cn("kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-700", videoOk && playing && "opacity-0")}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (el.src !== POSTER_FALLBACK) el.src = POSTER_FALLBACK;
            else el.style.display = "none";
          }}
        />
        {videoOk && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            autoPlay
            playsInline
            preload="auto"
            onPlaying={() => setPlaying(true)}
            onEnded={finish}
            onError={() => setVideoOk(false)}
            onStalled={() => setPlaying(false)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      </div>

      {/* content */}
      <div
        className={cn(
          "relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center transition-all duration-1000",
          ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
        style={{ paddingBottom: "calc(var(--sab) + 48px)" }}
      >
        <LogoMark light className="h-14 w-14" />
        <h1 className="font-display mt-6 text-4xl font-extrabold sm:text-5xl">{BRAND.tagline}</h1>
        <p className="mt-3 text-sm text-paper/70 sm:text-base">{BRAND.subtitle}</p>
        <button
          onClick={finish}
          className="focus-ring mt-10 inline-flex items-center gap-3 rounded-full border border-paper/30 bg-paper/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-paper hover:text-ink"
          autoFocus
        >
          ورود به استودیو
          <svg className="h-4 w-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <span className="mt-6 text-[10px] tracking-[0.4em] text-paper/40" dir="ltr">
          UP STUDIO
        </span>
      </div>

      <button
        onClick={finish}
        className="focus-ring absolute left-5 z-10 rounded-full px-3 py-1.5 text-xs text-paper/60 hover:text-paper"
        style={{ top: "calc(var(--sat) + 16px)" }}
      >
        رد کردن
      </button>
    </div>
  );
}

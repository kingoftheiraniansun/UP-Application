import { useState } from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../data/assets";
import { cn } from "../utils/cn";

/** Vector fallback used only if the official PNG logo cannot be loaded. */
function FallbackMark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9", className)} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={light ? "#F7F6F3" : "#141414"} />
      <text x="32" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="27" fontWeight="700" fill={light ? "#141414" : "#F7F6F3"} letterSpacing="-1">
        UP
      </text>
    </svg>
  );
}

/** Official UP Studio logo (Logo_Black_[Site]_081227.png). `light` inverts it for dark surfaces. */
export function LogoMark({ className, light }: { className?: string; light?: boolean }) {
  const [src, setSrc] = useState(ASSETS.logo);
  const [failed, setFailed] = useState(false);
  if (failed) return <FallbackMark className={className} light={light} />;
  return (
    <img
      src={src}
      alt="لوگوی آپ استودیو"
      className={cn("h-9 w-auto object-contain", light && "invert", className)}
      onError={() => (src !== ASSETS.logoFallback ? setSrc(ASSETS.logoFallback) : setFailed(true))}
      draggable={false}
      decoding="async"
    />
  );
}

export default function Logo({ light, to = "/" }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className="focus-ring flex items-center gap-3 rounded-lg" aria-label="آپ استودیو — صفحه اصلی">
      <LogoMark light={light} />
      <span className="leading-none">
        <span className={cn("block text-base font-extrabold", light ? "text-paper" : "text-ink")}>آپ استودیو</span>
        <span className={cn("mt-1 block text-[10px] tracking-[0.3em]", light ? "text-paper/60" : "text-muted")} dir="ltr">
          UP STUDIO
        </span>
      </span>
    </Link>
  );
}

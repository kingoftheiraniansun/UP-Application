import { Link } from "react-router-dom";
import { ASSETS } from "../data/assets";
import { cn } from "../utils/cn";

/** Official UP Studio logo bundled with the app. */
export function LogoMark({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <img
      src={ASSETS.logo}
      alt="لوگوی آپ استودیو"
      className={cn(
        "h-9 w-auto object-contain",
        light && "invert",
        className
      )}
      draggable={false}
      decoding="async"
    />
  );
}

export default function Logo({
  light,
  to = "/",
}: {
  light?: boolean;
  to?: string;
}) {
  return (
    <Link
      to={to}
      className="focus-ring flex items-center gap-3 rounded-lg"
      aria-label="آپ استودیو — صفحه اصلی"
    >
      <LogoMark light={light} />

      <span className="leading-none">
        <span
          className={cn(
            "block text-base font-extrabold",
            light ? "text-paper" : "text-ink"
          )}
        >
          آپ استودیو
        </span>

        <span
          className={cn(
            "mt-1 block text-[10px] tracking-[0.3em]",
            light ? "text-paper/60" : "text-muted"
          )}
          dir="ltr"
        >
          UP STUDIO
        </span>
      </span>
    </Link>
  );
}

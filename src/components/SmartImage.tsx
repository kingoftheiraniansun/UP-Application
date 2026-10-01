import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /** Ordered list of alternative sources tried after `src` fails. */
  fallbacks?: string[];
  /** @deprecated use `fallbacks` */
  fallbackSrc?: string;
  onFinalError?: () => void;
  wrapperClassName?: string;
}

/**
 * Image with skeleton loading, ordered fallback chain, and graceful failure.
 */
export default function SmartImage({ src, fallbacks, fallbackSrc, onFinalError, className, wrapperClassName, alt, ...rest }: Props) {
  const chain = [src, ...(fallbacks ?? []), ...(fallbackSrc ? [fallbackSrc] : [])].filter(
    (s, i, arr) => s && arr.indexOf(s) === i,
  );
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setStep(0);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (step < chain.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setFailed(true);
    onFinalError?.();
  };

  if (failed) {
    return (
      <div className={cn("flex items-center justify-center bg-paper-2 text-muted", wrapperClassName)} role="img" aria-label={alt}>
        <svg className="h-8 w-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M21 16l-5-5-8 8" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      <img
        {...rest}
        src={chain[step]}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn("transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0", className)}
      />
    </div>
  );
}

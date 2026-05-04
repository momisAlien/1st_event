import { useEffect, useState } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
};

export function SafeImage({ src, alt, className = "", fallbackLabel = "이미지 준비 중" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-[inherit] border border-white/70 bg-white/60 p-4 text-center text-sm font-bold text-cocoa shadow-inner ${className}`}
      >
        <span className="rounded-full bg-cream/80 px-4 py-2">{fallbackLabel}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} draggable={false} loading="lazy" decoding="async" />;
}

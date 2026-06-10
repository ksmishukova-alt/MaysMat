"use client";

import type { CSSProperties, ImgHTMLAttributes } from "react";

/** PNG с alpha — нативный img без оптимизации Next (избегаем белых/шахматных артефактов) */
export function DiagnosticAssetImage({
  src,
  alt = "",
  className,
  width,
  height,
  style,
  ...rest
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      draggable={false}
      decoding="async"
      style={{ background: "transparent", ...style }}
      {...rest}
    />
  );
}

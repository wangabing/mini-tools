"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { canvasContext } from "./mediaBrowser";
import styles from "./media.module.css";

export function CanvasPreview({ source, label, interactive, ...props }: {
  source: HTMLCanvasElement;
  label: string;
  interactive?: boolean;
} & Omit<ComponentProps<"canvas">, "width" | "height" | "ref">) {
  const preview = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!preview.current) return;
    const context = canvasContext(preview.current);
    context.clearRect(0, 0, source.width, source.height);
    context.drawImage(source, 0, 0);
  }, [source]);

  return <canvas ref={preview} width={source.width} height={source.height} aria-label={label}
    className={interactive ? styles.interactiveCanvas : styles.preview} {...props} />;
}

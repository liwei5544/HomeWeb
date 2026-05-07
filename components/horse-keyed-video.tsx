"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** 0..255, 越大越“严格地认为接近白色就是背景” */
  whiteThreshold?: number;
  /** 0..255, 允许的色差，越大越容易把偏灰也抠掉 */
  whiteTolerance?: number;
  flipX?: boolean;
};

export function HorseKeyedVideo({
  src,
  poster,
  className,
  whiteThreshold = 235,
  whiteTolerance = 28,
  flipX = false
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0;
    let h = 0;
    let lastGood: ImageData | null = null;
    let lastT = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp01((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };

    const renderFrame = () => {
      if (video.readyState < 2) return;

      // loop 回跳时，某些浏览器会短暂给到“过曝/白底”帧，直接复用上一帧避免闪烁
      const tNow = video.currentTime || 0;
      if (tNow + 0.02 < lastT && lastGood) {
        ctx.putImageData(lastGood, 0, 0);
        lastT = tNow;
        return;
      }
      lastT = tNow;

      ctx.clearRect(0, 0, w, h);
      if (flipX) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0, w, h);
      }

      const img = ctx.getImageData(0, 0, w, h);
      const data = img.data;

      let transparentCount = 0;
      const total = data.length / 4;

      // feather + de-spill (remove white fringe)
      // a=1 保留主体；a=0 变透明背景
      const t0 = Math.max(0, whiteThreshold - 20);
      for (let i = 0; i < data.length; i += 4) {
        const r0 = data[i]!;
        const g0 = data[i + 1]!;
        const b0 = data[i + 2]!;

        const max = r0 > g0 ? (r0 > b0 ? r0 : b0) : g0 > b0 ? g0 : b0;
        const min = r0 < g0 ? (r0 < b0 ? r0 : b0) : g0 < b0 ? g0 : b0;
        const chroma = max - min;
        const luma = (r0 + g0 + b0) / 3;

        // 背景判定：越白、越低色差 越像背景
        const whiteK = smoothstep(t0, 255, luma); // 0..1
        const chromaK = 1 - smoothstep(whiteTolerance, whiteTolerance + 30, chroma); // 0..1
        const bg = whiteK * chromaK;

        // 羽化：主体 alpha = 1 - bg^2
        const a = clamp01(1 - bg * bg);
        const A = Math.floor(255 * a);
        data[i + 3] = A;
        if (A < 8) transparentCount++;

        // 去白边：假设背景接近白色 (255)，对半透明区域做反算，减弱白色溢出
        if (a > 0.02 && a < 0.98) {
          const inv = 1 / a;
          const rr = (r0 - (1 - a) * 255) * inv;
          const gg = (g0 - (1 - a) * 255) * inv;
          const bb = (b0 - (1 - a) * 255) * inv;
          data[i] = Math.max(0, Math.min(255, rr)) | 0;
          data[i + 1] = Math.max(0, Math.min(255, gg)) | 0;
          data[i + 2] = Math.max(0, Math.min(255, bb)) | 0;
        }
      }

      // 如果这一帧几乎全透明，基本可判定为“坏帧”（loop 边界/解码抖动），复用上一帧
      if (transparentCount / total > 0.92 && lastGood) {
        ctx.putImageData(lastGood, 0, 0);
      } else {
        ctx.putImageData(img, 0, 0);
        lastGood = img;
      }
    };

    let raf = 0;
    let cancelVfc: (() => void) | null = null;
    const start = () => {
      const anyVideo = video as any;
      if (typeof anyVideo.requestVideoFrameCallback === "function") {
        let id = 0;
        const cb = () => {
          renderFrame();
          id = anyVideo.requestVideoFrameCallback(cb);
        };
        id = anyVideo.requestVideoFrameCallback(cb);
        cancelVfc = () => anyVideo.cancelVideoFrameCallback?.(id);
      } else {
        const loop = () => {
          renderFrame();
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }
    };

    const onCanPlay = () => {
      video.play().catch(() => {});
      start();
    };

    video.addEventListener("canplay", onCanPlay);

    return () => {
      window.removeEventListener("resize", onResize);
      video.removeEventListener("canplay", onCanPlay);
      cancelAnimationFrame(raf);
      cancelVfc?.();
    };
  }, [flipX, prefersReducedMotion, whiteThreshold, whiteTolerance]);

  return (
    <div className={className} aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
      />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}


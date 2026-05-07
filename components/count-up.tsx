"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "@/components/hooks/use-in-view";

function formatNumber(n: number, decimals: number) {
  const pow = Math.pow(10, decimals);
  const v = Math.round(n * pow) / pow;
  return decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
}

export function CountUp({
  to,
  suffix,
  durationMs = 1200,
  decimals = 0,
  className
}: {
  to: number;
  suffix?: string;
  durationMs?: number;
  decimals?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.25,
    once: true
  });
  const [val, setVal] = useState(0);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const v = from + (to - from) * easeOutCubic(t);
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, inView, prefersReducedMotion, to]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(val, decimals)}
      {suffix ?? ""}
    </span>
  );
}


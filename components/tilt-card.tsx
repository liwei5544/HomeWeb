"use client";

import { useMemo, useRef } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TiltCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rotY = clamp((px - 0.5) * 14, -10, 10);
    const rotX = clamp(-(py - 0.5) * 14, -10, 10);
    el.style.setProperty("--rx", `${rotX}deg`);
    el.style.setProperty("--ry", `${rotY}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave: React.PointerEventHandler<HTMLDivElement> = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={[
        "relative will-change-transform [transform-style:preserve-3d] transition-transform duration-200",
        "[transform:perspective(900px)_rotateX(var(--rx))_rotateY(var(--ry))]",
        className ?? ""
      ].join(" ")}
      style={
        {
          "--rx": "0deg",
          "--ry": "0deg",
          "--mx": "50%",
          "--my": "50%"
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-sm" />
        <div className="absolute inset-0 rounded-2xl bg-bg" />
      </div>
      <div className="relative">{children}</div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(380px circle at var(--mx) var(--my), rgba(0,217,255,0.18), transparent 55%)"
          }}
        />
      </div>
    </div>
  );
}


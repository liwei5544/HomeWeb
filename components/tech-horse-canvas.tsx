"use client";

import { useEffect, useMemo, useRef } from "react";

export function TechHorseCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0;
    let h = 0;
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const emitSpark = (x: number, y: number, scale: number) => {
      const n = Math.floor(rand(2, 5));
      for (let i = 0; i < n; i++) {
        sparks.push({
          x,
          y,
          vx: rand(-0.8, 1.2) * 60 * scale,
          vy: rand(-1.4, -0.4) * 60 * scale,
          life: rand(0.22, 0.52)
        });
      }
      if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
    };

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const roundedRect = (x: number, y: number, ww: number, hh: number, r: number) => {
      const rr = Math.min(r, ww / 2, hh / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + ww, y, x + ww, y + hh, rr);
      ctx.arcTo(x + ww, y + hh, x, y + hh, rr);
      ctx.arcTo(x, y + hh, x, y, rr);
      ctx.arcTo(x, y, x + ww, y, rr);
      ctx.closePath();
    };

    const drawHorse = (t: number) => {
      const scale = clamp(Math.min(w, h) / 820, 0.72, 1.18);
      const baseY = h * 0.62;

      // walk across screen from right to left, wrap around
      const travelW = w + 520 * scale;
      const speed = (0.10 + 0.04 * Math.sin(t * 0.3)) * w; // px/s-ish, adaptive to viewport
      const u = ((t * speed) % travelW) / travelW; // 0..1
      const x = w + 260 * scale - u * travelW;

      // gait motion
      const sway = Math.sin(t * 0.9) * 8 * scale;
      const bob = Math.sin(t * 3.2) * 3.6 * scale;
      const y = baseY + bob;

      // silhouette box
      const bodyW = 260 * scale;
      const bodyH = 88 * scale;
      const bodyX = x - bodyW / 2;
      const bodyY = y - bodyH / 2;

      // specular sweep (metal shimmer)
      const sweep = ((t * 0.17) % 1) * 1.6 - 0.3; // -0.3..1.3
      const sx1 = bodyX + bodyW * (sweep - 0.35);
      const sx2 = bodyX + bodyW * (sweep + 0.35);

      const metal = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY + bodyH);
      metal.addColorStop(0, "rgba(92,115,150,0.12)");
      metal.addColorStop(0.25, "rgba(205,225,255,0.18)");
      metal.addColorStop(0.5, "rgba(150,190,255,0.10)");
      metal.addColorStop(0.7, "rgba(110,120,170,0.14)");
      metal.addColorStop(1, "rgba(60,80,120,0.10)");

      const shimmer = ctx.createLinearGradient(sx1, bodyY, sx2, bodyY + bodyH);
      shimmer.addColorStop(0, "rgba(255,255,255,0)");
      shimmer.addColorStop(0.45, "rgba(255,255,255,0.0)");
      shimmer.addColorStop(0.52, "rgba(255,255,255,0.22)");
      shimmer.addColorStop(0.60, "rgba(0,217,255,0.10)");
      shimmer.addColorStop(0.75, "rgba(255,255,255,0)");

      // tail energy trail
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const trailW = 240 * scale;
      const trail = ctx.createLinearGradient(bodyX + bodyW * 0.75, bodyY, bodyX + bodyW + trailW, bodyY);
      trail.addColorStop(0, "rgba(0,217,255,0.10)");
      trail.addColorStop(0.3, "rgba(108,99,255,0.06)");
      trail.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = trail;
      ctx.beginPath();
      ctx.ellipse(bodyX + bodyW * 0.98, bodyY + bodyH * 0.55, trailW, 68 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // glow frame
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = "rgba(0,217,255,0.25)";
      ctx.shadowBlur = 22 * scale;
      ctx.lineWidth = 2.0 * scale;
      ctx.strokeStyle = "rgba(0,217,255,0.18)";

      // body
      roundedRect(bodyX, bodyY, bodyW, bodyH, 22 * scale);
      ctx.stroke();

      // neck + head (simple geometric)
      ctx.beginPath();
      ctx.moveTo(bodyX + bodyW * 0.22, bodyY + bodyH * 0.18);
      ctx.lineTo(bodyX + bodyW * 0.06, bodyY - 48 * scale);
      ctx.lineTo(bodyX - 42 * scale, bodyY - 58 * scale);
      ctx.lineTo(bodyX - 54 * scale, bodyY - 30 * scale);
      ctx.lineTo(bodyX - 10 * scale, bodyY - 12 * scale);
      ctx.lineTo(bodyX + bodyW * 0.18, bodyY + bodyH * 0.26);
      ctx.closePath();
      ctx.stroke();

      // head "eye" glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = "rgba(0,217,255,0.55)";
      ctx.shadowBlur = 18 * scale;
      ctx.fillStyle = "rgba(0,217,255,0.22)";
      ctx.beginPath();
      ctx.arc(bodyX - 34 * scale, bodyY - 38 * scale, 3.6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // tail
      ctx.beginPath();
      ctx.moveTo(bodyX + bodyW * 0.92, bodyY + bodyH * 0.48);
      ctx.quadraticCurveTo(
        bodyX + bodyW * 1.08,
        bodyY + bodyH * 0.40 + Math.sin(t * 1.3) * 16 * scale,
        bodyX + bodyW * 1.18,
        bodyY + bodyH * 0.78
      );
      ctx.stroke();
      ctx.restore();

      // fill metal + shimmer
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = metal;
      roundedRect(bodyX, bodyY, bodyW, bodyH, 22 * scale);
      ctx.fill();

      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = shimmer;
      roundedRect(bodyX, bodyY, bodyW, bodyH, 22 * scale);
      ctx.fill();
      ctx.restore();

      // armor segmentation lines
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.2 * scale;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.shadowColor = "rgba(0,217,255,0.12)";
      ctx.shadowBlur = 10 * scale;
      line(bodyX + bodyW * 0.18, bodyY + bodyH * 0.22, bodyX + bodyW * 0.86, bodyY + bodyH * 0.22);
      line(bodyX + bodyW * 0.18, bodyY + bodyH * 0.50, bodyX + bodyW * 0.90, bodyY + bodyH * 0.50);
      line(bodyX + bodyW * 0.18, bodyY + bodyH * 0.78, bodyX + bodyW * 0.82, bodyY + bodyH * 0.78);
      ctx.restore();

      // legs: 4 simple inverse-kinematics-ish lines
      const hipY = bodyY + bodyH * 0.88;
      const groundY = hipY + 108 * scale;
      const gait = t * 3.6;
      const step = Math.sin(gait);
      const step2 = Math.sin(gait + Math.PI);
      const legs = [
        { x: bodyX + bodyW * 0.28, p: step, a: 1 },
        { x: bodyX + bodyW * 0.40, p: step2, a: 0.82 },
        { x: bodyX + bodyW * 0.66, p: step2, a: 1 },
        { x: bodyX + bodyW * 0.78, p: step, a: 0.82 }
      ];

      for (const L of legs) {
        const lift = clamp((L.p + 1) / 2, 0, 1);
        const footY = lerp(groundY, groundY - 34 * scale, smoothstep(lift)) * L.a;
        const footX = L.x + (L.p * 22 * scale + sway * 0.2) * L.a;
        const kneeX = lerp(L.x, footX, 0.5) + (L.p * 10 * scale);
        const kneeY = lerp(hipY, footY, 0.55) - (1 - lift) * 10 * scale;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = 2.2 * scale;
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.shadowColor = "rgba(108,99,255,0.22)";
        ctx.shadowBlur = 14 * scale;

        line(L.x, hipY, kneeX, kneeY);
        line(kneeX, kneeY, footX, footY);

        // joint node
        ctx.fillStyle = "rgba(0,217,255,0.08)";
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 3.4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // foot spark: trigger near "impact"
        if (lift < 0.12) {
          emitSpark(footX, footY, scale);
        }
        if (lift > 0.78) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(0,217,255,0.10)";
          ctx.arc(footX, footY, 4.0 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // scanlines overlay for "tech metal" feel
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      const scanX = bodyX - 120 * scale;
      const scanY = bodyY - 130 * scale;
      const scanW = bodyW + 260 * scale;
      const scanH = bodyH + 320 * scale;
      ctx.beginPath();
      ctx.rect(scanX, scanY, scanW, scanH);
      ctx.clip();

      const offset = (t * 28) % 6;
      for (let yy = scanY + offset; yy < scanY + scanH; yy += 6) {
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scanX, yy);
        ctx.lineTo(scanX + scanW, yy);
        ctx.stroke();
      }
      ctx.restore();

      // subtle fog around
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const fog = ctx.createRadialGradient(x, y, 20 * scale, x, y, 260 * scale);
      fog.addColorStop(0, "rgba(0,217,255,0.06)");
      fog.addColorStop(0.35, "rgba(108,99,255,0.04)");
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fog;
      ctx.beginPath();
      ctx.arc(x, y, 260 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawSparks = (dt: number) => {
      if (!sparks.length) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 220 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.985;
        const a = clamp(s.life / 0.52, 0, 1);
        ctx.fillStyle = `rgba(0,217,255,${0.12 * a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.06 * a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    let raf = 0;
    let start = performance.now();
    let prev = start;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const dt = clamp((now - prev) / 1000, 0, 0.05);
      prev = now;
      ctx.clearRect(0, 0, w, h);
      drawHorse(t);
      drawSparks(dt);
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}


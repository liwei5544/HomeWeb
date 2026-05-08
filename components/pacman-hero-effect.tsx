"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** 归一化坐标 [0–1]² · 直角迷宫环路（末点经 Z 与起点闭合，单向循迹） */
const MAZE_POINTS_NORM: Array<[number, number]> = [
  [0.08, 0.56],
  [0.08, 0.2],
  [0.46, 0.2],
  [0.46, 0.8],
  [0.72, 0.8],
  [0.72, 0.34],
  [0.9, 0.34],
  [0.9, 0.66],
  [0.34, 0.66],
  [0.34, 0.56]
];

const PATH_CLOSED = true;

const PELLET_COUNT = 18;
const TRACK_HEIGHT_PX = 122;

type Point = [number, number];

function toPixels(norm: Array<Point>, w: number, h: number): Point[] {
  return norm.map(([nx, ny]) => [nx * w, ny * h]);
}

function getSegmentsPx(pts: Point[], closed: boolean): Array<[Point, Point]> {
  const segs: Array<[Point, Point]> = [];
  for (let i = 0; i < pts.length - 1; i++) {
    segs.push([pts[i], pts[i + 1]]);
  }
  if (closed && pts.length >= 2) {
    segs.push([pts[pts.length - 1], pts[0]]);
  }
  return segs;
}

function pathTotalLength(segs: Array<[Point, Point]>): number {
  return segs.reduce(
    (acc, [a, b]) => acc + Math.hypot(b[0] - a[0], b[1] - a[1]),
    0
  );
}

/** t ∈ [0,1) 沿路径弧长比例；环路含闭合边 */
function pointAlongSegments(
  segs: Array<[Point, Point]>,
  total: number,
  t: number
): { x: number; y: number } {
  if (segs.length === 0) {
    return { x: 0, y: 0 };
  }
  if (total < 1e-6) {
    const p = segs[0][0];
    return { x: p[0], y: p[1] };
  }
  const u = ((t % 1) + 1) % 1;
  let dist = u * total;
  for (const [a, b] of segs) {
    const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (dist <= segLen) {
      const r = segLen < 1e-6 ? 0 : dist / segLen;
      return {
        x: a[0] + r * (b[0] - a[0]),
        y: a[1] + r * (b[1] - a[1])
      };
    }
    dist -= segLen;
  }
  const b = segs[segs.length - 1][1];
  return { x: b[0], y: b[1] };
}

function pathDFromNorm(
  norm: Array<Point>,
  w: number,
  h: number,
  closed: boolean
): string {
  const d = norm
    .map(([nx, ny], i) => {
      const x = nx * w;
      const y = ny * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  return closed ? `${d} Z` : d;
}

type Props = {
  className?: string;
};

export function PacmanHeroEffect({ className }: Props) {
  const runAreaRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 300, h: TRACK_HEIGHT_PX });

  useEffect(() => {
    const el = runAreaRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const w = el.clientWidth;
      setDims({ w: Math.max(80, w), h: TRACK_HEIGHT_PX });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pathD = useMemo(
    () => pathDFromNorm(MAZE_POINTS_NORM, dims.w, dims.h, PATH_CLOSED),
    [dims.w, dims.h]
  );

  const pellets = useMemo(() => {
    const pts = toPixels(MAZE_POINTS_NORM, dims.w, dims.h);
    const segs = getSegmentsPx(pts, PATH_CLOSED);
    const total = pathTotalLength(segs);
    return Array.from({ length: PELLET_COUNT }, (_, i) => {
      const t = PELLET_COUNT > 0 ? i / PELLET_COUNT : 0;
      const p = pointAlongSegments(segs, total, t);
      return { ...p, delay: i * 0.07 };
    });
  }, [dims.w, dims.h]);

  const motionStyle: React.CSSProperties & {
    WebkitOffsetPath?: string;
    offsetPath?: string;
  } = {
    width: 56,
    height: 56,
    offsetPath: `path("${pathD}")`,
    WebkitOffsetPath: `path("${pathD}")`,
    offsetAnchor: "center",
    offsetRotate: "auto"
  };

  return (
    <div
      className={[
        "relative select-none pointer-events-none overflow-hidden rounded-3xl",
        "border border-white/[0.08] bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className ?? ""
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.06]" />
      <div className="absolute inset-x-4 top-3 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative px-5 pb-6 pt-8 sm:px-8">
        <p className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-muted/80">
          吞噬 · 增长
        </p>

        <div
          className="relative mx-auto w-full max-w-[340px]"
          style={{ height: TRACK_HEIGHT_PX }}
        >
          <div
            ref={runAreaRef}
            className="absolute inset-x-4 top-0 overflow-visible"
            style={{ height: TRACK_HEIGHT_PX }}
          >
            <svg
              className="pointer-events-none absolute inset-0 text-white/[0.07]"
              width="100%"
              height="100%"
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={pathD}
                fill="none"
                className="stroke-current"
                strokeWidth={20}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
              <path
                d={pathD}
                fill="none"
                className="stroke-accent/[0.12]"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 6"
                opacity={0.85}
              />
            </svg>

            {pellets.map(({ x, y, delay }, i) => (
              <div
                key={`pellet-${i}`}
                className="pac-pellet absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/65 shadow-[0_0_10px_rgba(0,217,255,0.35)]"
                style={{
                  left: x,
                  top: y,
                  animationDelay: `${delay}s`
                }}
              />
            ))}
          </div>

          <div
            className="pac-runner-wrap pointer-events-none absolute inset-x-4 top-0 z-10"
            style={{ height: TRACK_HEIGHT_PX }}
          >
            <div className="pac-runner" style={motionStyle}>
              <div className="pacman-sprite relative h-14 w-14">
                <div className="pacman-body h-full w-full rounded-full bg-gradient-to-br from-[#fff59d] via-[#ffeb3b] to-[#fbc02d] shadow-[0_0_24px_rgba(255,235,59,0.35),0_0_6px_rgba(0,217,255,0.25)]" />
                <div className="pacman-face absolute left-[34%] top-[14%] z-10 h-1.5 w-1.5 rounded-full bg-[#1a1040] ring-1 ring-black/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-end justify-center gap-5 pb-1">
          <Ghost color="bg-[#FF6B9D]" delay={0} />
          <Ghost color="bg-accent/90" delay={0.15} />
          <Ghost color="bg-primary/90" delay={0.3} />
        </div>
      </div>
    </div>
  );
}

function Ghost({ color, delay }: { color: string; delay: number }) {
  return (
    <div
      className={[
        "ghost-bob flex h-11 w-9 flex-col items-center justify-end rounded-t-full pb-0.5 opacity-90",
        color,
        "shadow-[0_0_14px_rgba(0,0,0,0.35)]"
      ].join(" ")}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-2 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>
      <div className="flex w-full justify-center gap-0.5 px-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-b-sm bg-[#0a0a0f]/55" />
        ))}
      </div>
    </div>
  );
}

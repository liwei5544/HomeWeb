"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/reveal";

type TItem = {
  name: string;
  role: string;
  quote: string;
};

const items: TItem[] = [
  {
    name: "林然",
    role: "增长负责人 · CloudNova",
    quote:
      "上线后我们把核心链路可用性从 98.7% 提升到 99.95%，同时告警噪音下降了一半。"
  },
  {
    name: "周启",
    role: "CTO · VectorAI",
    quote:
      "最喜欢的是可观测性一体化：定位一次复杂问题从 2 小时变成 10 分钟。"
  },
  {
    name: "孟雪",
    role: "产品负责人 · HyperFlow",
    quote:
      "工作流编排让跨团队协作顺畅很多，我们终于把“流程”变成了可复用的资产。"
  }
];

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = window.setInterval(() => {
      setIdx((x) => (x + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [prefersReducedMotion]);

  return (
    <section id="testimonials" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-widest text-muted">TESTIMONIALS</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                客户说这很“稳”
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                我们更关注“上线后”的真实体验，而不是只看演示效果。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIdx((x) => (x - 1 + items.length) % items.length)}
                className="rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 transition hover:bg-white/10"
              >
                上一个
              </button>
              <button
                type="button"
                onClick={() => setIdx((x) => (x + 1) % items.length)}
                className="rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 transition hover:bg-white/10"
              >
                下一个
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${idx * 100}%` }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.9
            }}
          >
            {items.map((it) => (
              <div key={it.name} className="w-full flex-none pr-6 md:pr-10">
                <TestimonialCard item={it} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={[
                "h-2.5 w-2.5 rounded-full ring-1 ring-white/10 transition",
                i === idx
                  ? "bg-accent shadow-[0_0_18px_rgba(0,217,255,0.55)]"
                  : "bg-white/10 hover:bg-white/20"
              ].join(" ")}
              aria-label={`切换到第 ${i + 1} 条评价`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: TItem }) {
  return (
    <Reveal>
      <div className="relative rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:p-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-60" />
        <div className="relative">
          <p className="text-lg leading-relaxed text-fg md:text-xl">
            “{item.quote}”
          </p>
          <div className="mt-8 flex items-center justify-between gap-6">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="mt-1 text-sm text-muted">{item.role}</div>
            </div>
            <div className="hidden h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 md:block" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}


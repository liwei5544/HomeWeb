"use client";

import { motion } from "framer-motion";
import { ParticlesCanvas } from "@/components/particles-canvas";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="absolute inset-0 bg-hero-grid" aria-hidden="true" />
      <ParticlesCanvas className="absolute inset-0 opacity-70" />
      <div className="noise" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-center px-4">
        <Reveal>
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-muted ring-1 ring-white/10">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(0,217,255,0.6)]" />
            未来已来 · NebulaX 智能平台
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl">
            让你的产品拥有{" "}
            <span className="bg-text-gradient bg-clip-text text-transparent">
              科技级增长引擎
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">
            以实时数据、自动化流程与可观测性为核心，NebulaX 帮你在更少成本下交付更稳定、更快的增长体验。
          </p>
        </Reveal>

        <Reveal delay={0.20}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <GlowingButton>立即开始</GlowingButton>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full bg-white/5 px-6 py-3 text-sm text-fg ring-1 ring-white/10 transition hover:bg-white/10"
            >
              查看功能
            </a>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.35 }}
          className="mt-12 grid max-w-3xl grid-cols-1 gap-4 text-sm text-muted sm:grid-cols-3"
        >
          {[
            { k: "99.9%", v: "可用性" },
            { k: "10ms", v: "边缘响应" },
            { k: "AES-256", v: "数据加密" }
          ].map((x) => (
            <div
              key={x.v}
              className="rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10"
            >
              <div className="text-lg font-semibold text-fg">{x.k}</div>
              <div className="mt-1">{x.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GlowingButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className={[
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 text-sm font-medium",
        "bg-primary/20 text-fg ring-1 ring-primary/40 shadow-glow",
        "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glowStrong"
      ].join(" ")}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-accent/70 via-primary/70 to-accent/70 blur-md" />
      </span>
      <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="absolute inset-0 rounded-full bg-white/5" />
        <span className="absolute left-0 top-0 h-full w-[140%] -translate-x-[60%] bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm group-hover:animate-shimmer" />
      </span>
      <span className="relative">{children}</span>
    </a>
  );
}


"use client";

import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";

const features = [
  {
    title: "实时洞察",
    desc: "从采集到分析全链路低延迟，让关键决策更快发生。",
    tag: "Streaming"
  },
  {
    title: "自动化编排",
    desc: "用可视化工作流把复杂流程模块化，减少手工与错误。",
    tag: "Orchestration"
  },
  {
    title: "可观测性",
    desc: "指标、日志、链路一体化，问题定位从小时缩短到分钟。",
    tag: "Observability"
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-widest text-muted">FEATURES</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                为增长而生的核心能力
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                以现代工程能力为底座，让你的产品更快、更稳、更易扩展。
              </p>
            </div>
            <a
              href="#"
              className="rounded-full bg-white/5 px-5 py-2 text-sm text-fg ring-1 ring-white/10 transition hover:bg-white/10"
            >
              获取方案
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, idx) => (
            <Reveal key={f.title} delay={0.06 * idx}>
              <div className="group">
                <TiltCard className="rounded-2xl">
                  <div className="relative rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">{f.title}</h3>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-muted ring-1 ring-white/10">
                          {f.tag}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {f.desc}
                      </p>
                      <div className="mt-7 inline-flex items-center gap-2 text-sm text-accent">
                        了解更多
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export function Stats() {
  return (
    <section id="stats" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs tracking-widest text-muted">METRICS</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  数据驱动的可靠增长
                </h2>
                <p className="mt-4 max-w-xl text-muted">
                  数字不是装饰，而是我们对体验与稳定性的承诺。
                </p>
              </div>
              <a
                href="#"
                className="w-fit rounded-full bg-white/5 px-5 py-2 text-sm text-fg ring-1 ring-white/10 transition hover:bg-white/10"
              >
                下载白皮书
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <StatCard
                label="用户规模"
                value={<CountUp to={10000} suffix="+" className="tabular-nums" />}
                hint="覆盖多个行业场景"
              />
              <StatCard
                label="可用性"
                value={
                  <CountUp
                    to={99.9}
                    decimals={1}
                    suffix="%"
                    className="tabular-nums"
                  />
                }
                hint="多活架构 + 自动容灾"
              />
              <StatCard
                label="部署效率"
                value={<CountUp to={6} suffix="x" className="tabular-nums" />}
                hint="更快迭代，更稳交付"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-bg/40 p-6 ring-1 ring-white/10">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-4xl font-semibold text-fg">{value}</div>
      <div className="mt-3 text-sm text-muted">{hint}</div>
    </div>
  );
}


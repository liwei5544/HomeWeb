"use client";

import { Reveal } from "@/components/reveal";

export function Footer() {
  return (
    <footer className="relative pb-14 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-col gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">
                <span className="bg-text-gradient bg-clip-text text-transparent">
                  NebulaX
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                © {new Date().getFullYear()} NebulaX. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <SocialIcon label="X / Twitter" />
              <SocialIcon label="GitHub" />
              <SocialIcon label="LinkedIn" />
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

function SocialIcon({ label }: { label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
    >
      <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(0,217,255,0.6)]" />
    </a>
  );
}


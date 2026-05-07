"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "产品", href: "#features" },
  { label: "数据", href: "#stats" },
  { label: "评价", href: "#testimonials" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "glass-strong" : "glass"
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a
          href="#"
          className="group inline-flex items-center gap-2 font-semibold tracking-wide"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <span className="absolute inset-0 rounded-lg bg-hero-grid opacity-80 blur-[1px]" />
            <span className="relative text-accent">N</span>
          </span>
          <span className="bg-text-gradient bg-clip-text text-transparent">
            NebulaX
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-fg ring-1 ring-white/10 transition hover:bg-white/10"
          >
            控制台
          </a>
        </nav>

        <a
          href="#"
          className="md:hidden rounded-full bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
        >
          菜单
        </a>
      </div>
    </header>
  );
}


"use client";

import { useEffect, useState } from "react";

export function useInView<T extends Element>(opts?: {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}) {
  const [el, setEl] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!el) return;
    if (opts?.once && inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const v = entries.some((e) => e.isIntersecting);
        if (v) {
          setInView(true);
          if (opts?.once) observer.disconnect();
        } else if (!opts?.once) {
          setInView(false);
        }
      },
      {
        root: opts?.root ?? null,
        rootMargin: opts?.rootMargin ?? "0px",
        threshold: opts?.threshold ?? 0.15
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [el, inView, opts?.once, opts?.root, opts?.rootMargin, opts?.threshold]);

  return { ref: setEl, inView };
}


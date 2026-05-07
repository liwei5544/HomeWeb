"use client";

import { motion, type MotionProps } from "framer-motion";
import { useInView } from "@/components/hooks/use-in-view";

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
    once
  });

  const motionProps: MotionProps = {
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div {...motionProps}>{children}</motion.div>
    </div>
  );
}


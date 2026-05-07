"use client";

import { Navbar } from "@/components/navbar";
import { MouseHalo } from "@/components/mouse-halo";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-bg text-fg">
      <MouseHalo />
      <Navbar />

      <div className="relative">
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}


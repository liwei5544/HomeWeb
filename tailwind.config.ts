import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        primary: "#6C63FF",
        accent: "#00D9FF",
        fg: "#FFFFFF",
        muted: "#B0B0B0"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(108,99,255,0.35), 0 0 30px rgba(0,217,255,0.15)",
        glowStrong:
          "0 0 0 1px rgba(0,217,255,0.55), 0 0 45px rgba(108,99,255,0.25)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(1000px circle at 10% 10%, rgba(108,99,255,0.20), transparent 40%), radial-gradient(800px circle at 90% 20%, rgba(0,217,255,0.16), transparent 45%), radial-gradient(900px circle at 50% 95%, rgba(108,99,255,0.12), transparent 50%)",
        "text-gradient":
          "linear-gradient(90deg, #6C63FF 0%, #00D9FF 55%, #6C63FF 100%)"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(40%)" }
        }
      },
      animation: {
        shimmer: "shimmer 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;


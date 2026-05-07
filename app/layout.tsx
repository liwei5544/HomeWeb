import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NebulaX | 科技产品官网",
  description: "现代暗黑科技风官网模板：Next.js + Tailwind + Framer Motion"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}


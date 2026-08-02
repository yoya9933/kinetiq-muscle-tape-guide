import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import "./effects.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSansTC = Noto_Sans_TC({ variable: "--font-noto-tc", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ??
  (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KinetiQ｜個人化智慧肌貼導引",
  description: "從症狀分析、姿態校正到肌貼參數與 AR 貼附教學，完成個人化肌貼導引。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "KinetiQ｜個人化智慧肌貼導引",
    description: "建立身體模型、分析症狀、校正姿態，取得個人化肌貼方案與 AR 貼附教學。",
    images: [{ url: "/og.png", width: 1739, height: 909, alt: "KinetiQ 個人化智慧肌貼導引" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KinetiQ｜個人化智慧肌貼導引",
    description: "從症狀分析到 AR 貼附教學的完整個人化流程。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable}`}>{children}</body></html>;
}

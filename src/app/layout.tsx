import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import "@/styles/globals.css";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "ASPOEM - 中文诗词阅读网站",
  description:
    "ASPOEM 是一个专注于中文古诗词的在线阅读平台，提供免费打印诗词、精美的诗词排版设计、拼音标注、详细注释、准确译文和深度赏析。支持在线纠错，让每个人都能轻松欣赏和阅读中国古典诗词。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          {children}

          <Toaster richColors position="top-right" />
          <NextTopLoader />
        </TRPCReactProvider>

        {env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  );
}

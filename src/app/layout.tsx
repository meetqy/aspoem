import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/utils";

import Script from "next/script";
import { type Metadata } from "next";
import localFont from "next/font/local";

const fontSTKaiti = localFont({
  variable: "--font-st-kaiti",
  src: "./fonts/STKaiti.ttf",
});

export const metadata: Metadata = {
  title: "AsPoem.com - 现代化中国诗词学习网站",
  description: `aspoem.com是一个现代化的中国诗词学习网站，为用户提供全站搜索诗词、拼音标注、注释和白话文翻译等功能。无论您是对唐诗宋词感兴趣，还是想深入学习古代诗词的欣赏与解读，aspoem.com都是您的理想选择。我们致力于为用户提供丰富的诗词学习资源，帮助您更好地理解和鉴赏中国古典文学的精华。不仅如此，我们还推荐优质的诗词学习工具和下载资源，助您在诗词学习的道路上更上一层楼。欢迎您来到aspoem.com，开始您的中国诗词之旅！`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "中国诗词学习",
    "现代化诗词网站",
    "全站搜索诗词",
    "拼音标注诗词",
    "注释诗词",
    "白话文翻译诗词",
    "诗词学习资源",
    "学习唐诗宋词",
    "诗词学习网站推荐",
  ],
  metadataBase: new URL("https://aspoem.com"),
  twitter: {
    creator: "@meetqy",
    images: "/opengraph-image",
  },
  openGraph: {
    images: "/opengraph-image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(
          "min-h-screen bg-background font-cursive font-normal text-foreground antialiased",
          fontSTKaiti.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PYEC5EG749" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-PYEC5EG749');
          `}
        </Script>
      </body>
    </html>
  );
}

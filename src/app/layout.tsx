import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/utils";

import Script from "next/script";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "学习中国古诗词 - aspoem.com",
  description: `让我们一起来学习中国古诗词吧！快速查找诗词，拼音标注，现代化网页设计便于阅读。`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["中国古诗词", "拼音", "学习", "诗词", "古诗词", "aspoem.com"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-cursive text-foreground antialiased",
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

import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/utils";

import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "学习中国古诗词 - aspoem.com",
  description: `让我们一起来学习中国古诗词吧！快速查找诗词，拼音标注，现代化网页设计便于阅读。`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        {/* <div className="bg-patterns-wavy fixed z-0 h-screen w-screen"></div> */}
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

        <SpeedInsights />
        <Analytics />
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

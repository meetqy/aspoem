import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/utils";

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
        className={cn("min-h-screen bg-background font-cursive antialiased")}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

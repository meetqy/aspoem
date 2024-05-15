import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar/index";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Footer } from "@/components/footer";
import { SideBarLayout } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";
import { items } from "@/components/layout/sidebar-items";
import { ScrollShadow } from "@nextui-org/react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="container mx-auto flex justify-center">
            <SideBarLayout />
            <main className="flex-1 h-[3000px]"></main>
            <aside className="w-72 h-screen border-x-small border-divider sticky top-0 right-0">
              123
            </aside>
          </div>
        </Providers>
      </body>
    </html>
  );
}

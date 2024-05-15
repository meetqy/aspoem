import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import { SideBarLayout } from "@/components/layout";
import { Input, Kbd } from "@nextui-org/react";
import { SearchIcon } from "@/components/icons";

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
          <div className="container max-w-screen-2xl px-12 mx-auto flex justify-center">
            <SideBarLayout />

            <main className="flex-1">{children}</main>

            <aside className="w-72 h-screen sticky top-0 right-0 py-8">
              <Input
                aria-label="搜索诗词、诗人"
                size="lg"
                classNames={{
                  inputWrapper: "bg-default-100",
                  input: "text-sm",
                }}
                endContent={
                  <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                  </Kbd>
                }
                labelPlacement="outside"
                placeholder="搜索诗词、诗人"
                startContent={
                  <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="search"
              />
            </aside>
          </div>
        </Providers>
      </body>
    </html>
  );
}

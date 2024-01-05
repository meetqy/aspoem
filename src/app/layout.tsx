import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { description } from "~/utils/constant";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Learn Chinese Poetry With AsPoem.com",
  description: `ASPOEM - ${description}`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-cursive bg-base-200/50 antialiased">
        <TRPCReactProvider>
          {children}
          <div id="dialog"></div>
        </TRPCReactProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

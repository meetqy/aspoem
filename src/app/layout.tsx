import "~/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { description } from "~/utils/constant";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ASPOEM",
  description: `ASPOEM - ${description}`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ fontFamily: "cursive" }}>
      <body className="bg-base-200/50">
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>

        <SpeedInsights />
        <Analytics />
        <div id="dialog"></div>
      </body>
    </html>
  );
}

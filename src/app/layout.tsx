import "~/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { description } from "~/utils/constant";

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
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

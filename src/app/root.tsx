import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/themes.css";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

import dynamic from "next/dynamic";
import LoadFont from "./load-font";
import { type Locale } from "~/dictionaries";
import { Language } from "~/dictionaries/language";

const MicrosoftClarity = dynamic(
  () => import("~/components/metrics/microsoft-clarity"),
  {
    ssr: false,
  },
);

const GoogleAnalytics = dynamic(
  () => import("~/components/metrics/google-analytics"),
  {
    ssr: false,
  },
);

export default function Root({
  children,
  lang,
  head,
  languageComponent = true,
}: {
  children: React.ReactNode;
  lang: Locale;
  head?: React.ReactNode;
  languageComponent?: boolean;
}) {
  return (
    <html lang={lang}>
      {head}
      <body className="theme-zinc font-cursive min-h-screen bg-background font-normal text-foreground antialiased">
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

        <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID} />
        <MicrosoftClarity id={process.env.NEXT_PUBLIC_MC_ID} />
        <LoadFont />
        {languageComponent && <Language />}
      </body>
    </html>
  );
}

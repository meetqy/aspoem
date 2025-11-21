"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname change triggers scroll reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <TRPCReactProvider>
      {children}

      <Toaster richColors position="top-right" />
      <NextTopLoader />
    </TRPCReactProvider>
  );
};

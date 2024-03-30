"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const Language = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    document.documentElement.lang = lang || "zh-Hans";

    if (/^\/(demo|create)/.test(pathname)) return;

    if (params.lang === lang || !lang) {
      localStorage.setItem("lang", params.lang as string);

      return;
    }

    router.replace(pathname.replace(params.lang as string, lang));
  }, [params.lang, pathname, router]);

  return null;
};

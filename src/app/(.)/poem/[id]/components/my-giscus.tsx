"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function MyGiscus() {
  const { systemTheme, theme } = useTheme();

  console.log(theme, systemTheme);

  return (
    <Giscus
      id="meetqy/aspoem"
      host="https://giscus.aspoem.com"
      repo="meetqy/aspoem"
      repoId="R_kgDOK7V2Mg"
      category="Announcements"
      categoryId="DIC_kwDOK7V2Ms4CcP_D"
      mapping="title"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme === "system" ? systemTheme : theme}
      lang="zh-CN"
    />
  );
}

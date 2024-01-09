"use client";

import Script from "next/script";

export default function Page() {
  return (
    <div className="container m-auto">
      <Script
        src="https://aspoem-giscus.vercel.app/client.js"
        data-repo="meetqy/aspoem"
        data-repo-id="R_kgDOK7V2Mg"
        data-category="Announcements"
        data-category-id="DIC_kwDOK7V2Ms4CcP_D"
        data-mapping="title"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossOrigin="anonymous"
        async
      />
    </div>
  );
}

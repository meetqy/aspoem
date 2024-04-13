"use client";

import { useEffect } from "react";
import "./index.css";
import { usePathname } from "next/navigation";
import { type Locale } from "~/dictionaries";

export default function Twikoo({ lang }: { lang: Locale }) {
  const pathname = usePathname().replace(`/${lang}`, "");

  useEffect(() => {
    // 通过 CDN 引入 twikoo js 文件
    const cdnScript = document.createElement("script");
    cdnScript.src =
      "https://cdn.staticfile.org/twikoo/1.6.31/twikoo.all.min.js";
    cdnScript.async = true;

    const loadSecondScript = () => {
      // 执行 twikoo.init() 函数
      const initScript = document.createElement("script");
      let _lang: string = lang;
      lang === "zh-Hans" && (_lang = "zh-cn");
      lang === "zh-Hant" && (_lang = "zh-tw");

      initScript.innerHTML = `
            twikoo.init({
              envId: "https://twikoo.aspoem.com/.netlify/functions/twikoo",
              el: '#twikoo-comment',
              lang: "${_lang}",
              path: "${pathname}",
            });
          `;
      initScript.id = "twikoo-init-id"; // 添加唯一的 ID
      document.body.appendChild(initScript);
    };

    // 在 twikoo js 文件加载完成后，再加载执行 twikoo.init() 函数的 js 文件
    cdnScript.addEventListener("load", loadSecondScript);
    document.body.appendChild(cdnScript);

    return () => {
      if (loadSecondScript) {
        cdnScript.removeEventListener("load", loadSecondScript);
      }
      if (cdnScript) {
        document.body.removeChild(cdnScript);
      }
      const secondScript = document.querySelector("#twikoo-init-id");
      if (secondScript) {
        document.body.removeChild(secondScript);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="twikoo-comment"></div>;
}

"use client";

import React, { useEffect } from "react";

const Twikoo: React.FC = () => {
  useEffect(() => {
    // 通过 CDN 引入 twikoo js 文件
    const cdnScript = document.createElement("script");
    cdnScript.src =
      "https://cdn.staticfile.org/twikoo/1.6.25/twikoo.all.min.js";
    cdnScript.async = true;

    const loadSecondScript = () => {
      // 执行 twikoo.init() 函数
      const initScript = document.createElement("script");
      initScript.innerHTML = `
            twikoo.init({
              envId: "https://twikoo.aspoem.com/.netlify/functions/twikoo",
              el: '#twikoo-comment'
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
  }, []);

  return <div id="twikoo-comment"></div>;
};

export default function Page() {
  return (
    <div className="container max-w-screen-md font-serif">
      <Twikoo />
    </div>
  );
}

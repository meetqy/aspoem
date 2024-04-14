"use client";

import { useEffect } from "react";
import { Random } from "unsplash-js/dist/methods/photos/types";
import { unsplash } from "~/utils/unsplash";

export default function Page() {
  useEffect(() => {
    (async () => {
      const res = await unsplash.photos.getRandom({ count: 100 });

      const result = res.response as Random[];

      const urls = result.map((item) => item.urls.regular);
      console.log(urls);
    })();
  });

  return <div></div>;
}

"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./index.css";
import { Verse } from "~/components/verse";

export default function PrintPage() {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="flex">
      <aside className="w-72">
        <button onClick={handlePrint}>Print this out!</button>
      </aside>
      <div
        className="mx-auto min-h-screen w-full max-w-screen-lg flex-shrink-0 border px-8 py-16 font-cursive"
        ref={componentRef}
      >
        <div className="space-y-4">
          <Verse variant="title" content={"春晓"} py="chūn xiǎo" />
          <p className="!mb-8 text-center text-xl">唐 · 孟浩然</p>
          <Verse
            variant="shi"
            content="春眠不觉晓，处处闻啼鸟。"
            py="chūn mián bù jué xiǎo . chù chù wén tí niǎo . "
          />
          <Verse
            variant="shi"
            content="夜来风雨声，花落知多少。"
            py="yè lái fēng yǔ shēng . huā luò zhī duō shǎo ."
          />
        </div>
      </div>
    </div>
  );
}

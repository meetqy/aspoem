"use client";

import { api } from "~/trpc/react";
import "./index.css";

const chinese_symbols = ["，", "。"];

export default function Page() {
  const { data } = api.poem.findById.useQuery({
    id: 568,
  });

  if (!data) return null;

  const py_paragraphs = data.contentPinYin?.split("\n") ?? [];
  const paragraphs = data.content.split("\n");

  return (
    <div className="m-auto min-h-screen max-w-screen-md border py-24">
      {paragraphs.map((paragraph, i) => (
        <p className="py-line" key={i}>
          {paragraph.split("").map((char, j) => (
            <Ruby key={j} char={char} rt={py_paragraphs[i]?.split(" ")[j]} />
          ))}
        </p>
      ))}
    </div>
  );
}

export const Ruby = ({ char, rt }: { char: string; rt?: string }) => {
  if (rt && !chinese_symbols.includes(char)) {
    return (
      <span className="py-result-item">
        <ruby>
          <span className="py-chinese-item">{char}</span>
          <rp>(</rp>
          <rt>{rt}</rt>
          <rp>)</rp>
        </ruby>
      </span>
    );
  }

  return <span className="py-non-chinese-item">{char}</span>;
};

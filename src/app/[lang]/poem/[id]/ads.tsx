"use client";

import { type Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const JDAds = ({ tag }: { tag: Tag }) => {
  if (!tag.adsUrl) return null;
  if (!tag.adsImage) return null;

  return (
    <Link
      href={tag.adsUrl}
      target="_blank"
      className="inline-flex flex-col overflow-hidden rounded-md border border-border bg-card pt-4"
    >
      <Image
        width={300}
        height={300}
        className="aspect-3/4 mx-auto"
        alt={`${tag.adsTitle} - ${tag.adsContent}`}
        src={tag.adsImage}
      />

      <div className="relative flex p-4">
        <div>
          <h3 className="text-f200">{tag.adsTitle}</h3>
          <p className="text-f50 text-card-foreground/70">{tag.adsContent}</p>
        </div>
        <span className="flex-1 text-end font-mono text-f100 text-destructive">
          ￥{tag.adsPrice}
        </span>
      </div>
    </Link>
  );
};

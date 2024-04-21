import { type Card, type Poem } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { R2Host } from "~/utils";

export default function ShowPoemCard({
  poem,
}: {
  poem: Poem & { cards: Card[] };
}) {
  return (
    <>
      <h2 id="#摘抄卡片" className="prose-h2">
        摘抄卡片
      </h2>

      <p className="prose-p mb-6 text-muted-foreground">
        点击可查看高清大图，支持免费下载。
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {poem.cards.map((item) => (
          <Link
            key={item.url}
            className="relative aspect-[3/4]"
            href={`${R2Host}/aspoem/${item.url}.png`}
            title="查看原图"
            target="_blank"
          >
            <Image
              className="m-auto rounded-md shadow-md"
              src={`${R2Host}/aspoem/${item.url}_md.webp`}
              fill={true}
              quality={100}
              alt={`《${poem.title}》 | 诗词摘抄片段`}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

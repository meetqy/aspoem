import { type Author, type Poem } from "@prisma/client";
import { Verse } from "~/components/verse";
import { cn } from "~/utils";
import CopyButton from "./Copy";

export const Shi = (props: {
  poem: Poem & { author: Author };
  py?: boolean;
}) => {
  const { py, poem } = props;

  const content = poem.content.split("\n");
  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];

  const annotation = JSON.parse(poem.annotation ?? "{}") as {
    [key in string]: string;
  };

  const titlePinYin = py ? poem.titlePinYin ?? "" : "";

  return (
    <article className="group py-8">
      <div className={cn(py && "space-y-4")}>
        <Verse variant="title" content={poem.title} py={titlePinYin} />
        <Verse
          content={`${poem.author.dynasty}·${poem.author.name}`}
          className={cn("!mb-6 mt-4")}
        />
        {content.map((line, index) => (
          <Verse
            key={line}
            content={line}
            variant="shi"
            annotation={annotation}
            py={py ? contentPinYin[index] : ""}
          />
        ))}
      </div>

      <CopyButton
        data={poem}
        className="absolute right-1 top-1 transition-all group-hover:opacity-100 md:opacity-0"
      />
    </article>
  );
};

import { DicesIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { PoemListItem } from "../_components/poem-list-item";
import { discover } from "../_components/sidebar-items";

const discoverItem = discover.find((item) => item.title === "随机诗文")!;

export const metadata = {
  title: discoverItem.title,
  description: discoverItem.description,
};

export default async function Page() {
  const poem = await api.poem.getRandom();

  if (!poem) {
    notFound();
  }

  return (
    <>
      <div className="mb-6 flex justify-between ">
        <div>
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
            {discoverItem.title}
          </h1>
          <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            {discoverItem.description}
          </p>
        </div>

        <Button
          variant={"secondary"}
          size="icon-lg"
          asChild
          aria-label="随机一首诗文"
        >
          <Link href={`/poems/random?t=${Date.now()}`} suppressHydrationWarning>
            <DicesIcon />
          </Link>
        </Button>
      </div>
      <PoemListItem paragraphsSlice={-1} poem={poem} />
    </>
  );
}

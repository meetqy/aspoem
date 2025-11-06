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
      <div className="flex justify-end">
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

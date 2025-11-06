import { DicesIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
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
      <Card className="shadow-none hover:bg-accent/30 transition-colors mt-4">
        <CardHeader>
          <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4">
            <Link href={`/poems/detail/${poem.titleSlug}`}>{poem.title}</Link>
          </h2>
          <p className="text-muted-foreground">
            [{poem.author.dynasty.name}] {poem.author.name}
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {poem.paragraphs.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <div className="space-x-2">
            {["咏物", "写花", "纪实", "唐诗三百首"].map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

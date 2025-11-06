import Link from "next/link";
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

const discoverItem = discover.find((item) => item.title === "最近更新")!;

export const metadata = {
  title: discoverItem.title,
  description: discoverItem.description,
};

export default async function Home() {
  const { items } = await api.poem.getLatestList({ limit: 20 });

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          {discoverItem.title}
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          {discoverItem.description}
        </p>
      </div>
      <div className="space-y-4">
        {items.map((poem) => (
          <Card
            key={poem.id}
            className="shadow-none hover:bg-accent/30 transition-colors"
          >
            <CardHeader>
              <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4">
                <Link href={`/poems/detail/${poem.titleSlug}`}>
                  {poem.title}
                </Link>
              </h2>
              <p className="text-muted-foreground">
                [{poem.author.dynasty.name}] {poem.author.name}
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {poem.paragraphs.slice(0, 4).map((line, index) => (
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
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button size={"lg"} variant="secondary">
          加载更多...
        </Button>
      </div>
    </>
  );
}

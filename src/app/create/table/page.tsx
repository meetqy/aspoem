"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { pinyin as GeneratePinyin } from "pinyin-pro";
import { GenreSelect } from "../components/GenreSelect";

type C = {
  title: string;
  content: string;
  author: string;
  dynasty: string;
  tags: string[];
};

export default function Page() {
  const [dataSource, setDataSource] = useState<C[]>([]);
  const utils = api.useUtils();
  const [genre, setGenre] = useState("诗");

  const author = api.author.create.useMutation();
  const poem = api.poem.create.useMutation();
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [save, setSave] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(`?token=${localStorage.getItem("token")}`);
    }
  }, [token, router]);

  const { data } = api.author.findMany.useQuery({ pageSize: 999 });
  const authorNames = data?.data.map((item) => item.name) ?? [];

  const add = (item: C) => {
    if (!authorNames.includes(item.author)) {
      author
        .mutateAsync({
          name: item.author,
          dynasty: item.dynasty,
          token,
        })
        .then((e) => {
          addPoem(item, e.id);
          void utils.author.invalidate();
        })
        .catch((e) => {
          console.error("author", e);
          alert(e);
        });
    } else {
      const authorId = data?.data.find((e) => e.name === item.author)?.id;
      if (authorId) {
        addPoem(item, authorId);
      }
    }
  };

  useEffect(() => {
    void fetch("/content.json")
      .then((res) => res.json())
      .then((res) => {
        setDataSource(
          (res as C[]).filter((item) => !save.includes(item.title)),
        );

        setSave(JSON.parse(localStorage.getItem("save") || "[]") as string[]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (save.length === 0) return;

    setDataSource((dataSource) => {
      return dataSource.filter((item) => !save.includes(item.title));
    });

    localStorage.setItem("save", JSON.stringify(save));
  }, [save]);

  const addPoem = (item: C, authorId: number) => {
    const title = item.title.replace(/・/g, "·");
    poem
      .mutateAsync({
        title,
        titlePinYin: GeneratePinyin(title).replace(/(\s+)?·/g, " ."),
        genre,
        content: item.content,
        contentPinYin: GeneratePinyin(item.content)
          .replace(/\n\s/g, "\n")
          .replace(/(\s+)?(\.|,|!|、|！|。|，|；)/g, " ."),
        authorId,
        token,
      })
      .then(() => {
        setSave([...save, item.title]);
      })
      .catch((e: Error) => {
        if (e.message.includes("已存在")) {
          setSave([...save, item.title]);
          return;
        }

        console.error("poem", e);
        alert(e);
      });
  };

  return (
    <div>
      <div className="sticky left-0 top-0 z-50 bg-background">
        <GenreSelect value={genre} onChange={setGenre} />
      </div>
      <header className="mt-8 flex h-12">
        <div className="w-20">操作</div>
        <div className="w-20">index</div>
        <div className="w-20">author</div>
        <div className="w-52">title</div>
        <div className="w-2/5">tags</div>
        <div className="flex-1">content</div>
      </header>
      <main>
        {dataSource?.map((item, i) => (
          <div className="flex h-12 border-b" key={i}>
            <div className="w-20">
              <Button variant={"outline"} size={"sm"} onClick={() => add(item)}>
                添加
              </Button>
            </div>
            <div className="w-20">{i + 1}</div>
            <div className="w-20">{item.author}</div>
            <div className="w-52">{item.title}</div>
            <div className="w-2/5">{item.tags.join(",")}</div>
            <div className="line-clamp-2 flex-1">{item.content}</div>
          </div>
        ))}
      </main>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { pinyin as GeneratePinyin } from "pinyin-pro";

type C = {
  title: string;
  content: string;
  author: string;
  dynasty: string;
  tags: string[];
};

export default function Page() {
  const searchParams = useSearchParams();
  const [dataSource, setDataSource] = useState<C[]>();
  const utils = api.useUtils();

  const author = api.author.create.useMutation();
  const poem = api.poem.create.useMutation();

  const [save, setSave] = useState<string[]>([]);

  useEffect(() => {
    setSave(JSON.parse(localStorage.getItem("save") || "[]") as string[]);
  }, []);

  useEffect(() => {
    void fetch("/content.json")
      .then((res) => res.json())
      .then((res) => {
        setDataSource(
          (res as C[]).filter((item) => !save.includes(item.title)),
        );
      });
  }, [save]);

  const { data } = api.author.findMany.useQuery({ pageSize: 999 });
  const authorNames = data?.data.map((item) => item.name) ?? [];

  const add = (item: C) => {
    if (!authorNames.includes(item.author)) {
      author
        .mutateAsync({
          name: item.author,
          dynasty: item.dynasty,
          token: searchParams.get("token") ?? "",
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
    setDataSource((dataSource) => {
      if (!dataSource) return;
      return dataSource.filter((item) => !save.includes(item.title));
    });

    localStorage.setItem("save", JSON.stringify(save));
  }, [save]);

  const addPoem = (item: C, authorId: number) => {
    poem
      .mutateAsync({
        title: item.title,
        titlePinYin: GeneratePinyin(item.title).replace(/(\s+)?·/g, " ."),
        genre: "词",
        content: item.content,
        contentPinYin: GeneratePinyin(item.content)
          .replace(/\n\s/g, "\n")
          .replace(/(\s+)?(\.|,|!|、|！|。|，|；)/g, " ."),
        authorId,
        token: searchParams.get("token") ?? "",
      })
      .then((e) => {
        setSave([...save, e.title]);
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
      <header className="flex h-12">
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

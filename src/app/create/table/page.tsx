"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { pinyin as GeneratePinyin } from "pinyin-pro";
import { GenreSelect } from "../components/GenreSelect";
import { Input } from "~/components/ui/input";
import { convertToHans } from "~/utils/convert";

type C = {
  title: string;
  content: string[];
  author: string;
  dynasty: string;
  tags: string[];
};

export default function Page() {
  const [dataSource, setDataSource] = useState<C[]>([]);
  const utils = api.useUtils();
  const [genre, setGenre] = useState("诗");
  const [dynasty, setDynasty] = useState("");

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

  const { data } = api.author.findMany.useQuery({
    pageSize: 999,
    select: ["name"],
  });
  const authorNames = data?.data.map((item) => item.name) ?? [];
  const [page, setPage] = useState(1);

  const add = (item: C) => {
    const authorNameHans = convertToHans(item.author);
    if (!authorNames.includes(authorNameHans)) {
      author
        .mutateAsync({
          name: authorNameHans,
          namePinYin: GeneratePinyin(authorNameHans),
          name_zh_Hant: item.author,
          dynasty: dynasty || item.dynasty,
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
      const authorId = data?.data.find((e) => e.name === authorNameHans)?.id;
      if (authorId) {
        addPoem(item, authorId);
      }
    }
  };

  useEffect(() => {
    void fetch("https://r2.aspoem.com/content.json")
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
    const title = item.title.replace(/\s+其/g, "·其");
    const contentHans = convertToHans(item.content.join("\n"));
    poem
      .mutateAsync({
        title: convertToHans(title),
        title_zh_hant: title,
        titlePinYin: GeneratePinyin(title).replace(/(\s+)?·/g, " ."),
        genre,
        content: convertToHans(contentHans),
        content_zh_hant: item.content.join("\n"),
        contentPinYin: GeneratePinyin(item.content.join("\n"))
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

  const pageData = dataSource.slice((page - 1) * 50, page * 50);

  const checked = () => {
    Promise.all(
      pageData.map((item) =>
        utils.poem.checkedExist.fetch({
          title: item.title,
          authorName: item.author,
        }),
      ),
    ).then((res) => {
      const _save: string[] = [];
      res.map((_, i) => {
        const item = pageData[i]!;

        if (_) {
          _save.push(item.title);
        }
      });

      setSave([...save, ..._save]);
    });
  };

  return (
    <div>
      <div className="sticky left-0 top-0 z-50 bg-background">
        <GenreSelect value={genre} onChange={setGenre} />
      </div>
      <div className="mt-4">
        <Input
          value={dynasty}
          placeholder="设置了则以该值为准，否则以数据源为准"
          onChange={(e) => setDynasty(e.target.value)}
        />
        <Button onClick={checked}>一键检测添加</Button>
      </div>
      <div className="mt-4 space-x-2">
        {new Array(Math.ceil(dataSource.length / 50)).fill(0).map((_, i) => (
          <Button
            onClick={() => setPage(i + 1)}
            variant={i + 1 === page ? "default" : "outline"}
            key={i}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <header className="mt-8 flex h-12">
        <div className="w-20">操作</div>
        <div className="w-20">index</div>
        <div className="w-20">author</div>
        <div className="w-52">title</div>
        <div className="flex-1">content</div>
      </header>
      <main>
        {pageData?.map((item, i) => (
          <div className="flex h-12 border-b" key={i}>
            <div className="w-20">
              <Button variant={"outline"} size={"sm"} onClick={() => add(item)}>
                添加
              </Button>
            </div>
            <div className="w-20">{i + 1}</div>
            <div className="w-20">{item.author}</div>
            <div className="w-52">{item.title}</div>
            <div className="line-clamp-2 flex-1">{item.content}</div>
          </div>
        ))}
      </main>
    </div>
  );
}

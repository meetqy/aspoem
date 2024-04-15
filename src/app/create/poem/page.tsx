"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { pinyin as GeneratePinyin } from "pinyin-pro";
import { GenreSelect } from "../components/GenreSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { convertToHans, convertToHant } from "~/utils/convert";
import { type Author, type Poem, type Tag } from "@prisma/client";

export default function CreatePage() {
  const utils = api.useUtils();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const id = params.get("id") ?? "";
  const [annotations, setAnnotations] = useState<
    { keyword: string; content: string; i: number }[]
  >([]);

  const { data: tags } = api.tag.findMany.useQuery({
    select: ["name"],
    pageSize: 9999,
  });

  const { data: poemT } = api.poem.findById.useQuery(
    {
      id: Number(id),
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const poem = poemT as Poem & { author: Author; tags: Tag[] };

  const [keyword, setKeyword] = useState("");

  // 作者
  const { data } = api.author.findMany.useQuery({
    select: ["name", "dynasty"],
    keyword,
  });

  const authors = data?.data;

  const mutation = {
    deletePoem: api.poem.deleteById.useMutation({
      onSuccess: async () => {
        await utils.poem.findById.invalidate({
          id: Number(id),
        });
        alert("Success");
      },
      onError: (err) => alert(err.message),
    }),
    isSame: api.poem.isSame.useMutation({
      onSuccess(data) {
        if (data) {
          alert("已存在相同的诗词");
        }
      },
    }),
    createAuthor: api.author.create.useMutation({
      onSuccess: async () => {
        await utils.author.findMany.invalidate();
      },
      onError: (err) => alert(err.message),
    }),
    createPoem: api.poem.create.useMutation({
      onSuccess: async () => {
        if (!id) {
          setTitle("");
          setContent("");
          setAuthorId(-1);
          setTagIds([]);
          setGenre("");
          setClassify("");
          setTitlePinYin("");
          setContentPinYin("");
          setIntroduce("");
          setTranslation("");
          setAnnotations([]);
        } else {
          mutation.isSame.mutate({
            title,
            authorId,
          });

          await utils.poem.findById.invalidate({
            id: Number(id),
          });
        }

        alert("Success");
      },
      onError: (err) => alert(err.message),
    }),
  };

  const [json, setJson] = useState("");
  const [title, setTitle] = useState("");
  const [titlePinYin, setTitlePinYin] = useState("");
  const [contentPinYin, setContentPinYin] = useState("");
  const [content, setContent] = useState("");
  const [classify, setClassify] = useState("");
  const [genre, setGenre] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [translation, setTranslation] = useState("");
  const [authorId, setAuthorId] = useState<number>(-1);
  const [format, setFormat] = useState<string>("");

  const [tagIds, setTagIds] = useState<number[]>([]);

  useEffect(() => {
    if (poem) {
      setTitle(poem.title);
      setTitlePinYin(poem?.titlePinYin ?? "");
      setContentPinYin(poem?.contentPinYin ?? "");
      setContent(poem.content);
      setAuthorId(poem.authorId);
      setTagIds(poem.tags.map((item) => item.id));
      setClassify(poem.classify ?? "");
      setGenre(poem.genre ?? "");
      setTranslation(poem?.translation ?? "");
      setIntroduce(poem?.introduce ?? "");

      const json = JSON.parse(poem.annotation ?? "{}") as {
        [key in string]: string;
      };

      const arr: typeof annotations = [];

      let i = 0;
      for (const key in json) {
        arr.push({
          keyword: key,
          content: json[key] || "",
          i,
        });

        i++;
      }

      setAnnotations(arr);
    }
  }, [poem]);

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(
        `?token=${localStorage.getItem("token")}${id ? "&id=" + id : ""}`,
      );
    }
  }, [id, router, token]);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <h3>
          <span className="prose-h1">{id ? "Edit" : "Add New"} Poem</span>
          <Button
            className="ml-2"
            onClick={() => {
              if (!titlePinYin) {
                setTitlePinYin(GeneratePinyin(title));
              }

              if (!contentPinYin) {
                setContentPinYin(
                  GeneratePinyin(content)
                    .replace(/\s，/g, ",")
                    .replace(/\s。/g, ".")
                    .replace(/\n\s/g, "\n"),
                );
              }
            }}
          >
            生成拼音
          </Button>
          <Button
            className="ml-2"
            onClick={() => {
              setTitle(convertToHans(title));
              setContent(convertToHans(content));
              setTranslation(convertToHans(translation));
              setIntroduce(convertToHans(introduce));
            }}
          >
            繁转简
          </Button>
        </h3>
        <p className="text-f50 text-muted-foreground">
          Fill out the details htmlFor your new poem
        </p>
      </div>
      <div className="space-y-4 p-6 text-f50">
        <div className="flex justify-between space-x-4">
          <Button
            onClick={() => {
              const obj = JSON.parse(json) as {
                annotation: string;
                content: string;
                title: string;
                translation: string;
                author: string;
              };

              setTitle(obj.title);
              setContent(obj.content.replace("\n", ""));
              setTranslation(obj.translation.replace("译文\n", ""));
              setFormat(obj.annotation.replace("注释\n", ""));
              setKeyword(obj.author);
            }}
          >
            一键填充
          </Button>
          <Input
            value={json}
            placeholder="{
              annotation: string;
              content: string;
              title: string;
              translation: string;
            }"
            onChange={(e) => setJson(e.target.value)}
          />
        </div>

        {/* 名字 */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="title"
            >
              <span className="text-red-500">*</span> 标题
            </label>
            <Input
              placeholder="输入标题"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="title"
            >
              <span className="text-red-500">*</span> 标题
              <span className="text-primary">（拼音）</span>
            </label>
            <Input
              placeholder="输入标题（拼音）"
              required
              value={titlePinYin}
              onChange={(e) => setTitlePinYin(e.target.value)}
            />
          </div>
        </div>

        {/* 作者 体裁 */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="author"
            >
              <span className="text-red-500">*</span> 作者
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
                placeholder="输入搜索作者"
              />
              <Select
                value={authorId === -1 ? undefined : authorId.toString()}
                onValueChange={(e) => {
                  setAuthorId(Number(e));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择作者" />
                </SelectTrigger>
                <SelectContent>
                  {authors?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.dynasty}·{item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <GenreSelect value={genre} onChange={setGenre} />
          </div>
        </div>

        {/* 内容 */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <span className="text-red-500">*</span> 内容
            </label>
            <Textarea
              placeholder="输入内容"
              required
              value={content}
              className="h-32"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="content"
            >
              内容
              <span className="text-primary">（拼音）</span>
            </label>
            <Textarea
              placeholder="内容"
              required
              className="h-32"
              value={contentPinYin}
              onChange={(e) => setContentPinYin(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              译文
            </label>
            <Textarea
              placeholder="白话文"
              required
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              补充介绍
            </label>
            <Textarea
              placeholder="诗词前面的介绍"
              required
              value={introduce}
              onChange={(e) => setIntroduce(e.target.value)}
            />
          </div>
        </div>

        {/* 标签 词牌名/曲牌名 */}
        <div className="space-y-2">
          <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tags
          </label>
          <div className="space-x-2">
            {tags?.data.map((item) => (
              <Button
                key={item.id}
                variant={tagIds.includes(item.id) ? "default" : "ghost"}
                onClick={() => {
                  if (tagIds.includes(item.id)) {
                    setTagIds(tagIds.filter((i) => i !== item.id));
                  } else {
                    setTagIds([...tagIds, item.id]);
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <Button
              onClick={() => {
                setAnnotations([
                  ...annotations,
                  { keyword: "", content: "", i: annotations.length },
                ]);
              }}
            >
              添加注解
            </Button>
            <Textarea
              placeholder="注解格式化"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mr-2"
            />
            <Button
              onClick={() => {
                const arrs = format.split("\n");

                const newAnnotations = [...annotations];
                arrs.forEach((item) => {
                  const arr = item.split("：");
                  if (arr.length === 2) {
                    newAnnotations.push({
                      keyword: arr[0] || "",
                      content: arr[1] || "",
                      i: newAnnotations.length,
                    });
                  }
                });

                console.log(newAnnotations);
                setAnnotations(newAnnotations);
              }}
            >
              格式化
            </Button>
          </div>
          {annotations.map((item, index) => (
            <div className="grid grid-cols-4 gap-4" key={index}>
              <div className="col-span-1 flex items-center space-x-2">
                <Button
                  variant={"outline"}
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    const newAnnotations = [...annotations];
                    newAnnotations.splice(index, 1);
                    setAnnotations(newAnnotations);
                  }}
                >
                  -
                </Button>
                <Input
                  value={item.i}
                  onChange={(e) => {
                    const newAnnotations = [...annotations];
                    newAnnotations[index]!.i = Number(e.target.value);
                    setAnnotations(newAnnotations);
                  }}
                  onBlur={() => {
                    // 按照 i 从小到大排序
                    const newAnnotations = [...annotations];
                    newAnnotations.sort((a, b) => a.i - b.i);
                    setAnnotations(newAnnotations);
                  }}
                />
                <Input
                  placeholder="关键词"
                  required
                  value={item.keyword}
                  onChange={(e) => {
                    const newAnnotations = [...annotations];
                    newAnnotations[index]!.keyword = e.target.value;
                    setAnnotations(newAnnotations);
                  }}
                />
              </div>

              <Input
                className="col-span-3"
                placeholder="解释"
                required
                value={item.content}
                onChange={(e) => {
                  const newAnnotations = [...annotations];
                  newAnnotations[index]!.content = e.target.value;
                  setAnnotations(newAnnotations);
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Button
            className="btn w-full"
            variant="destructive"
            onClick={() => {
              window.confirm("Are you sure you wish to delete this item?")
                ? mutation.deletePoem.mutate({
                    id: Number(id),
                    token,
                  })
                : null;
            }}
          >
            Delete Poem
          </Button>
          <Button
            className="w-full"
            variant={"default"}
            onClick={() => {
              if (!title || !content || authorId === -1) {
                alert("Please fill out all the fields");
                return;
              }

              const json: { [key in string]: string } = {};

              annotations.forEach((item) => {
                json[item.keyword] = item.content;
              });

              const originTagIds = poem?.tags.map((item) => item.id) ?? [];

              const annotation = JSON.stringify(json);

              mutation.createPoem.mutate({
                id: id ? Number(id) : undefined,
                token,
                title,
                title_zh_hant: convertToHant(title),
                titlePinYin: titlePinYin.replace(/(\s+)?·/g, " ."),
                contentPinYin: contentPinYin.replace(
                  /(\s+)?(\.|,|!|、|！|。|，|；|？)/g,
                  " .",
                ),
                content,
                content_zh_hant: convertToHant(content),
                authorId,
                tagIds,
                disconnectTagIds: originTagIds.filter(
                  (tag) => !tagIds.includes(tag),
                ),
                classify,
                genre,
                introduce,
                introduce_zh_hant: convertToHant(introduce),
                translation,
                translation_zh_hant: convertToHant(translation),
                annotation,
                annotation_zh_hant: convertToHant(annotation),
              });
            }}
          >
            Save Poem
          </Button>
        </div>
      </div>
    </>
  );
}

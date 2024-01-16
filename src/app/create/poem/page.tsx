"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import SearchSelect from "../components/SearchSelect";
import { pinyin as GeneratePinyin } from "pinyin-pro";

export default function CreatePage() {
  const utils = api.useUtils();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const id = params.get("id") ?? "";

  const { data: poem } = api.poem.findById.useQuery(Number(id), {
    refetchOnWindowFocus: false,
  });
  const { data } = api.author.findMany.useQuery({
    pageSize: 999,
  });

  const authors = data?.data;

  const mutation = {
    deletePoem: api.poem.deleteById.useMutation({
      onSuccess: async () => {
        await utils.poem.findById.invalidate(Number(id));
        alert("Success");
      },
      onError: (err) => alert(err.message),
    }),
    createAuthor: api.author.create.useMutation({
      onSuccess: async () => {
        await utils.author.findMany.invalidate();
      },
      onError: (err) => alert(err.message),
    }),
    createTag: api.tag.create.useMutation({
      onSuccess: async () => {
        await utils.tag.find.invalidate();
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
        }

        await utils.poem.findById.invalidate(Number(id));
        alert("Success");
      },
      onError: (err) => alert(err.message),
    }),
  };

  const [title, setTitle] = useState("");
  const [titlePinYin, setTitlePinYin] = useState("");
  const [contentPinYin, setContentPinYin] = useState("");
  const [content, setContent] = useState("");
  const [classify, setClassify] = useState("");
  const [genre, setGenre] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [translation, setTranslation] = useState("");
  const [authorId, setAuthorId] = useState<number>(-1);

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
    }
  }, [poem]);

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(
        `?token=${localStorage.getItem("token")}${id ? "&id=" + id : ""}`,
      );
    }
  }, [id, router, token]);

  const authorItem = authors?.find((item) => item.id === authorId);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {id ? "Edit" : "Add New"} Poem
          <Button
            size={"sm"}
            className="ml-2"
            onClick={() => {
              setTitlePinYin(GeneratePinyin(title));
              setContentPinYin(
                GeneratePinyin(content)
                  .replace(/\s，/g, ",")
                  .replace(/\s。/g, ".")
                  .replace(/\n\s/g, "\n"),
              );
            }}
          >
            生成拼音
          </Button>
        </h3>
        <p className="text-muted-foreground">
          Fill out the details htmlFor your new poem
        </p>
        <p></p>
      </div>
      <div className="space-y-4 p-6">
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

        <div className="space-y-2">
          <label
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="author"
          >
            <span className="text-red-500">*</span> 作者
          </label>

          {authors && (
            <SearchSelect
              onChange={(framework) => {
                setAuthorId(framework.id);
              }}
              defaultValue={{
                ...authorItem,
                value: authorItem?.name ?? "",
                name: authorItem?.name ?? "",
                id: authorItem?.id ?? -1,
              }}
              frameworks={authors.map((item) => ({
                value: item.name,
                name: item.name,
                id: item.id,
              }))}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <span className="text-red-500">*</span> 内容
          </label>
          <Textarea
            placeholder="输入内容"
            required
            value={content}
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
            value={contentPinYin}
            onChange={(e) => setContentPinYin(e.target.value)}
          />
        </div>

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

        <Button
          className="w-full"
          variant={"default"}
          onClick={() => {
            if (!title || !content || authorId === -1) {
              alert("Please fill out all the fields");
              return;
            }

            mutation.createPoem.mutate({
              id: id ? Number(id) : undefined,
              token,
              title,
              titlePinYin: titlePinYin.replace(/(\s+)?·/g, " ."),
              contentPinYin: contentPinYin.replace(/(\s+)?(\.|,|!)/g, " ."),
              content,
              authorId,
              tagIds,
              classify,
              genre,
              introduce,
              translation,
            });
          }}
        >
          Save Poem
        </Button>
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
      </div>
    </>
  );
}

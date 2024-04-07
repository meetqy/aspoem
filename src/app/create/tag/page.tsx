"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { convertToHant } from "~/utils/convert";

export default function Tag() {
  const params = useSearchParams();
  const id = params.get("id") ? Number(params.get("id")) : -1;
  const token = params.get("token") ?? "";

  const router = useRouter();
  const [name, setName] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [type, setType] = useState("");

  const { data: tag } = api.tag.findById.useQuery(id, {
    refetchOnWindowFocus: false,
  });

  const connectPoemIds = api.tag.conntentPoemIds.useMutation({
    onSuccess: () => {
      alert("Connected!");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(
        `?token=${localStorage.getItem("token")}${id ? "&id=" + id : ""}`,
      );
    }
  }, [id, router, token]);

  const create = api.tag.create.useMutation({
    onSuccess: () => {
      alert("Saved!");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const del = api.tag.deleteById.useMutation({
    onSuccess: () => {
      alert("Deleted!");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setIntroduce(tag.introduce ?? "");
      setType(tag.type ?? " ");
    }
  }, [tag]);

  const [poemIds, setPoemIds] = useState<string>("");

  return (
    <div className="text-f50">
      <div className="flex flex-col space-y-2">
        <h3 className="text-f300">标签管理</h3>
        <p className="text-muted-foreground">{id ? "编辑标签" : "创建标签"}</p>
      </div>

      <div className="space-y-4 py-6">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label htmlFor="authorName">
              <span className="text-red-500">*</span> 标签名字
            </label>
            <Input
              placeholder="标签名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="authorName">类型</label>
            <Input
              placeholder="输入类型"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label>介绍</label>
          <Textarea
            value={introduce}
            onChange={(e) => setIntroduce(e.target.value)}
            placeholder="输入介绍"
            required
            className="h-32"
          />
        </div>

        <div className="mt-8">
          <div className="flex flex-col space-y-2">
            <h3 className="text-f300">批量关联诗词</h3>
          </div>

          <div className="mt-4 grid grid-cols-3 space-x-4">
            <Input
              className="col-span-2"
              placeholder="输入诗词ID，多个ID用逗号分隔"
              value={poemIds}
              onChange={(e) => setPoemIds(e.target.value)}
            />
            <Button
              onClick={() => {
                if (poemIds && tag?.id) {
                  connectPoemIds.mutate({
                    tagId: tag.id,
                    ids: poemIds.split(",").map((id) => Number(id)),
                    token,
                  });
                }
              }}
            >
              关联输入的诗词ID
            </Button>
          </div>
        </div>

        <div className="!mt-12 flex space-x-2">
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => {
              window.confirm("Are you sure you wish to delete this item?")
                ? del.mutate(id)
                : null;
            }}
          >
            删除
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              create.mutate({
                id: id === -1 ? undefined : id,
                token,
                name,
                name_zh_Hant: convertToHant(name),
                type,
                type_zh_Hant: convertToHant(type),
                introduce,
                introduce_zh_Hant: convertToHant(introduce),
              });
            }}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

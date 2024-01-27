"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

const _type: { [key in string]: string } = {
  1: "词牌名",
  2: "曲牌名",
};

export default function Tag({
  searchParams,
}: {
  searchParams: { id?: string; token?: string };
}) {
  const id = searchParams.id ? Number(searchParams.id) : undefined;
  const router = useRouter();
  const [name, setName] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [type, setType] = useState("");
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const { data: tag } = api.tag.findById.useQuery(id!);

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

  return (
    <>
      <div className="flex flex-col space-y-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Tag Management
        </h3>
        <p className="text-muted-foreground ">
          Enter the name of the new tag you want to create.
        </p>
      </div>

      <div className="space-y-4 py-6">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="authorName"
            >
              <span className="text-red-500">*</span> 标签名字
            </label>
            <Input
              placeholder="标签名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="authorName"
            >
              类型
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">普通</SelectItem>
                {Object.keys(_type).map((i) => {
                  const item = _type[i] ?? "";

                  return (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            介绍
          </label>
          <Textarea
            value={introduce}
            onChange={(e) => setIntroduce(e.target.value)}
            placeholder="输入介绍"
            required
            className="h-32"
          />
        </div>

        <Button
          variant={"destructive"}
          className="w-full"
          onClick={() => {
            window.confirm("Are you sure you wish to delete this item?")
              ? del.mutate(id!)
              : null;
          }}
        >
          删除
        </Button>

        <Button
          className="w-full"
          onClick={() => {
            create.mutate({
              id,
              token,
              name,
              type: type === " " ? "" : type,
              introduce,
            });
          }}
        >
          保存
        </Button>
      </div>
    </>
  );
}

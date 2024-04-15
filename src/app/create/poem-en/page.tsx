"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function CreatePage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const id = params.get("id") ?? "";

  const { data: poem } = api.poem.findByIdSelected.useQuery(
    {
      id: Number(id),
      selected: ["translation_en"],
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const updateLocale = api.poem.updateLocale.useMutation({
    onSuccess(data) {
      console.log(data);
      alert("更新成功");
    },
  });

  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (poem) {
      setTranslation(poem.translation_en ?? "");
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
          <span className="prose-h1">更新诗词英语</span>
        </h3>
        <p className="text-f50 text-muted-foreground">
          Fill out the details htmlFor your new poem
        </p>
      </div>
      <div className="space-y-4 p-6 text-f50">
        {/* 名字 */}

        <div className="grid grid-cols-1 gap-x-4">
          <div className="space-y-2">
            <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              译文
            </label>
            <Textarea
              placeholder="白话文"
              required
              value={translation}
              className="h-48"
              onChange={(e) => setTranslation(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Button
            className="w-full"
            variant={"default"}
            onClick={() => {
              updateLocale.mutate({
                id: Number(id),
                translation_en: translation,
                token,
              });
            }}
          >
            更新
          </Button>
        </div>
      </div>
    </>
  );
}

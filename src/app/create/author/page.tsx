"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function AuthorPage({
  searchParams,
}: {
  searchParams: { id?: string; token?: string };
}) {
  const utils = api.useUtils();
  const id = Number(searchParams.id);
  const token = searchParams?.token ?? "";
  const router = useRouter();

  const { data } = api.author.findById.useQuery(id);
  const create = api.author.create.useMutation({
    onSuccess: async () => {
      await utils.author.findById.invalidate(id);
      localStorage.setItem("token", token);
      alert("Saved!");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const [name, setName] = useState("");
  const [namePinYin, setNamePinYin] = useState("");
  const [dynasty, setDynasty] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [birthDate, setBirthDate] = useState<number | undefined>();
  const [deathDate, setDeathDate] = useState<number | undefined>();

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDynasty(data.dynasty ?? "");
      setNamePinYin(data.namePinYin ?? "");
      setIntroduce(data.introduce ?? "");
      setBirthDate(data.birthDate ?? undefined);
      setDeathDate(data.deathDate ?? undefined);
    }
  }, [data]);

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(
        `?token=${localStorage.getItem("token")}${id ? "&id=" + id : ""}`,
      );
    }
  }, [id, router, token]);

  return (
    <div className="m-auto min-h-screen max-w-screen-md p-4">
      <div className="rounded-lg border bg-card shadow-sm" data-v0-t="card">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {id ? "Edit" : "Add New"} Author
          </h3>
          <p className="text-muted-foreground ">
            Enter the name of the new author
          </p>
        </div>
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="authorName"
            >
              <span className="text-red-500">*</span> 名字
            </label>
            <input
              className="input input-bordered w-full focus:outline-none"
              id="authorName"
              placeholder="Enter author's name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="authorName"
            >
              名字 <span className="text-primary">（拼音）</span>
            </label>
            <input
              className="input input-bordered w-full focus:outline-none"
              id="namePinYin"
              placeholder="名字（拼音）"
              required
              value={namePinYin}
              onChange={(e) => setNamePinYin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="authorName"
            >
              朝代
            </label>
            <input
              className="input input-bordered w-full focus:outline-none"
              id="Dynasty"
              placeholder="Enter Dynasty"
              required
              value={dynasty}
              onChange={(e) => setDynasty(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="content"
            >
              介绍
            </label>
            <textarea
              className="textarea textarea-bordered min-h-[200px] w-full text-base focus:outline-none"
              id="introduce"
              placeholder="输入介绍"
              required
              value={introduce}
              onChange={(e) => setIntroduce(e.target.value)}
            ></textarea>
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="birthDate"
            >
              出生年
            </label>
            <input
              className="input input-bordered w-full focus:outline-none"
              id="birthDate"
              placeholder="出生年"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="deathDate"
            >
              死亡年
            </label>
            <input
              className="input input-bordered w-full focus:outline-none"
              id="deathDate"
              placeholder="死亡年"
              required
              value={deathDate}
              onChange={(e) => setDeathDate(Number(e.target.value))}
            />
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              create.mutate({
                id,
                token,
                name,
                namePinYin,
                dynasty,
                introduce,
                birthDate,
                deathDate,
              });
            }}
          >
            Save Author
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { api } from "~/trpc/react";
import Form from "../_components/form";
import { useState } from "react";

export default function CreatePage() {
  const utils = api.useUtils();
  const savePrompt = api.prompt.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      alert(JSON.stringify(data));
    },
  });

  const { data: tags } = api.tag.find.useQuery();

  const saveTag = api.tag.create.useMutation({
    onSuccess: () => {
      setTag("");
      void utils.tag.find.invalidate();
    },
  });
  const [token, setToken] = useState("");
  const [tag, setTag] = useState("");

  return (
    <>
      <h1>
        Token:
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="token input input-bordered"
        />
      </h1>
      <main className="flex ">
        <Form
          submit={(data) => {
            savePrompt.mutate({
              ...data,
              token,
            });
          }}
          tags={tags ?? []}
        />
        <aside className="w-96">
          <div className="flex items-center space-x-2">
            <span>New Tag:</span>
            <input
              value={tag}
              className="input input-bordered"
              placeholder="split ,"
              onChange={(e) => setTag(e.target.value)}
            />
            <button
              className="btn"
              onClick={() => {
                saveTag.mutate({
                  tags: tag.split(",").map((item) => item.trim()),
                  token,
                });
              }}
            >
              save
            </button>
          </div>
        </aside>
      </main>
    </>
  );
}

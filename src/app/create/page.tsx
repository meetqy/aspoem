"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const _classify = [
  "叙事",
  "抒情",
  "送别",
  "边塞",
  "山水田园",
  "咏史",
  "咏物",
  "悼亡",
  "讽喻",
];

const _genre = [
  "诗",
  "词",
  "曲",
  "赋",
  "乐府",
  "文言文",
  "散文",
  "小说",
  "戏剧",
  "杂文",
];

export default function CreatePage() {
  const utils = api.useUtils();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const id = params.get("id") ?? "";

  const { data: poem } = api.poem.findById.useQuery(Number(id));
  const { data: authors } = api.author.find.useQuery();
  const { data: tags } = api.tag.find.useQuery();

  const mutation = {
    createAuthor: api.author.create.useMutation({
      onSuccess: async () => {
        await utils.author.find.invalidate();
        if (!id) {
          setAuthor("");
          setDynasty("");
        }
      },
      onError: (err) => alert(err.message),
    }),
    createTag: api.tag.create.useMutation({
      onSuccess: async () => {
        await utils.tag.find.invalidate();
        setTag("");
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
        }
      },
      onError: (err) => alert(err.message),
    }),
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classify, setClassify] = useState("");
  const [genre, setGenre] = useState("");
  const [authorId, setAuthorId] = useState<number>(-1);

  const [tag, setTag] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);

  const [dynasty, setDynasty] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (poem) {
      setTitle(poem.title);
      setContent(poem.content);
      setAuthorId(poem.authorId);
      setTagIds(poem.tags.map((item) => item.id));
      setClassify(poem.classify ?? "");
      setGenre(poem.genre ?? "");
      setAuthor(poem.author.name ?? "");
      setDynasty(poem.author.dynasty ?? "");
    }
  }, [poem]);

  return (
    <div className="flex h-screen space-x-4 overflow-auto">
      <div className="w-1/4 p-4">
        <div className="bg-card rounded-lg border shadow-sm" data-v0-t="card">
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
                <span className="text-red-500">*</span> Author Name
              </label>
              <input
                className="input input-bordered w-full focus:outline-none"
                id="authorName"
                placeholder="Enter author's name"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="authorName"
              >
                Dynasty
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
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                mutation.createAuthor.mutate({
                  id: poem?.authorId,
                  token,
                  name: author,
                  dynasty,
                });
              }}
            >
              Save Author
            </button>
          </div>
        </div>
      </div>

      <div className="w-2/4 p-4">
        <div className="bg-card rounded-lg border shadow-sm" data-v0-t="card">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {id ? "Edit" : "Add New"} Poem
            </h3>
            <p>Fill out the details htmlFor your new poem</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="title"
              >
                <span className="text-red-500">*</span> Title
              </label>
              <input
                className="input input-bordered w-full focus:outline-none"
                id="title"
                placeholder="Enter your title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="content"
              >
                <span className="text-red-500">*</span> Content
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[200px] w-full text-base focus:outline-none"
                id="content"
                placeholder="Enter poem's content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="author"
              >
                <span className="text-red-500">*</span> Author
              </label>
              <select
                value={authorId}
                className="select select-bordered w-full focus:outline-none"
                onChange={(e) => setAuthorId(Number(e.target.value))}
              >
                <option disabled value={-1}>
                  Select an author
                </option>
                {authors?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="tags"
              >
                Tags
              </label>
              <div className="space-x-2">
                {tags?.map((item) => (
                  <span
                    className={`badge cursor-pointer text-base ${
                      tagIds.includes(item.id) ? "badge-primary" : ""
                    }`}
                    key={item.id}
                    onClick={() => {
                      if (tagIds.includes(item.id)) {
                        setTagIds(tagIds.filter((i) => i !== item.id));
                      } else {
                        setTagIds([...tagIds, item.id]);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="tags"
              >
                Classify
              </label>
              <div className="space-x-2">
                <select
                  value={classify}
                  onChange={(e) => setClassify(e.target.value)}
                  className="select select-bordered w-full focus:outline-none"
                >
                  <option disabled value={""}>
                    Select an Classify
                  </option>
                  {_classify?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="tags"
              >
                Genre
              </label>
              <div className="space-x-2">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="select select-bordered w-full focus:outline-none"
                >
                  <option disabled value={""}>
                    Select an Genre
                  </option>
                  {_genre?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                if (!title || !content || authorId === -1) {
                  alert("Please fill out all the fields");
                  return;
                }

                mutation.createPoem.mutate({
                  id: id ? Number(id) : undefined,
                  token,
                  title,
                  content,
                  authorId,
                  tagIds,
                  classify,
                  genre,
                });
              }}
            >
              Save Poem
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/4 p-4">
        <div className="bg-card rounded-lg border shadow-sm" data-v0-t="card">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Add New Tag
            </h3>
            <p>Enter the name of the new tag</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="tagName"
              >
                Tag Name
              </label>
              <input
                className="input input-bordered w-full focus:outline-none"
                id="tagName"
                placeholder="Enter tag's name"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                mutation.createTag.mutate({
                  token,
                  names: tag.split("，"),
                });
              }}
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

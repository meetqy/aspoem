"use client";

import { useState } from "react";

interface Props {
  submit?: (data: {
    name: string;
    content: string;
    referenceName?: string;
    referenceLink?: string;
    contributedName?: string;
    contributedLink?: string;
    tags: number[];
    description?: string;
  }) => void;

  tags: { id: number; name: string }[];
}

export default function Form(props: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [contributedName, setContributedName] = useState("");
  const [contributedLink, setContributedLink] = useState("");
  const [tags, setTags] = useState<number[]>([]);
  const [description, setDescription] = useState<string>("");

  return (
    <div className="space-y-5 px-10">
      <p>
        name:
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </p>
      <p>
        description:
        <textarea
          placeholder="description"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </p>
      <p>
        content:
        <textarea
          placeholder="content"
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </p>
      <p>
        referenceName:
        <input
          className="input"
          value={referenceName}
          onChange={(e) => setReferenceName(e.target.value)}
        />
      </p>
      <p>
        referenceLink:
        <input
          className="input"
          value={referenceLink}
          onChange={(e) => setReferenceLink(e.target.value)}
        />
      </p>
      <p>
        contributedName:
        <input
          className="input"
          value={contributedName}
          onChange={(e) => setContributedName(e.target.value)}
        />
      </p>
      <p>
        contributedLink:
        <input
          className="input"
          value={contributedLink}
          onChange={(e) => setContributedLink(e.target.value)}
        />
      </p>
      <p className="space-x-2">
        {props.tags.map((tag) => (
          <span
            key={tag.id}
            className={`badge cursor-pointer ${
              tags.includes(tag.id) ? "badge-primary" : ""
            }`}
            onClick={() => {
              if (tags.includes(tag.id)) {
                setTags(tags.filter((id) => id !== tag.id));
              } else {
                setTags([...tags, tag.id]);
              }
            }}
          >
            {tag.name}
          </span>
        ))}
      </p>
      <p>
        <button
          className="btn"
          onClick={() =>
            props?.submit?.({
              name,
              content,
              referenceName,
              referenceLink,
              contributedName,
              contributedLink,
              tags,
              description,
            })
          }
        >
          submit
        </button>
      </p>
    </div>
  );
}

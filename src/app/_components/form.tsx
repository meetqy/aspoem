"use client";

import { useState } from "react";

interface Props {
  submit?: (data: {
    token: string;
    name: string;
    content: string;
    referenceName?: string;
    referenceLink?: string;
    contributedName?: string;
    contributedLink?: string;
    tags: number[];
  }) => void;

  tags: { id: number; name: string }[];
}

export default function Form(props: Props) {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [contributedName, setContributedName] = useState("");
  const [contributedLink, setContributedLink] = useState("");
  const [tags, setTags] = useState<number[]>([]);

  return (
    <div className="space-y-5 px-10">
      <p>
        token:
        <input
          placeholder="token"
          className="input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </p>
      <p>
        name:
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
              token,
              name,
              content,
              referenceName,
              referenceLink,
              contributedName,
              contributedLink,
              tags,
            })
          }
        >
          submit
        </button>
      </p>
    </div>
  );
}

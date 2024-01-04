"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { useDebounce } from "@react-hook/debounce";
import { createPortal } from "react-dom";
import "./index.css";
import Link from "next/link";

export const SearchDialog = ({ onClose }: { onClose: () => void }) => {
  const [value, setValue] = useState("");
  const [query, setQuery] = useDebounce(value, 500);

  const { data, isLoading } = api.poem.search.useQuery(query, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const List = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">搜索中...</div>
      );
    }

    if (!data?.length) {
      return (
        <div className="flex h-96 items-center justify-center text-base-content/70">
          可惜，没有结果！
        </div>
      );
    }

    return (
      <div className="h-96 overflow-y-auto">
        {data.map((item) => {
          const content =
            item.content
              .split("\n")
              .filter((item) => item.includes(value))[0] ?? "";

          return (
            <Link
              href={`/poem/${item.id}`}
              cmdk-item=""
              key={item.id}
              className="flex"
              onClick={onClose}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: item.title.replace(value, (e) => {
                    return `<span class="text-primary bg-primary/10">${e}</span>`;
                  }),
                }}
              />
              <span className="mx-1">/</span>
              <Link
                href={`/author/${item.author.id}`}
                className="text-base-content/60"
                onClick={onClose}
                dangerouslySetInnerHTML={{
                  __html: item.author.name.replace(value, (e) => {
                    return `<span class="text-primary bg-primary/10">${e}</span>`;
                  }),
                }}
              />
              {value && content && (
                <span className="line-clamp-1 flex-1">
                  <span className="mx-1">/</span>
                  <span
                    className="text-base-content/60"
                    dangerouslySetInnerHTML={{
                      __html: content.replace(value, (e) => {
                        return `<span class="text-primary bg-primary/10">${e}</span>`;
                      }),
                    }}
                  />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <input
        type="checkbox"
        id="search_modal"
        onChange={() => void 0}
        checked
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box h-[448px] max-w-screen-sm overflow-hidden p-0">
          <input
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            className="input input-bordered input-lg w-full rounded-none border-0 border-b text-xl focus:outline-none"
            placeholder="输入文本，开始搜索..."
          />

          <List />
        </div>
        <label
          className="modal-backdrop"
          htmlFor="search_modal"
          onClick={onClose}
        >
          Close
        </label>
      </div>
    </>
  );
};

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  const open = () => {
    setShowDialog(true);
    inputRef.current?.blur();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <label className="relative top-0 flex items-center" onClick={open}>
        <input
          ref={inputRef}
          className="input input-bordered w-full flex-1"
          placeholder="查找作者、诗词、名句..."
          onFocus={open}
        />
        <div className="absolute right-2 space-x-1">
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">k</kbd>
        </div>
      </label>

      {showDialog &&
        createPortal(
          <SearchDialog
            onClose={() => {
              setShowDialog(false);
            }}
          />,
          document.querySelector("#dialog")!,
        )}
    </>
  );
};

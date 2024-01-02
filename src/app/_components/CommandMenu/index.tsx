"use client";

import { Command } from "cmdk";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./index.css";
import { api } from "~/trpc/react";
import { useDebounce } from "@react-hook/debounce";

interface CommandMenuHandle {
  setOpen: (open: boolean) => void;
}

export const CommandMenu = forwardRef<CommandMenuHandle>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useDebounce(value, 500);
  const { data, isLoading } = api.poem.search.useQuery(query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      setOpen,
    }),
    [],
  );

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} className="linear">
      {/* <div cmdk-linear-badge="">
        <span className="!btn-neutral">诗词</span>
      </div> */}
      <Command.Input
        value={value}
        onValueChange={(e) => setValue(e)}
        placeholder="开始搜索..."
      />

      <Command.List>
        <Command.Empty>可惜，没有结果！</Command.Empty>
        {isLoading && <Command.Loading>Fetching words…</Command.Loading>}

        {data?.map((item) => {
          return (
            <Command.Item value={item.title + item.author.name} key={item.id}>
              <span
                dangerouslySetInnerHTML={{
                  __html: item.title.replace(value, (e) => {
                    return `<b class="bg-primary/10 text-primary">${e}</b>`;
                  }),
                }}
              />
              <span className="mx-1">/</span>
              <span
                className="text-base-content/70"
                dangerouslySetInnerHTML={{
                  __html: item.author.name.replace(value, (e) => {
                    return `<b class="bg-primary/10 text-primary">${e}</b>`;
                  }),
                }}
              />
            </Command.Item>
          );
        })}
      </Command.List>
    </Command.Dialog>
  );
});

export const CommandInputSearch = () => {
  const ref = useRef<CommandMenuHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    ref.current?.setOpen(true);
    inputRef.current?.blur();
  };

  return (
    <>
      <CommandMenu ref={ref} />
      <div className="relative top-0 flex items-center" onClick={open}>
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
      </div>
    </>
  );
};

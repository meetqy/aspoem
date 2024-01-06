"use client";

import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { api } from "~/trpc/react";
import { useDebounce } from "@react-hook/debounce";
import { Button } from "~/components/ui/button";
import { CommandLoading } from "cmdk";
import { useRouter } from "next/navigation";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useDebounce(value, 500);
  const { data, isLoading } = api.poem.search.useQuery(query, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

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

  const router = useRouter();

  return (
    <div className="font-serif">
      <p className="font-cursive text-base text-muted-foreground">
        <Button
          variant={"outline"}
          size={"sm"}
          className="relative w-64 justify-between"
          onClick={() => setOpen(true)}
        >
          <span>查找作者、诗词、名句...</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="查找作者、诗词、名句..."
          value={value}
          className="text-base"
          onValueChange={setValue}
        />
        <CommandEmpty>很遗憾，没有找到结果！</CommandEmpty>
        {isLoading && <CommandLoading />}
        <CommandList>
          <CommandGroup>
            {data?.map((item) => {
              const content =
                item.content
                  .split("\n")
                  .filter((item) => item.includes(value))[0] ?? "";
              return (
                <CommandItem
                  key={item.id}
                  value={`${item.title}${item.author.name}${content}`}
                  onSelect={() => {
                    router.push(`/poem/${item.id}`);
                    setOpen(false);
                  }}
                  className="text-base"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.title.replace(value, (e) => {
                        return `<span class="text-primary bg-primary/10">${e}</span>`;
                      }),
                    }}
                  />
                  <span className="mx-1 text-muted-foreground">/</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/author/${item.author.id}`);
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:underline"
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
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

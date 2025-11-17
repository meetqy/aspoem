"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { api } from "@/trpc/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const { data, refetch, isLoading } = api.poem.search.useQuery(
    { keyword: keyword || "中" },
    {
      enabled: true,
    },
  );

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

  // 当关键词变化时进行搜索
  useEffect(() => {
    if (keyword.trim() && open) {
      const timer = setTimeout(() => {
        refetch();
      }, 300); // 防抖 300ms

      return () => clearTimeout(timer);
    }
  }, [keyword, open, refetch]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/poems/detail/${slug}`);
  };

  return (
    <>
      <div className="flex w-full max-w-xs flex-col gap-6">
        <InputGroup
          onClick={() => {
            setOpen(true);
          }}
        >
          <InputGroupInput
            value={keyword}
            placeholder="点击开始搜索..."
            readOnly
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="搜索诗词、作者..."
          value={keyword}
          onValueChange={setKeyword}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "搜索中..." : "没有找到相关结果"}
          </CommandEmpty>

          {data && data.length > 0 && (
            <CommandGroup heading={`找到 ${data.length} 个结果`}>
              {data.map((poem) => (
                <CommandItem
                  key={poem.id}
                  onSelect={() => handleSelect(poem.slug)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{poem.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {poem.author?.name} · {poem.author?.dynasty?.name}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}

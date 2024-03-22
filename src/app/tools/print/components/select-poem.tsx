"use client";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useDebounce } from "@react-hook/debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function SelectPoem(props: {
  selected?: {
    author: {
      name: string;
      id: number;
    };
    id: number;
    title: string;
    content: string;
  };
}) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useDebounce(value, 500);
  const router = useRouter();

  const { data = [] } = api.poem.search.useQuery(query, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setQuery(value);
  }, [setQuery, value]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof data)[number] | undefined>(
    props.selected || undefined,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between overflow-hidden"
        >
          {selected ? (
            <>
              <span className="inline-block flex-1 truncate text-left">
                {selected.title}
              </span>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-end text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(undefined);
                }}
              >
                <X className="h-4 w-4" />
              </div>
            </>
          ) : (
            <>+ 选择诗词</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command className="w-full">
          <CommandInput
            placeholder="搜索标题、作者、内容"
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>没有找到诗词。</CommandEmpty>
            <CommandGroup>
              {data.map((item) => {
                const value = `${item.title} | ${item.author.name}`;

                return (
                  <CommandItem
                    key={item.id}
                    value={value}
                    onSelect={(e) => {
                      setSelected(
                        data.find(
                          (item) => `${item.title} | ${item.author.name}` === e,
                        ) || undefined,
                      );
                      setOpen(false);
                      router.push("?id=" + item.id);
                    }}
                  >
                    {item.title} | {item.author.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

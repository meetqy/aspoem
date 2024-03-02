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
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDebounce } from "@react-hook/debounce";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { CommandLoading } from "cmdk";
import { type Locale, type Dictionary } from "~/dictionaries";

export default function CommandDemo({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Locale;
}) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useDebounce(value, 500);
  const { data, isLoading } = api.poem.search.useQuery(query, {
    refetchOnWindowFocus: false,
  });

  const router = useRouter();
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="relative h-8 w-64 justify-between bg-transparent text-base"
          onClick={() => setOpen(true)}
        >
          <span>{dict.search.placeholder}...</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[488px] max-w-screen-md p-0 text-lg">
        <Command>
          <CommandInput
            placeholder={`${dict.search.placeholder}...`}
            value={value}
            className="py-8 text-lg"
            onValueChange={setValue}
          />
          <CommandList className="max-h-[488px]">
            <CommandEmpty>{dict.search.empty}</CommandEmpty>
            {isLoading && <CommandLoading />}
            <CommandGroup>
              {data?.map((item) => {
                const content =
                  item.content
                    .split("\n")
                    .filter((item) => item.includes(value))[0] ?? "";
                return (
                  <CommandItem
                    key={item.id}
                    className="p-2"
                    value={`${item.title}${item.author.name}${content}`}
                    onSelect={() => {
                      router.push(`/${lang}/poem/${item.id}`);
                      setOpen(false);
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.title.replace(value, (e) => {
                          return `<span class="text-blue-500 bg-blue-50">${e}</span>`;
                        }),
                      }}
                    />
                    <span className="mx-0.5 text-muted-foreground/50">|</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${lang}/author/${item.author.id}`);
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:underline"
                      dangerouslySetInnerHTML={{
                        __html: item.author.name.replace(value, (e) => {
                          return `<span class="text-blue-500 bg-blue-50">${e}</span>`;
                        }),
                      }}
                    />
                    {value && content && (
                      <span className="line-clamp-1 flex-1">
                        <span className="mx-0.5 text-muted-foreground/50">
                          |
                        </span>
                        <span
                          className="text-base-content/60"
                          dangerouslySetInnerHTML={{
                            __html: content.replace(value, (e) => {
                              return `<span class="text-blue-500 bg-blue-50">${e}</span>`;
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
        </Command>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { cn } from "~/utils";
import { type Locale, type Dictionary } from "~/dictionaries";
import { Content } from "./content";

type Props = {
  className?: string;
  dict: Dictionary;
  lang: Locale;
};

export function DesktopMenu({ className, dict, lang }: Props) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <Content dict={dict} lang={lang} />
    </div>
  );
}

export function MobileMenu({ className, dict, lang }: Props) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={cn("lg:hidden", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            aria-label="menu"
            className="fixed left-4 top-3 z-50"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-screen">
          <Content dict={dict} lang={lang} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

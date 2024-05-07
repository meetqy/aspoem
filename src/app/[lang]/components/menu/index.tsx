"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils";
import { type Locale, type Dictionary } from "~/dictionaries";
import { Content } from "./content";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Logo } from "~/components/logo";

type Props = {
  className?: string;
  dict: Dictionary;
  lang: Locale;
};

export function DesktopMenu({ className, dict, lang }: Props) {
  return (
    <div
      className={cn(
        "relative hidden min-h-[calc(100vh-16rem)] lg:block",
        className,
      )}
    >
      <Content dict={dict} lang={lang} />
    </div>
  );
}

export function MobileMenu({ dict, lang }: Props) {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            aria-label="menu"
            className="fixed left-4 top-3 z-50"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="overflow-y-auto border-border px-0"
        >
          <SheetHeader>
            <SheetTitle asChild>
              <Logo lang={lang} />
            </SheetTitle>
          </SheetHeader>
          <Content dict={dict} lang={lang} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

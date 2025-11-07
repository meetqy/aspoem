"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const menuItems = [
  // { href: "/", label: "推荐" },
  { href: "/poems", label: "诗文" },
  { href: "/authors", label: "诗人", disabled: true },
  // { href: "/quotes", label: "名句", disabled: true },
  // { href: "/ai-generator", label: "AI 作诗", disabled: true },
  // { href: "/games", label: "游戏", disabled: true },
];

export function Menu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("w-full", className)}>
      <NavigationMenuList className="flex-wrap">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { discover, type SidebarItem } from "./sidebar-items";

const items: SidebarItem[] = [
  // {
  //   title: "体裁",
  //   url: "#",
  //   defaultOpen: true,
  //   items: [
  //     { title: "五言绝句", url: "#" },
  //     { title: "七言绝句", url: "#" },
  //     { title: "五言律诗", url: "#" },
  //     { title: "七言律诗", url: "#" },
  //     { title: "词", url: "#" },
  //     { title: "古体诗", url: "#" },
  //     { title: "更多......", url: "#" },
  //   ],
  // },
];

// 定义朝代顺序
const dynastyOrder = [
  "夏",
  "商",
  "周",
  "秦",
  "汉",
  "三国",
  "两晋",
  "南北朝",
  "隋",
  "唐",
  "五代十国",
  "宋",
  "辽",
  "夏",
  "金",
  "元",
  "明",
  "清",
];

// 朝代名称映射（处理一些变体）
const dynastyMapping: Record<string, string> = {
  西汉: "汉",
  东汉: "汉",
  东汉末年: "汉",
  北宋: "宋",
  南宋: "宋",
  五代: "五代十国",
  先秦: "周",
  春秋: "周",
  战国: "周",
  楚: "周", // 战国时期
  西晋: "两晋",
  东晋: "两晋",
  南北: "南北朝",
  明末清初: "清",
};

function getDynastyOrder(dynastyName: string): number {
  const mappedName = dynastyMapping[dynastyName] || dynastyName;
  const index = dynastyOrder.indexOf(mappedName);
  return index === -1 ? 999 : index; // 未知朝代放到最后
}

type Props = {
  dynasty: {
    name: string;
    slug: string;
    pinyin: string;
    _count: { poems: number };
  }[];
};

export function SidebarLeft({ dynasty }: Props) {
  // 按历史顺序排序朝代
  const sortedDynasty = [...dynasty].sort((a, b) => {
    const orderA = getDynastyOrder(a.name);
    const orderB = getDynastyOrder(b.name);
    return orderA - orderB;
  });

  const dynastyItems: SidebarItem = {
    title: "朝代",
    url: "#",
    defaultOpen: true,
    items: sortedDynasty.map((d) => ({
      title: `${d.name} ${d._count.poems}`,
      url: `/poems/dynasty/${d.slug}`,
    })),
  };

  return (
    <Sidebar
      collapsible="none"
      className="bg-transparent h-[calc(100vh-4rem)] sticky top-[4rem] w-56 hidden 2xl:block"
    >
      <ScrollArea className="h-full">
        <SidebarContent className="gap-0 py-12">
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>发现</SidebarGroupLabel>
            <SidebarMenu>
              {discover.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarMenu>
            {[dynastyItems, ...items].map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.defaultOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <b>{item.title}</b>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className="w-full flex justify-between"
                            >
                              {subItem.title.split(" ").map((part, index) => (
                                <span
                                  key={index}
                                  className={cn({
                                    "text-sm text-muted-foreground":
                                      index === 1,
                                  })}
                                >
                                  {part}
                                </span>
                              ))}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

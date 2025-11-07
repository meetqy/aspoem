"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
    _count: { authors: number };
  }[];
};

export interface SidebarItem {
  title: string;
  icon?: React.ElementType;
  url: string;
  defaultOpen?: boolean;
  isActive?: boolean;
  items?: SidebarItem[];
  description?: string;
}

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
      title: `${d.name} ${d._count.authors}`,
      url: `/authors/dynasty/${d.slug}`,
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
            <SidebarGroupLabel>朝代</SidebarGroupLabel>
            <SidebarMenu>
              {dynastyItems.items!.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex justify-between w-full"
                    >
                      {item.icon && <item.icon />}
                      {item.title.split(" ").map((part, index) =>
                        index === 0 ? (
                          <span key={index}>{part}</span>
                        ) : (
                          <span key={index} className="text-muted-foreground">
                            {part}
                          </span>
                        ),
                      )}
                      {item.items && <ChevronRight className="ml-2" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

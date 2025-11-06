import {
  ArrowDownAzIcon,
  CirclePlusIcon,
  DicesIcon,
  StarIcon,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  icon?: React.ElementType;
  url: string;
  defaultOpen?: boolean;
  isActive?: boolean;
  items?: SidebarItem[];
  description?: string;
}

export const discover: SidebarItem[] = [
  {
    title: "推荐诗文",
    icon: StarIcon,
    description: "由本站编辑倾心甄选，发现与当下共鸣的诗词佳作",
    url: "/poems",
  },
  {
    title: "最近更新",
    icon: CirclePlusIcon,
    description: "查看最近更新的诗文",
    url: "/poems/latest",
  },
  {
    title: "随机诗文",
    icon: DicesIcon,
    description: "获取一首随机诗文",
    url: "#",
  },
  {
    title: "诗文排行榜",
    icon: ArrowDownAzIcon,
    description: "查看访问量最高的诗文",
    url: "#",
  },
];

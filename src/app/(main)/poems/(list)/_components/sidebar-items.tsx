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
    title: "最受欢迎的",
    icon: ArrowDownAzIcon,
    description: "访问量最高的诗文排行",
    url: "/poems/hot",
  },
  {
    title: "随机诗文",
    icon: DicesIcon,
    description: "点击按钮，可以随机一首诗文",
    url: "/poems/random",
  },
];

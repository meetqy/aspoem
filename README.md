# [AsPoem](https://aspoem.com)

开源、无登录、免费的诗词阅读网站。

## 同步 chinese-poetry 到 Prisma PG 中

```shell
pnpm sync:chinese-poetry
```



## 目录结构

```shell
my-nextjs-poem-app/
├── app/
│   ├── layout.tsx              # 全局布局 (通常包含 <html/>, <body/>, 导航, 页脚等)
│   ├── page.tsx                # 网站首页 (例如：最新诗词列表，或分类入口)
│   │
│   ├── search/                 # 搜索页面路由
│   │   └── page.tsx            # 搜索界面 (包含搜索框和结果展示)
│   │
│   ├── poems/                  # 诗歌详情页面的动态路由
│   │   └── [slug]/             # 动态参数，例如 `[朝代-作者-诗名]` (如 `tang-li-bai-jing-ye-si`)
│   │       └── page.tsx        # 单首诗歌的详情页面
│   │
│   ├── authors/                # (可选) 作者详情页面的动态路由
│   │   └── [authorSlug]/       # 例如 `[li-bai]`
│   │       └── page.tsx
│   │
│   ├── dynasties/              # (可选) 朝代详情页面的动态路由
│   │   └── [dynastySlug]/      # 例如 `[tang]`
│   │       └── page.tsx
│   │
│   └── api/                    # API 路由目录 (如果需要服务器端数据接口)
│       ├── search/             # 例如：服务端搜索 API (如果客户端搜索不够用)
│       │   └── route.ts
│       └── health/             # 简单的健康检查 API
│           └── route.ts
│
├── public/                     # 静态资源目录，直接通过 URL 访问
│   ├── search-index.json       # Lunr.js 客户端搜索索引文件 (构建时生成)
│   ├── poem-search-data.json   # 客户端搜索所需的核心诗词元数据 (构建时生成)
│   ├── images/
│   │   └── favicon.ico
│   │   └── default-author.png
│   └── fonts/
│       └── ...
│
├── components/                 # 可复用的 React UI 组件 (客户端或服务器端)
│   ├── ui/                     # 通用 UI 组件 (按钮、卡片、输入框等)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── Header.tsx              # 网站头部导航
│   ├── Footer.tsx              # 网站底部信息
│   ├── PoemCard.tsx            # 诗歌列表项的展示组件
│   ├── SearchInput.tsx         # 搜索输入框 (通常是 'use client' 组件)
│   └── Filters.tsx             # 分类和筛选组件 (通常是 'use client' 组件)
│
├── lib/                        # 工具函数和数据处理逻辑 (非 UI 相关)
│   ├── data/                   # 专门用于数据获取和处理的函数
│   │   ├── poems.ts            # 核心：负责读取 `../poems` 目录、解析 MDX、生成数据结构
│   │   ├── search.ts           # 搜索索引生成和管理逻辑
│   │   └── types.ts            # TypeScript 类型定义 (PoemType, FrontmatterType 等)
│   ├── utils/                  # 通用工具函数
│   │   ├── string.ts           # 字符串处理，如 slugify
│   │   └── date.ts
│   └── constants/              # 全局常量，如朝代列表、默认值
│       └── index.ts
│   └── hooks/                  # (可选) 自定义 React Hooks
│       └── use-search.ts
│
├── poems/                      # <--- **你的 50 万 MDX 诗词文件数据源根目录**
│   ├── tang/                   # 按【朝代】分 (例如: `tang`, `song`, `yuan`, `ming`, `qing`, `unknown`)
│   │   ├── li-bai/             # 按【作者】分 (例如: `li-bai`, `du-fu`, `bai-ju-yi`)
│   │   │   ├── jing-ye-si.mdx  # 具体诗词文件 (文件名使用 kebab-case，数字后缀用 `-` 连接)
│   │   │   ├── song-you-ren.mdx
│   │   │   ├── song-you-ren-2.mdx # 同名诗歌的第二版本
│   │   │   └── (一个作者的所有诗歌)
│   │   ├── du-fu/
│   │   │   └── chun-wang.mdx
│   │   └── (其他唐代作者目录)
│   │       └── (如果作者目录文件仍过多，可再加一层子目录，如按作者姓氏拼音首字母 `a-z`)
│   │           ├── a/
│   │           │   ├── a-author-poem.mdx
│   │           │   └── ...
│   │           └── z/
│   │               └── ...
│   │
│   ├── song/
│   │   ├── su-shi/
│   │   │   ├── shui-diao-ge-tou.mdx
│   │   │   └── ...
│   │   └── (其他宋代作者目录)
│   │       └── ...
│   │
│   ├── (其他朝代目录，如 `yuan/`, `ming/`, `qing/`)
│   │   └── ...
│   │
│   └── unknown-dynasty/        # 用于无法归类朝代的诗词
│       └── unknown-author/
│           └── ...
│
├── styles/                     # 全局样式文件
│   ├── globals.css             # Tailwind CSS 或其他基础样式
│   └── variables.css           # CSS 变量
│
├── .env.local                  # 环境变量 (如 API 密钥)
├── next.config.js              # Next.js 配置文件
├── package.json
├── pnpm-lock.yaml / yarn.lock / package-lock.json
└── tsconfig.json               # TypeScript 配置文件
```

## Poem MDX 文件示例

```txt
---
id: li-bai-jing-ye-si               # [必需] 唯一 ID，建议格式：作者slug-诗名slug[-版本号]。用于内部数据管理。
title: 静夜思                        # [必需] 诗歌标题 (中文原文)。
author: 李白                         # [必需] 作者 (中文原文)。
dynasty: 唐                          # [必需] 朝代 (中文原文)。
authorSlug: li-bai                   # [必需] 作者的 slug (用于 URL 或内部索引)。
dynastySlug: tang                    # [必需] 朝代的 slug (用于 URL 或内部索引)。
tags: ["思乡", "月亮", "五言绝句"]      # [可选] 关键词标签，对于搜索和分类非常有价值，建议保留。
---

# 诗歌正文

床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。


## 注释

*   **床前**：指窗前、榻前。
*   **明月光**：皎洁的月光。


## 译文

皎洁的月光洒落在床前，
我怀疑那不是月光，而是地上铺了一层白霜。

## 赏析

《静夜思》是唐代诗人李白所作的一首五言绝句。此诗描绘了作者在宁静的夜晚，看到窗前明月，进而引发对故乡深切思念的情景。
```
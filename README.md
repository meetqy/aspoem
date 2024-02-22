![](https://private-user-images.githubusercontent.com/18411315/306834495-3fef2ad5-b227-488c-950d-7dc29347e505.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDg1Njk4NjMsIm5iZiI6MTcwODU2OTU2MywicGF0aCI6Ii8xODQxMTMxNS8zMDY4MzQ0OTUtM2ZlZjJhZDUtYjIyNy00ODhjLTk1MGQtN2RjMjkzNDdlNTA1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjIyVDAyMzkyM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThhNWZiMDU2NWVmZDM1OTM0YWYwNWZlYWFlMGRmYmViZGZiOWQxODMwNGZjYzY3ODBmOTFiMzE1MDY3NGZlMDgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.IPk3q5JZp8ClxFe6JaAYVZWGaztXY2jlJ8DR7UyD0So)

# asopem.com

现代化中国诗词学习网站

## 技术栈

- prisma
- nextjs
- tailwindcss
- shadcn/ui
- postgres + supabase
- twikoo

## 本地部署

参考 `.env.example` 配置。

## 规范

### 标题

1. 删除标题中的量词，其一，一等，用正文中的第一句代替。

```
行路难其一 => 行路难·大道如青天
```

2. 删除标题中的描述，杂曲歌辞 等描述说明，只保留标题

3. 如果只有词牌名，用 “词牌名·第一句”

### 内容

1. 诗：采用居中对齐方式
2. 词：采用左对齐，开头缩进2个字符

### 样式

| 中文 | font-cursive |
| ---- | ------------ |
| 英文 | font-serif   |
| 数字 | font-mono    |

### 注解

1. 每个注解不超过3个字
2. 长的词语和短的词语同时产生，有交集，取 **短的**
3. 不要对一整句话进行注解

**第一种**

❎ 错误示例

```
劳形：使身体劳累（“使”动用法）。
劳：形容词的使动用法，使……劳累。
形：形体、身体。
```

✅ 正确示例

```
劳：形容词的使动用法，使……劳累。
形：形体、身体。
```

**第二种**

❎ 错误示例

```
斯是陋室：这是简陋的屋子。
斯：指示代词，此，这。
是：表肯定的判断动词。
陋室：简
```

✅ 正确示例

```
斯：指示代词，此，这。
是：表肯定的判断动词。
陋室：简
```

## 协议

AGPL 3.0

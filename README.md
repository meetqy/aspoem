![Imgur](https://i.imgur.com/WzbeuNH.png)

## 移动端

|![310017729-c5728ebe-2977-4471-b0e1-92cd872874ee](https://github.com/meetqy/aspoem/assets/18411315/1748c1bf-b4e9-4e69-94d7-9a83fd997804)|![310017294-502bd505-e10e-4e4c-86d8-e93f91ab7201](https://github.com/meetqy/aspoem/assets/18411315/2515bd07-7b9a-46e0-b87b-d28aa5319281)|
|-|-|


# aspoem.com

现代化中国诗词学习网站，一个更加注重 **UI和阅读体验**的诗词网站。

## 基础技术栈

- prisma
- nextjs
- trpc
- tailwindcss
- shadcn/ui
- postgres + supabase
- twikoo

## 参与贡献

[贡献指南](./CONTRIBUTING.md)

## 本地部署

复制一份 `.env.example` 并将其重命名为 `.env`

``` env
# 后台操作需要的 Token  http://localhost:3000/create?token=v0
TOKEN="v0"

# 本地
POSTGRES_PRISMA_URL="postgresql://meetqy@localhost:5432/aspoem"
POSTGRES_URL_NON_POOLING="postgresql://meetqy@localhost:5432/aspoem"

# 统计相关 没有可不填 不会加载对应的代码
# google analytics id
NEXT_PUBLIC_GA_ID="G-PYEC5EG749"

# microsoft-clarity-id 
NEXT_PUBLIC_MC_ID="ksel7bmi48"
```

## 许可证

对于个人用户，许可证持有者授予其使用本开源项目的权利，遵守 [GNU Affero General Public License（AGPL）3.0](./LICENSE) 版本的条款和条件。

### 商业许可证

对于用户进行盈利或商业用途的情况，用户必须购买商业许可证，以获得相应的商业使用权。

请联系: meetqy@icloud.com
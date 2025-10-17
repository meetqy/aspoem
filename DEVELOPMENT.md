# 本地运行

- [已安装 `POSTGRES`](#已安装-postgres)
- [未安装 `POSTGRES`](#未安装-postgres)

## 已安装 `POSTGRES`

复制一份 `.env.example` 并将其重命名为 `.env`

```env
# 后台操作需要的 Token，  http://localhost:3000/create?token=v0
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

安装依赖并启动，推荐使用 `pnpm`

```sh
pnpm i
pnpm dev
```

用浏览器打开 http://localhost:3000

## 未安装 `POSTGRES`

1. 修改 `.env`

```env
POSTGRES_PRISMA_URL="postgresql://meetqy@localhost:5432/aspoem"

POSTGRES_URL_NON_POOLING="postgresql://meetqy@localhost:5432/aspoem"
```

改为

```env
POSTGRES_PRISMA_URL="file:./db.sqlite"

POSTGRES_URL_NON_POOLING="file:./db.sqlite"
```

2. `prisma/schema.prisma` 中的

```js
datasource db {
    provider  = "postgresql"
    url       = env("POSTGRES_PRISMA_URL")
    directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

改为

```js
datasource db {
    provider  = "sqlite"
    url       = env("POSTGRES_PRISMA_URL")
    directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

3. 将 `prisma/sample.sqlite` 改为 `db.sqlite`

安装依赖并启动，推荐使用 `pnpm`

```sh
pnpm i
pnpm db:push
pnpm dev
```

### Docker部署
本项目包含了 `Dockerfile` 和 `docker-compose.yml` 文件。
`Dockfile` 用于构建 `aspoem` 服务image，`docker-compose.yml` 用于启动 `aspoem` 和一个 `PostgresSQl`。

快速启动项目，执行以下命令：
```sh
docker compose up -d;
```

用浏览器打开 http://localhost:3000/create/poem?token=secret 。

添加了诗词信息后，再访问首页 http://localhost:3000 就可以看到正常的页面了。



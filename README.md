# StyleMuse AI

中文 AI 时尚搭配社区 MVP。用户可以上传照片、填写基础信息，获得 AI 造型分析和三套搭配建议；也可以浏览社区搭配帖、查看排行榜，并在配置 Supabase 后启用邮箱验证码登录、存储和数据库能力。

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth / Postgres / Storage
- Vitest

## 本地启动

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## Supabase 配置

1. 复制环境变量模板：

```bash
copy .env.example .env.local
```

2. 在 `.env.local` 填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

3. 在 Supabase SQL Editor 执行 `supabase/schema.sql`。

4. 在 Supabase Storage 创建两个 bucket：

- `private-uploads`：原始照片，私密。
- `public-outfits`：公开搭配方案图。

5. 在 Supabase Auth 的 URL 配置里加入本地回调地址：

```text
http://localhost:3000/auth/callback
```

部署到 Vercel 后，再加入线上地址：

```text
https://你的域名/auth/callback
```

当前 MVP 在未配置 Supabase 时也能使用示例数据预览完整体验。

## 常用命令

```bash
npm test
npm run lint
npm run build
```

## 第一版范围

- 首页、搭配工作室、社区广场、帖子详情、排行榜、个人页、登录页。
- AI 推荐接口 `/api/analyze` 当前使用本地结构化推荐逻辑，后续可替换成真实模型调用。
- 照片上传接口 `/api/uploads` 会在登录后把原图保存到 `private-uploads`，并写入 `uploads` 表。
- 排行榜接口 `/api/rankings` 支持日、周、月，以及 AI 分、用户均分、评论热度排序。
- 原始照片默认私密；公开社区展示搭配方案图和用户文案。

## 部署

推荐使用 Vercel + Supabase：

1. 将项目推送到 GitHub。
2. 在 Vercel 导入仓库。
3. 配置 `.env.local` 中同名环境变量。
4. Supabase 执行 schema 并配置 Auth 邮箱模板。
5. Vercel 自动构建发布。

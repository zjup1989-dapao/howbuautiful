# Vercel + Supabase 部署清单

这份清单用于把 StyleMuse AI 从本地项目部署到线上。

## 1. GitHub

项目已经推送到：

```text
https://github.com/zjup1989-dapao/howbuautiful
```

后续每次本地修改完成后，执行：

```bash
git add -A
git commit -m "你的提交说明"
git push
```

Vercel 会自动重新部署。

## 2. Vercel 导入项目

1. 打开 https://vercel.com/new
2. 选择 `zjup1989-dapao/howbuautiful`
3. Framework Preset 选择 `Next.js`
4. Build Command 保持 `npm run build`
5. Output Directory 留空
6. 先不要点 Deploy，先配置环境变量

## 3. Vercel 环境变量

在 Vercel 项目设置的 Environment Variables 中添加：

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase Project URL，可以公开。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase anon/public key，可以公开。
- `SUPABASE_SERVICE_ROLE_KEY`：服务端专用，不能暴露到浏览器，也不能提交到 GitHub。
- `OPENAI_API_KEY`：当前 MVP 还没有强依赖真实 OpenAI 调用，但先预留。

Environment 建议同时勾选：

- Production
- Preview
- Development

## 4. Supabase Auth 回调地址

部署完成后，Vercel 会给一个线上域名，类似：

```text
https://howbuautiful.vercel.app
```

到 Supabase Dashboard：

1. 打开 Authentication
2. 打开 URL Configuration
3. Site URL 填线上域名
4. Redirect URLs 添加：

```text
https://你的-vercel-域名/auth/callback
http://localhost:3000/auth/callback
```

本地地址保留，方便继续开发。

## 5. Supabase Database 和 Storage

确认已经完成：

- SQL Editor 执行过 `supabase/schema.sql`
- Storage 已创建 `private-uploads`
- Storage 已创建 `public-outfits`
- Row Level Security 已启用

## 6. 部署后验证

上线后按顺序检查：

1. 打开 `https://你的-vercel-域名/api/health`，确认：

```json
{
  "app": "ok",
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "supabaseServiceRoleKey": true
  },
  "supabase": {
    "configured": true,
    "databaseReachable": true
  }
}
```

`openAiKey` 在当前 MVP 里可以暂时是 `false`，因为真实 AI 模型调用还没有作为硬依赖接入。

2. 首页能打开。
3. 社区广场和排行榜能看到示例或真实帖子。
4. 邮箱登录链接能跳回线上 `/profile`。
5. 登录后能在搭配工作室上传照片。
6. 保存方案后能发布帖子。
7. 社区广场能看到刚发布的帖子。
8. 帖子详情能评论和评分。

如果邮箱登录仍然提示过期，通常是用了旧邮件链接；重新发送一次，只点最新邮件里的链接。

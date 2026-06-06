import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleMuse AI | AI 时尚搭配社区",
  description: "上传照片，获得 AI 造型分析、搭配推荐与时尚社区反馈。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-zinc-50 text-black">{children}</body>
    </html>
  );
}

import Link from "next/link";
import { LogOut, Sparkles, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase-server";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/studio", label: "搭配工作室" },
  { href: "/community", label: "社区广场" },
  { href: "/ranking", label: "排行榜" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const displayName = user?.email?.split("@")[0] ?? "我的档案";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="grid size-8 place-items-center rounded-full bg-black text-white">
            <Sparkles size={16} />
          </span>
          StyleMuse AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-zinc-700 transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-sm font-bold text-black transition hover:border-black sm:inline-flex"
            >
              <UserRound size={16} />
              {displayName}
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                <LogOut size={16} />
                退出
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-bold text-white transition hover:bg-zinc-800"
          >
            <UserRound size={16} />
            登录
          </Link>
        )}
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  );
}

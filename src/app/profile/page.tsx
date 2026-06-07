import Link from "next/link";
import type { ReactNode } from "react";
import { Camera, ExternalLink, FileImage, Lock, Shirt, Sparkles, UserRound } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { getProfileArchive } from "@/lib/profile-data";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const archive = user ? await getProfileArchive(user.id) : { uploads: [], plans: [], posts: [] };
  const emailName = user?.email?.split("@")[0] ?? "访客";

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg bg-black p-6 text-white">
            <div className="grid size-20 place-items-center rounded-full bg-white text-black">
              <UserRound size={32} />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-amber-300">Profile</p>
            <h1 className="mt-2 text-4xl font-black">{user ? emailName : "我的造型档案"}</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {user
                ? `已登录：${user.email}。这里集中展示你的照片、搭配方案和社区帖子。`
                : "登录后可以查看自己的上传记录、搭配草稿和已发布帖子。"}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <ProfileStat label="照片" value={archive.uploads.length} />
              <ProfileStat label="方案" value={archive.plans.length} />
              <ProfileStat label="帖子" value={archive.posts.length} />
            </div>
            {user ? (
              <Link href="/studio" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black">
                <Sparkles size={16} />
                继续搭配
              </Link>
            ) : (
              <Link href="/login" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black">
                <Lock size={16} />
                登录查看
              </Link>
            )}
          </aside>

          <div className="space-y-6">
            {user ? (
              <>
                <ArchiveSection
                  title="我的发布"
                  eyebrow="Community"
                  count={archive.posts.length}
                  emptyTitle="还没有发布搭配帖"
                  emptyCopy="在搭配工作室保存一套方案后发布，帖子会出现在这里，也会进入社区和排行榜。"
                  actionHref="/studio"
                  actionLabel="去发布"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {archive.posts.map((post) => (
                      <Link key={post.id} href={`/community/${post.id}`} className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:border-black">
                        <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
                          <img src={post.image} alt={post.title} className="size-full object-cover transition duration-300 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-2 text-lg font-black">{post.title}</h3>
                          <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-black text-zinc-500">
                            <span>AI {post.aiScore}</span>
                            <span>评分 {post.averageUserScore.toFixed(1)}</span>
                            <span>评论 {post.commentCount}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ArchiveSection>

                <ArchiveSection
                  title="搭配方案"
                  eyebrow="Plans"
                  count={archive.plans.length}
                  emptyTitle="还没有保存方案"
                  emptyCopy="生成 AI 推荐后点击保存方案，之后就能在个人页继续追踪和发布。"
                  actionHref="/studio"
                  actionLabel="去保存"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {archive.plans.map((plan) => (
                      <Link key={plan.id} href={`/profile/plans/${plan.id}`} className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition hover:border-black">
                        <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-zinc-100">
                          {plan.previewImage ? (
                            <img src={plan.previewImage} alt={plan.title} className="size-full object-cover" />
                          ) : (
                            <Shirt className="text-zinc-400" size={32} />
                          )}
                        </div>
                        <h3 className="mt-4 text-lg font-black">{plan.title}</h3>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">AI Score</span>
                          <span className="text-3xl font-black">{plan.aiScore}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ArchiveSection>

                <ArchiveSection
                  title="上传记录"
                  eyebrow="Uploads"
                  count={archive.uploads.length}
                  emptyTitle="还没有上传照片"
                  emptyCopy="上传原始照片后会进入私密库，默认只有你自己能看到记录。"
                  actionHref="/studio"
                  actionLabel="去上传"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    {archive.uploads.map((upload) => (
                      <article key={upload.id} className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-md bg-zinc-100">
                            <FileImage size={20} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black">{upload.fileName}</h3>
                            <p className="mt-1 truncate text-xs font-semibold text-zinc-500">{upload.storagePath}</p>
                            <p className="mt-2 text-xs text-zinc-400">{formatDate(upload.createdAt)}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </ArchiveSection>
              </>
            ) : (
              <div className="rounded-lg border border-black/10 bg-white p-8 shadow-sm">
                <Lock className="text-amber-500" />
                <h2 className="mt-4 text-3xl font-black">登录后查看真实档案</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
                  未登录时可以浏览社区和排行榜。登录后，个人页会展示你的上传记录、保存方案和已发布帖子。
                </p>
                <Link href="/login" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white">
                  前往登录
                  <ExternalLink size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/15 p-3">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-zinc-400">{label}</p>
    </div>
  );
}

function ArchiveSection({
  title,
  eyebrow,
  count,
  emptyTitle,
  emptyCopy,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  eyebrow: string;
  count: number;
  emptyTitle: string;
  emptyCopy: string;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-zinc-50 p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
        </div>
        <Link href={actionHref} className="inline-flex h-9 items-center rounded-full border border-black/15 px-4 text-xs font-black transition hover:border-black">
          {actionLabel}
        </Link>
      </div>
      {count > 0 ? (
        children
      ) : (
        <div className="rounded-lg border border-dashed border-black/15 bg-white p-6">
          <Camera className="text-zinc-400" />
          <h3 className="mt-3 text-lg font-black">{emptyTitle}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">{emptyCopy}</p>
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

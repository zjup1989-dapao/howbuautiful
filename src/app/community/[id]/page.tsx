import { notFound } from "next/navigation";
import { PageShell } from "@/components/site-shell";
import { PostInteractions } from "@/components/post-interactions";
import { PostOwnerActions } from "@/components/post-owner-actions";
import { getPostComments } from "@/lib/comments-data";
import { getCommunityPost } from "@/lib/posts-data";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) notFound();

  const [comments, user] = await Promise.all([getPostComments(id), getCurrentUser()]);
  const isOwner = Boolean(user && post.authorId === user.id);

  return (
    <PageShell>
      <article className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_0.7fr] lg:px-8">
        <div className="overflow-hidden rounded-lg bg-zinc-100">
          <img src={post.image} alt={post.title} className="max-h-[780px] w-full object-cover" />
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">{post.author}</p>
            <h1 className="mt-3 text-5xl font-black leading-none">{post.title}</h1>
            <p className="mt-4 text-lg leading-8 text-zinc-700">{post.caption}</p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-black text-white">
            <Stat label="AI评分" value={String(post.aiScore)} />
            <Stat label="用户评分" value={post.averageUserScore.toFixed(1)} />
            <Stat label="评论" value={String(post.commentCount)} />
          </div>
          {isOwner ? <PostOwnerActions postId={post.id} title={post.title} caption={post.caption} /> : null}
          <PostInteractions
            postId={post.id}
            initialComments={comments}
            initialAuthStatus={{
              configured: true,
              authenticated: Boolean(user),
              email: user?.email ?? null,
            }}
          />
        </div>
      </article>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black p-4">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{label}</p>
    </div>
  );
}

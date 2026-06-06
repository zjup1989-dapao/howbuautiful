import Link from "next/link";
import { MessageCircle, Star } from "lucide-react";
import type { CommunityPost } from "@/lib/types";

export function PostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <Link href={`/community/${post.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
          <img src={post.image} alt={post.title} className="size-full object-cover transition duration-500 hover:scale-105" />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black leading-tight">{post.title}</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{post.author}</p>
          </div>
          <span className="rounded-full bg-black px-3 py-1 text-sm font-black text-white">{post.aiScore}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-zinc-600">{post.caption}</p>
        <div className="flex items-center justify-between text-sm font-bold text-zinc-600">
          <span className="inline-flex items-center gap-1">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            {post.averageUserScore.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={15} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </article>
  );
}

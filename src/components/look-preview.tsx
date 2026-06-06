import { getAsset } from "@/lib/assets";
import type { OutfitCandidate } from "@/lib/types";

export function LookPreview({ candidate }: { candidate: OutfitCandidate }) {
  const assets = Object.values(candidate.assets).map((id) => getAsset(id)).filter(Boolean);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-lg border border-black/10 bg-black text-white">
      <div className="grid min-w-0 gap-px bg-white/15 sm:grid-cols-3">
        {assets.slice(0, 6).map((asset) => (
          <div key={asset!.id} className="relative aspect-[4/5] bg-zinc-900">
            <img src={asset!.image} alt={asset!.name} className="size-full object-cover opacity-90" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-xs font-bold">{asset!.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">AI Score</p>
            <h2 className="text-2xl font-black">{candidate.title}</h2>
          </div>
          <span className="text-5xl font-black">{candidate.score}</span>
        </div>
        <p className="text-sm leading-6 text-zinc-200">{candidate.reason}</p>
        <div className="flex flex-wrap gap-2">
          {candidate.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

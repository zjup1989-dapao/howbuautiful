import { Check } from "lucide-react";
import type { StyleAsset } from "@/lib/types";

export function AssetCard({
  asset,
  selected,
  onSelect,
}: {
  asset: StyleAsset;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(asset.id)}
      className="group min-w-44 overflow-hidden rounded-lg border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <img src={asset.image} alt={asset.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        {selected ? (
          <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black text-white">
            <Check size={16} />
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black leading-tight">{asset.name}</h3>
          <span className="size-4 rounded-full border border-black/20" style={{ backgroundColor: asset.color }} />
        </div>
        <p className="text-xs font-semibold text-zinc-500">{asset.tags.slice(0, 2).join(" / ")}</p>
      </div>
    </button>
  );
}

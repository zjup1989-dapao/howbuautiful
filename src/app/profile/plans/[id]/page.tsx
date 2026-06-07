import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import { LookPreview } from "@/components/look-preview";
import { PlanPublishPanel } from "@/components/plan-publish-panel";
import { PageShell } from "@/components/site-shell";
import { getAsset } from "@/lib/assets";
import { getProfilePlanDetail } from "@/lib/profile-data";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function ProfilePlanPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const plan = await getProfilePlanDetail(user.id, id);
  if (!plan) notFound();

  const selectedAssets = Object.values(plan.selectedAssetIds).map((assetId) => getAsset(assetId)).filter(Boolean);
  const publishImage = plan.previewImage || selectedAssets[0]?.image || "";

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/profile" className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-black transition hover:border-black">
          <ArrowLeft size={16} />
          返回个人页
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <LookPreview candidate={plan.previewCandidate} />

            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Selected</p>
              <h1 className="mt-1 text-3xl font-black">{plan.title}</h1>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedAssets.map((asset) => (
                  <article key={asset!.id} className="overflow-hidden rounded-lg border border-black/10 bg-zinc-50">
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                      <img src={asset!.image} alt={asset!.name} className="size-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h2 className="text-sm font-black">{asset!.name}</h2>
                      <p className="mt-1 text-xs font-semibold text-zinc-500">{asset!.tags.slice(0, 2).join(" / ")}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <AnalysisBlock title="样貌优势" items={plan.recommendation?.strengths ?? []} />
              <AnalysisBlock title="可优化点" items={plan.recommendation?.improvements ?? []} />
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg bg-black p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Draft</p>
              <h2 className="mt-2 text-3xl font-black">{plan.aiScore}</h2>
              <p className="mt-2 text-sm font-semibold text-zinc-300">AI 方案评分</p>
              <div className="mt-5 space-y-3">
                <TuningStat label="色彩饱和度" value={plan.tuning.saturation} />
                <TuningStat label="正式度" value={plan.tuning.formality} />
                <TuningStat label="版型" value={plan.tuning.silhouette} />
              </div>
            </section>
            <PlanPublishPanel
              planId={plan.id}
              title={plan.title}
              aiScore={plan.aiScore}
              imageUrl={publishImage}
              tags={plan.previewCandidate.tags}
            />
          </aside>
        </section>
      </main>
    </PageShell>
  );
}

function TuningStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-white/15 p-3">
      <p className="flex items-center gap-2 text-xs font-bold text-zinc-400">
        <SlidersHorizontal size={14} />
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function AnalysisBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-xl font-black">
        <Sparkles size={18} className="text-amber-500" />
        {title}
      </h3>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-500">这个早期方案暂时没有保存完整分析文本。</p>
      )}
    </div>
  );
}

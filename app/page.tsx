import { ForecastChart } from "@/components/forecast-chart";
import { AssetSimulator } from "@/components/asset-simulator";
import { ArrowUpRightIcon, ClockIcon, GlobeIcon, InfoIcon } from "@/components/icons";
import { getForecastData } from "@/lib/forecast";

const yen = new Intl.NumberFormat("ja-JP");

export default async function Home() {
  const data = await getForecastData();
  const isUp = data.changeAmount >= 0;

  return (
    <main className="voxel-world min-h-screen overflow-hidden text-[#18302b]">
      <div className="voxel-sky" aria-hidden="true">
        <span className="voxel-sun" /><span className="voxel-cloud voxel-cloud-one" /><span className="voxel-cloud voxel-cloud-two" />
        <span className="voxel-mountain voxel-mountain-one" /><span className="voxel-mountain voxel-mountain-two" />
        <span className="voxel-tree voxel-tree-one" /><span className="voxel-tree voxel-tree-two" /><span className="voxel-tree voxel-tree-three" />
      </div>
      <div className="voxel-ground" aria-hidden="true" />

      <header className="voxel-header relative border-b-4 border-[#315f46] bg-[#f8faf8]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="voxel-logo grid h-10 w-10 place-items-center bg-[#173f35] text-[#d9f4e8]"><GlobeIcon className="h-5 w-5" /></div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-[#173f35]">オルカン予報</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#75857f]">WORLD 01 · ALL COUNTRY</p>
            </div>
          </div>
          <span className={`block-badge border-2 px-3 py-1.5 text-xs font-black ${data.isLive ? "border-[#174d31] bg-[#75bd59] text-[#102c1d]" : "border-amber-700 bg-amber-300 text-amber-900"}`}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${data.isLive ? "bg-emerald-500" : "bg-amber-500"}`} />
            {data.isLive ? "LIVE DATA" : "データ取得確認中"}
          </span>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12 lg:px-10 lg:pb-16">
        <section className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-[#14815d]"><span className="h-px w-6 bg-[#14815d]" />TODAY&apos;S OUTLOOK</p>
            <h1 className="max-w-2xl text-xl font-bold leading-snug text-[#18302b] sm:text-2xl">{data.fundName}</h1>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1.5 text-xs text-[#6d7d78]"><ClockIcon className="h-4 w-4" />最終更新 {data.updatedAt}</p>
            <p className={`mt-1 text-[10px] font-medium ${data.isLive ? "text-emerald-600" : "text-amber-700"}`}>{data.statusMessage}</p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="voxel-hero grass-block relative overflow-hidden bg-[#65452f] p-6 text-white sm:p-9">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[44px] border-white/[0.035]" />
            <div className="absolute bottom-0 right-0 h-32 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1.5px)] [background-size:12px_12px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#b9d6cd]">今日の予測基準価額</p>
                  <p className="mt-1 text-xs text-[#7fa99b]">1万口あたり</p>
                </div>
                <span className="block-chip bg-black/20 px-3 py-1 text-[11px] font-bold text-[#e8f7e0]">{data.forecastDate} 予測</span>
              </div>
              <div className="mt-7 flex items-end gap-2 sm:mt-9">
                <span className="font-display text-[58px] font-semibold leading-none tracking-[-0.045em] sm:text-[78px]">{yen.format(data.forecastValue)}</span>
                <span className="pb-1.5 text-lg font-medium text-[#c5ddd5] sm:pb-2">円</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                <span className={`block-chip inline-flex items-center gap-1 px-3 py-1.5 text-sm font-black ${isUp ? "bg-[#9dda72] text-[#173d23]" : "bg-rose-200 text-rose-800"}`}><ArrowUpRightIcon className={`h-4 w-4 ${isUp ? "" : "rotate-90"}`} />{isUp ? "+" : ""}{yen.format(data.changeAmount)}円</span>
                <span className="font-display text-xl font-semibold text-[#ecf7f3]">{isUp ? "+" : ""}{data.changeRate.toFixed(2)}%</span>
                <span className="text-xs text-[#8fb4a8]">前回比</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <MetricCard label="前回の基準価額" value={`${yen.format(data.previousValue)}円`} note={`${data.previousDate} 公式公表値`} />
            <MetricCard label="ドル円" value={`${data.usdJpy.toFixed(2)}円`} note={`直近比 ${data.usdJpyChange >= 0 ? "+" : ""}${data.usdJpyChange.toFixed(2)}円`} accent />
          </div>
        </section>

        <AssetSimulator changeRate={data.changeRate} />

        <section className="voxel-panel mt-6 border-2 border-[#b8cbbb] bg-white/90 p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-[#14815d]">PRICE TREND</p>
              <h2 className="mt-1 text-xl font-bold text-[#203b34]">基準価額の推移</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#71807b]">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#13875f]" />公表値</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#f4aa42] ring-2 ring-amber-100" />今日の予測</span>
            </div>
          </div>
          <div className="mt-4"><ForecastChart data={data.points} /></div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <ModelCard label="世界株の変動" value={`${data.marketReturn >= 0 ? "+" : ""}${data.marketReturn.toFixed(2)}%`} detail="ACWI ETF・直近取引比" />
          <ModelCard label="為替の変動" value={`${data.fxReturn >= 0 ? "+" : ""}${data.fxReturn.toFixed(2)}%`} detail="USD/JPY・直近比" />
          <ModelCard label="予測モデル" value="株価 × 為替" detail="円換算の概算リターン" />
        </section>

        <aside className="voxel-note mt-6 flex gap-3 border-2 border-[#9fb9a7] bg-[#f5f1db]/95 p-4 text-sm leading-relaxed text-[#536a62]">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2f8b69]" />
          <p><strong className="font-bold text-[#254c40]">実データを使った参考予測です。</strong> 基準価額は三菱UFJアセットマネジメント、世界株と為替はYahoo Financeの公開市場データを参照しています。予測値はACWI ETFとドル円を使った概算で、将来の基準価額を保証するものではありません。</p>
        </aside>

        <footer className="relative mt-10 flex flex-col gap-2 border-4 border-[#243a2b] bg-[#d8e7ca] px-4 py-4 text-xs font-bold text-[#415c4a] shadow-[5px_5px_0_#76905f] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 オルカン予報</p>
          <p>データ参照：三菱UFJアセットマネジメント / Yahoo Finance · 投資判断はご自身の責任で行ってください</p>
        </footer>
      </div>
    </main>
  );
}

function ModelCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="voxel-panel border-2 border-[#b8cbbb] bg-white/85 p-4">
      <p className="text-xs font-semibold text-[#71817b]">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-[#18352e]">{value}</p>
      <p className="mt-1 text-[11px] text-[#8a9893]">{detail}</p>
    </div>
  );
}

function MetricCard({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="voxel-panel border-2 border-[#b8cbbb] bg-white/90 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#697b75] sm:text-sm">{label}</p>
        <span className={`h-3 w-3 border border-[#263e32] ${accent ? "bg-[#f4aa42]" : "bg-[#72bd58]"}`} />
      </div>
      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-[#18352e] sm:text-3xl">{value}</p>
      <p className={`mt-2 text-[11px] font-medium sm:text-xs ${accent ? "text-[#b27626]" : "text-[#81908b]"}`}>{note}</p>
    </div>
  );
}

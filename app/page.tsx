import { ForecastChart } from "@/components/forecast-chart";
import { AssetSimulator } from "@/components/asset-simulator";
import { AutoRefresh } from "@/components/auto-refresh";
import { VirtualMotion } from "@/components/virtual-motion";
import { AllCountryKun } from "@/components/all-country-kun";
import { ArrowUpRightIcon, GlobeIcon, InfoIcon } from "@/components/icons";
import { getForecastData } from "@/lib/forecast";

const yen = new Intl.NumberFormat("ja-JP");

export default async function Home() {
  const data = await getForecastData();
  const isUp = data.changeAmount >= 0;

  return (
    <main className="curiosity-world min-h-screen overflow-hidden text-[#171717]">
      <VirtualMotion />
      <div className="cosmic-scene" aria-hidden="true">
        <span className="pixel-star star-one" /><span className="pixel-star star-two" /><span className="pixel-star star-three" /><span className="pixel-star star-four" />
        <span className="pixel-planet planet-one"><i /></span><span className="pixel-planet planet-two"><i /></span>
        <span className="pixel-rocket"><i /></span><span className="pixel-orbit" />
        <span className="money-saturn"><b>¥</b></span><span className="cash-comet"><b>¥10000</b><i /></span>
      </div>
      <div className="voxel-ground" aria-hidden="true" />

      <header className="editorial-header relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="editorial-logo grid h-12 w-12 place-items-center bg-[#7696f5] text-white"><GlobeIcon className="h-6 w-6" /></div>
            <div>
              <p className="font-display text-xl font-black tracking-tight">オルカン予報</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#555]">ALL COUNTRY UNIVERSE</p>
            </div>
          </div>
          <span className={`editorial-badge border-2 px-4 py-2 text-xs font-black ${data.isLive ? "border-black bg-[#25c98d] text-black" : "border-black bg-[#ffd45a] text-black"}`}>
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${data.isLive ? "bg-emerald-500" : "bg-amber-500"}`} />
            {data.isLive ? "LIVE DATA" : "データ取得確認中"}
          </span>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12 lg:px-10 lg:pb-16">
        <AllCountryKun />
        <section className="mb-5 hidden flex-col gap-3 sm:mb-7 sm:flex sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-tag mb-3 w-fit border-2 border-black bg-[#c7a87e] px-3 py-1 text-xs font-black tracking-[0.13em]">TODAY&apos;S OUTLOOK</p>
            <h1 className="max-w-2xl text-xl font-black leading-snug sm:text-3xl">{data.fundName}</h1>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-bold ${data.isLive ? "text-[#52ffd0]" : "text-[#ffef55]"}`}>{data.statusMessage}</p>
            <div className="mt-2"><AutoRefresh /></div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="editorial-hero order-1 relative overflow-hidden bg-[#7696f5] p-5 text-black sm:p-9">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[44px] border-white/[0.035]" />
            <div className="absolute bottom-0 right-0 h-32 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1.5px)] [background-size:12px_12px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black">{data.forecastTitle}</p>
                  <p className="mt-1 text-xs text-black/60">1万口あたり</p>
                </div>
                <div className="text-right">
                  <span className="paper-label inline-block bg-[#f4ede3] px-3 py-1 text-[11px] font-black">{data.forecastDate} 予測</span>
                  <p className="mt-2 text-[10px] font-bold text-black/55">データ取得 {data.updatedAt}</p>
                  <div className="mt-2 sm:hidden"><AutoRefresh /></div>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-2 sm:mt-9">
                <span className="font-display text-[54px] font-semibold leading-none tracking-[-0.045em] sm:text-[78px]">{yen.format(data.forecastValue)}</span>
                <span className="pb-1.5 text-lg font-black sm:pb-2">円</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t-2 border-black/25 pt-4 sm:mt-7 sm:pt-5">
                <span className={`paper-label inline-flex items-center gap-1 px-3 py-1.5 text-sm font-black ${isUp ? "bg-emerald-300" : "bg-amber-300"}`}><span className="text-xl leading-none">{isUp ? "↑" : "↓"}</span><ArrowUpRightIcon className={`h-4 w-4 ${isUp ? "" : "rotate-90"}`} />{isUp ? "+" : ""}{yen.format(data.changeAmount)}円</span>
                <span className="font-display text-xl font-black">{isUp ? "+" : ""}{data.changeRate.toFixed(2)}%</span>
                <span className="text-xs text-black/60">前回比</span>
                <span className="paper-label ml-auto inline-flex items-center gap-2 bg-[#54d9ff] px-3 py-1.5 text-sm font-black sm:hidden">
                  <span className="text-xs">ドル円</span>{data.usdJpy.toFixed(2)}円
                  <span className="text-[10px] font-bold">{data.usdJpyChange >= 0 ? "↑" : "↓"}{Math.abs(data.usdJpyChange).toFixed(2)}</span>
                </span>
              </div>
              <p className="mt-3 text-[10px] font-black text-black/60 sm:text-xs">{data.cutoffStatus}</p>
            </div>
          </div>

          <div className="order-3 grid grid-cols-2 gap-4 lg:order-2 lg:grid-cols-1">
            <MetricCard label="前回の基準価額" value={`${yen.format(data.previousValue)}円`} note={`${data.previousDate} 公式公表値`} />
            <MetricCard label="ドル円" value={`${data.usdJpy.toFixed(2)}円`} note={`直近比 ${data.usdJpyChange >= 0 ? "+" : ""}${data.usdJpyChange.toFixed(2)}円`} accent />
          </div>
          <div className="order-2 lg:order-3 lg:col-span-2"><AssetSimulator changeRate={data.changeRate} /></div>
        </section>

        <section className="editorial-card chart-paper mt-6 p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.12em] text-[#286a55]">PRICE TREND</p>
              <h2 className="mt-1 text-xl font-black">基準価額の推移</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#71807b]">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#13875f]" />公表値</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-[#f4aa42] ring-2 ring-amber-100" />今日の予測</span>
            </div>
          </div>
          <div className="mt-4"><ForecastChart data={data.points} /></div>
        </section>

        <section className="editorial-card mt-6 overflow-hidden">
          <div className="future-daily-header flex flex-col gap-2 border-b border-black/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p className="text-xs font-black tracking-[0.12em] text-[#6b5310]">DAILY RECORD</p>
              <h2 className="mt-1 text-xl font-black">日ごとの騰落率</h2>
            </div>
            <p className="text-[11px] font-bold text-black/55">公式基準価額から算出</p>
          </div>
          <div>
            <div className="hidden grid-cols-4 border-b-2 border-black/10 bg-white/50 px-7 py-3 text-xs text-black/55 sm:grid">
              <span>日付</span><span className="text-right">基準価額</span><span className="text-right">騰落額</span><span className="text-right">騰落率</span>
            </div>
            {data.dailyChanges.map((item) => {
              const up = item.amount >= 0;
              return (
                <div key={item.date} className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-black/10 px-5 py-4 text-sm last:border-0 sm:grid-cols-4 sm:px-7 sm:py-3">
                  <div><span className="mb-1 block text-[10px] font-bold text-black/45 sm:hidden">日付</span><span className="font-black">{item.date}</span></div>
                  <div className="text-right"><span className="mb-1 block text-[10px] font-bold text-black/45 sm:hidden">基準価額</span><span className="font-bold">{yen.format(item.value)}円</span></div>
                  <div className={`sm:text-right ${up ? "text-emerald-300" : "text-amber-300"}`}><span className="mb-1 block text-[10px] font-bold text-white/45 sm:hidden">騰落額</span><span className="font-black">{up ? "↑ +" : "↓ "}{yen.format(item.amount)}円</span></div>
                  <div className={`text-right ${up ? "text-emerald-300" : "text-amber-300"}`}><span className="mb-1 block text-[10px] font-bold text-white/45 sm:hidden">騰落率</span><span className="font-black">{up ? "+" : ""}{item.rate.toFixed(2)}%</span></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <ModelCard label="世界株の変動" value={`${data.marketReturn >= 0 ? "+" : ""}${data.marketReturn.toFixed(2)}%`} detail="ACWI ETF・直近取引比" />
          <ModelCard label="為替の変動" value={`${data.fxReturn >= 0 ? "+" : ""}${data.fxReturn.toFixed(2)}%`} detail="USD/JPY・直近比" />
          <ModelCard label="予測モデル" value="株価 × 為替" detail="円換算の概算リターン" />
        </section>

        <aside className="editorial-note mt-6 flex gap-3 p-4 text-sm leading-relaxed text-[#433d36]">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2f8b69]" />
          <p><strong className="font-bold text-[#254c40]">実データを使った参考予測です。</strong> 基準価額は三菱UFJアセットマネジメント、世界株と為替はYahoo Financeの公開市場データを参照しています。予測値はACWI ETFとドル円を使った概算で、将来の基準価額を保証するものではありません。</p>
        </aside>

        <footer className="editorial-footer relative mt-10 flex flex-col gap-2 px-4 py-4 text-xs font-bold sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 オルカン予報</p>
          <p>データ参照：三菱UFJアセットマネジメント / Yahoo Finance · 投資判断はご自身の責任で行ってください</p>
        </footer>
      </div>
    </main>
  );
}

function ModelCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="editorial-card p-4">
      <p className="text-xs font-semibold text-[#71817b]">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-[#18352e]">{value}</p>
      <p className="mt-1 text-[11px] text-[#8a9893]">{detail}</p>
    </div>
  );
}

function MetricCard({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="editorial-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#697b75] sm:text-sm">{label}</p>
        <span className={`h-3 w-3 border border-[#263e32] ${accent ? "bg-[#f4aa42]" : "bg-[#72bd58]"}`} />
      </div>
      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-[#18352e] sm:text-3xl">{value}</p>
      <p className={`mt-2 text-[11px] font-medium sm:text-xs ${accent ? "text-[#b27626]" : "text-[#81908b]"}`}>{note}</p>
    </div>
  );
}

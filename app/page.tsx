import { ForecastChart } from "@/components/forecast-chart";
import { ArrowUpRightIcon, ClockIcon, GlobeIcon, InfoIcon } from "@/components/icons";
import { getForecastData } from "@/lib/forecast";

const yen = new Intl.NumberFormat("ja-JP");

export default async function Home() {
  const data = await getForecastData();
  const isUp = data.changeAmount >= 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7f4] text-[#18302b]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_8%_4%,rgba(250,205,133,0.22),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(82,177,142,0.16),transparent_30%)]" />

      <header className="relative border-b border-[#dfe8e3] bg-[#f8faf8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#173f35] text-[#d9f4e8] shadow-sm"><GlobeIcon className="h-5 w-5" /></div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-[#173f35]">オルカン予報</p>
              <p className="text-[10px] font-medium tracking-[0.2em] text-[#75857f]">ALL COUNTRY FORECAST</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">STEP 1 · サンプル版</span>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12 lg:px-10 lg:pb-16">
        <section className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-[#14815d]"><span className="h-px w-6 bg-[#14815d]" />TODAY&apos;S OUTLOOK</p>
            <h1 className="max-w-2xl text-xl font-bold leading-snug text-[#18302b] sm:text-2xl">{data.fundName}</h1>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-[#6d7d78]"><ClockIcon className="h-4 w-4" />最終更新 {data.updatedAt}</p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden rounded-[28px] bg-[#163f35] p-6 text-white shadow-[0_24px_60px_-25px_rgba(17,62,49,0.6)] sm:p-9">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[44px] border-white/[0.035]" />
            <div className="absolute bottom-0 right-0 h-32 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1.5px)] [background-size:12px_12px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#b9d6cd]">今日の予測基準価額</p>
                  <p className="mt-1 text-xs text-[#7fa99b]">1万口あたり</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#d4e7e0]">10月28日 予測</span>
              </div>
              <div className="mt-7 flex items-end gap-2 sm:mt-9">
                <span className="font-display text-[58px] font-semibold leading-none tracking-[-0.045em] sm:text-[78px]">{yen.format(data.forecastValue)}</span>
                <span className="pb-1.5 text-lg font-medium text-[#c5ddd5] sm:pb-2">円</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${isUp ? "bg-[#dff5e9] text-[#096845]" : "bg-rose-100 text-rose-700"}`}><ArrowUpRightIcon className={`h-4 w-4 ${isUp ? "" : "rotate-90"}`} />{isUp ? "+" : ""}{yen.format(data.changeAmount)}円</span>
                <span className="font-display text-xl font-semibold text-[#ecf7f3]">{isUp ? "+" : ""}{data.changeRate.toFixed(2)}%</span>
                <span className="text-xs text-[#8fb4a8]">前回比</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <MetricCard label="前回の基準価額" value={`${yen.format(data.previousValue)}円`} note="10月27日 公表値" />
            <MetricCard label="ドル円" value={`${data.usdJpy.toFixed(2)}円`} note={`前日比 +${data.usdJpyChange.toFixed(2)}円`} accent />
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-sm sm:p-7 lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-[#14815d]">PRICE TREND</p>
              <h2 className="mt-1 text-xl font-bold text-[#203b34]">基準価額の推移</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#71807b]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#13875f]" />公表値</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f4aa42] ring-2 ring-amber-100" />今日の予測</span>
            </div>
          </div>
          <div className="mt-4"><ForecastChart data={data.points} /></div>
        </section>

        <aside className="mt-5 flex gap-3 rounded-2xl border border-amber-200/80 bg-[#fff9ed] p-4 text-sm leading-relaxed text-[#72562d]">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#c4872e]" />
          <p><strong className="font-bold">このページはサンプルデータで表示しています。</strong><br className="sm:hidden" /> 実際の基準価額・為替レートではありません。投資判断には利用せず、最新情報は運用会社の公式サイトでご確認ください。</p>
        </aside>

        <footer className="mt-8 flex flex-col gap-2 border-t border-[#dbe5e0] pt-6 text-xs text-[#798781] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 オルカン予報</p>
          <p>データ提供：サンプル · 投資判断はご自身の責任で行ってください</p>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#697b75] sm:text-sm">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${accent ? "bg-[#f4aa42]" : "bg-[#49ad89]"}`} />
      </div>
      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-[#18352e] sm:text-3xl">{value}</p>
      <p className={`mt-2 text-[11px] font-medium sm:text-xs ${accent ? "text-[#b27626]" : "text-[#81908b]"}`}>{note}</p>
    </div>
  );
}

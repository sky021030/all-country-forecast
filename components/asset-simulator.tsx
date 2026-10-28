"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_AMOUNT = 25_000_000;
const MAX_AMOUNT = 50_000_000;
const STORAGE_KEY = "all-country-forecast:deposit-amount";
const yen = new Intl.NumberFormat("ja-JP");

export function AssetSimulator({ changeRate }: { changeRate: number }) {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [savedAmount, setSavedAmount] = useState(DEFAULT_AMOUNT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : DEFAULT_AMOUNT;
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= MAX_AMOUNT) {
      setAmount(parsed);
      setSavedAmount(parsed);
    }
  }, []);

  const impact = useMemo(() => Math.round(amount * (changeRate / 100)), [amount, changeRate]);
  const projected = amount + impact;
  const isUp = impact >= 0;

  function updateAmount(value: number) {
    const next = Math.min(MAX_AMOUNT, Math.max(0, Math.round(value / 100_000) * 100_000));
    setAmount(next);
    setSaved(false);
  }

  function saveAmount() {
    window.localStorage.setItem(STORAGE_KEY, String(amount));
    setSavedAmount(amount);
    setSaved(true);
  }

  return (
    <section className="voxel-panel mt-6 overflow-hidden border-2 border-[#b8cbbb] bg-white/90 p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[#14815d]">MY ASSET</p>
          <h2 className="mt-1 text-xl font-bold text-[#203b34]">預り金への予測反映</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#788781]">現在の予測騰落率を保有額へ当てはめた概算です</p>
        </div>
        <span className="w-fit rounded-full bg-[#eff6f2] px-3 py-1.5 text-[11px] font-semibold text-[#487065]">
          保存値 {yen.format(savedAmount)}円
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <div className="flex items-end gap-2">
            <label htmlFor="deposit-amount" className="text-sm font-semibold text-[#526760]">預り金</label>
            <div className="ml-auto flex items-center gap-2">
              <input
                id="deposit-amount"
                type="number"
                min={0}
                max={MAX_AMOUNT}
                step={100000}
                value={amount}
                onChange={(event) => updateAmount(Number(event.target.value))}
                className="w-36 rounded-xl border border-[#d6e3de] bg-[#f8faf9] px-3 py-2 text-right font-display text-lg font-semibold text-[#18352e] outline-none transition focus:border-[#4aa684] focus:ring-2 focus:ring-[#4aa684]/15 sm:w-44"
                aria-label="預り金額"
              />
              <span className="text-sm font-semibold text-[#667871]">円</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={MAX_AMOUNT}
            step={100000}
            value={amount}
            onChange={(event) => updateAmount(Number(event.target.value))}
            className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dfe9e5] accent-[#16855f]"
            style={{ background: `linear-gradient(to right, #16855f 0%, #16855f ${(amount / MAX_AMOUNT) * 100}%, #dfe9e5 ${(amount / MAX_AMOUNT) * 100}%, #dfe9e5 100%)` }}
            aria-label="預り金をバーで選択"
          />
          <div className="mt-2 flex justify-between text-[10px] font-medium text-[#8a9893] sm:text-xs">
            <span>0円</span>
            <button type="button" onClick={() => updateAmount(DEFAULT_AMOUNT)} className="rounded-full px-2 py-0.5 transition hover:bg-[#edf4f1] hover:text-[#197b5c]">基準 2,500万円</button>
            <span>5,000万円</span>
          </div>

          <button
            type="button"
            onClick={saveAmount}
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#173f35] px-5 text-sm font-bold text-white transition hover:bg-[#205448] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30"
          >
            {saved ? "保存しました" : "この金額を保存"}
          </button>
          <p className="mt-2 text-[10px] text-[#91a09b]">この端末のブラウザに保存されます</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-2xl p-4 ${isUp ? "bg-[#e9f7f0]" : "bg-rose-50"}`}>
            <p className="text-xs font-semibold text-[#667871]">予測反映額</p>
            <p className={`mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${isUp ? "text-[#08734e]" : "text-rose-700"}`}>
              {isUp ? "+" : ""}{yen.format(impact)}円
            </p>
            <p className="mt-1 text-[11px] text-[#7b8c85]">騰落率 {changeRate >= 0 ? "+" : ""}{changeRate.toFixed(2)}%</p>
          </div>
          <div className="rounded-2xl bg-[#f2f5f3] p-4">
            <p className="text-xs font-semibold text-[#667871]">反映後の概算</p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#18352e] sm:text-3xl">{yen.format(projected)}円</p>
            <p className="mt-1 text-[11px] text-[#7b8c85]">預り金 + 予測反映額</p>
          </div>
        </div>
      </div>
    </section>
  );
}

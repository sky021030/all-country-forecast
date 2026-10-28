"use client";

import { useRef, useState } from "react";

const burstCoins = Array.from({ length: 12 });
const trailCoins = Array.from({ length: 5 });

export function AllCountryKun() {
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const makeMoney = () => {
    setBurst((value) => value + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBurst(0), 1100);
  };

  return (
    <div className="flying-orkan">
      <button
        className={`orkan-kun${burst ? " is-making-money" : ""}`}
        type="button"
        aria-label="オルカンくんを応援してコインを撒く"
        onClick={makeMoney}
      >
        <span className="orkan-speech" aria-hidden="true">
          {burst ? "利益ゲット！" : "タップして応援！"}
        </span>
        <span className="orkan-pack"><i>¥</i></span>
        <span className="orkan-head"><i className="orkan-eye left" /><i className="orkan-eye right" /><b /></span>
        <span className="orkan-arm arm-left" /><span className="orkan-arm arm-right" />
        <span className="orkan-leg leg-left" /><span className="orkan-leg leg-right" />
        <span className="orkan-money-trail" aria-hidden="true">
          {trailCoins.map((_, index) => <i key={index}>¥</i>)}
        </span>
        {burst > 0 && (
          <span className="orkan-coin-burst" key={burst} aria-hidden="true">
            {burstCoins.map((_, index) => <i key={index}>¥</i>)}
          </span>
        )}
      </button>
    </div>
  );
}

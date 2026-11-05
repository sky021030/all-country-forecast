import type { ForecastData } from "@/lib/forecast";

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function MarketTicker({ data }: { data: ForecastData }) {
  const stockView = data.marketReturn >= 0
    ? `世界株は直近で${signed(data.marketReturn)}。株価要因はオルカンの追い風です`
    : `世界株は直近で${signed(data.marketReturn)}。株価要因はオルカンの下押し材料です`;
  const fxView = data.fxReturn >= 0
    ? `ドル円は円安方向に${signed(data.fxReturn)}。円換算ではプラス要因です`
    : `ドル円は円高方向に${signed(data.fxReturn)}。円換算ではマイナス要因です`;
  const outlook = data.changeRate >= 0
    ? `総合見通しは上向き。予測騰落率は${signed(data.changeRate)}`
    : `総合見通しは慎重。予測騰落率は${signed(data.changeRate)}`;
  const items = [stockView, fxView, outlook, `データ更新 ${data.updatedAt}`, "公開市場データに基づく自動要約です。投資助言ではありません"];

  return (
    <section className="market-teletype" aria-label="直近の市場見解">
      <div className="market-teletype-label">
        <span className="market-live-dot" />
        <span>MARKET VIEW</span>
        <small>自動要約</small>
      </div>
      <div className="market-teletype-window">
        <div className="market-teletype-track">
          {[0, 1].map((copy) => (
            <div className="market-teletype-set" key={copy} aria-hidden={copy === 1}>
              {items.map((item, index) => (
                <span className="market-teletype-item" key={`${copy}-${index}`}>
                  <i>{index === 2 ? "◎" : "◆"}</i>{item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

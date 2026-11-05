import type { ForecastData } from "@/lib/forecast";
import type { MarketNewsItem } from "@/lib/news";

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function MarketTicker({ data, news }: { data: ForecastData; news: MarketNewsItem[] }) {
  const stockView = data.marketReturn >= 0
    ? `世界株は直近で${signed(data.marketReturn)}。株価要因はオルカンの追い風です`
    : `世界株は直近で${signed(data.marketReturn)}。株価要因はオルカンの下押し材料です`;
  const fxView = data.fxReturn >= 0
    ? `ドル円は円安方向に${signed(data.fxReturn)}。円換算ではプラス要因です`
    : `ドル円は円高方向に${signed(data.fxReturn)}。円換算ではマイナス要因です`;
  const outlook = data.changeRate >= 0
    ? `総合見通しは上向き。予測騰落率は${signed(data.changeRate)}`
    : `総合見通しは慎重。予測騰落率は${signed(data.changeRate)}`;
  const combinedDriver = data.marketReturn < 0 && data.fxReturn < 0
    ? "世界株安＋円高が同時進行。株価と為替の両方が基準価額を押し下げています"
    : data.marketReturn > 0 && data.fxReturn > 0
      ? "世界株高＋円安が同時進行。株価と為替の両方が基準価額を押し上げています"
      : Math.abs(data.marketReturn) >= Math.abs(data.fxReturn)
        ? `主因は世界株の${data.marketReturn >= 0 ? "上昇" : "下落"}。為替より株価の影響が大きい状況です`
        : `主因は${data.fxReturn >= 0 ? "円安" : "円高"}。世界株より為替の影響が大きい状況です`;
  const driverItems = [combinedDriver, stockView, fxView, outlook].map((title) => ({
    title,
    source: "値動き要因",
    publishedAt: data.updatedAt,
    url: "",
  }));
  const items = [...driverItems, ...news].slice(0, 10);

  return (
    <section className="market-teletype" aria-label="オルカン関連の最新ニュース">
      <div className="market-teletype-label">
        <span className="market-live-dot" />
        <span>ORKAN NEWS</span>
        <small>速報</small>
      </div>
      <div className="market-teletype-window">
        <div className="market-teletype-track">
          {[0, 1].map((copy) => (
            <div className="market-teletype-set" key={copy} aria-hidden={copy === 1}>
              {items.map((item, index) => {
                const content = <><i>◆</i><b>{item.source}</b><span>{item.title}</span><time>{item.publishedAt}</time></>;
                return item.url ? (
                  <a className="market-teletype-item" href={item.url} target="_blank" rel="noreferrer" key={`${copy}-${index}`} tabIndex={copy === 1 ? -1 : undefined}>{content}</a>
                ) : (
                  <span className="market-teletype-item" key={`${copy}-${index}`}>{content}</span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

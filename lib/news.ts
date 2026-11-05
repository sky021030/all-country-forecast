export type MarketNewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
};

const NEWS_FEEDS = [
  "https://news.google.com/rss/search?q=%E3%82%AA%E3%83%AB%E3%82%AB%E3%83%B3%20OR%20%22eMAXIS%20Slim%20%E5%85%A8%E4%B8%96%E7%95%8C%E6%A0%AA%E5%BC%8F%22&hl=ja&gl=JP&ceid=JP:ja",
  "https://news.google.com/rss/search?q=%22MSCI%20ACWI%22%20OR%20%E4%B8%96%E7%95%8C%E6%A0%AA%20OR%20%E3%83%89%E3%83%AB%E5%86%86&hl=ja&gl=JP&ceid=JP:ja",
] as const;

const FALLBACK_NEWS: MarketNewsItem[] = [
  {
    title: "オルカンが5ツ星に格上げ。株式ファンド24本の共通点を検証",
    source: "SBI証券",
    publishedAt: "10/19",
    url: "https://go.sbisec.co.jp/media/report/fund_info_plus/fund_info_plus_261019.html",
  },
  {
    title: "オルカンの資金流入3兆円超。2026年の人気ファンドを検証",
    source: "SBI証券",
    publishedAt: "10/13",
    url: "https://go.sbisec.co.jp/media/report/fund_info_plus/fund_info_plus_261013.html",
  },
  {
    title: "オルカンが売れ筋首位を維持。世界株と金利動向にも注目",
    source: "Finasee",
    publishedAt: "10月公開",
    url: "https://media.finasee.jp/articles/-/19661",
  },
];

function decodeXml(value: string) {
  return value
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tag(item: string, name: string) {
  return decodeXml(item.match(new RegExp(`<${name}(?: [^>]*)?>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? "");
}

function formatPublishedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "更新時刻不明";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function parseFeed(xml: string): MarketNewsItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const item = match[1];
    const title = tag(item, "title").replace(/\s+-\s+[^-]+$/, "");
    const source = tag(item, "source") || "ニュース";
    return {
      title,
      source,
      publishedAt: formatPublishedAt(tag(item, "pubDate")),
      url: tag(item, "link"),
    };
  }).filter((item) => item.title && item.url);
}

async function fetchFeed(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`News feed returned ${response.status}`);
  return parseFeed(await response.text());
}

export async function getMarketNews(): Promise<MarketNewsItem[]> {
  const results = await Promise.allSettled(NEWS_FEEDS.map(fetchFeed));
  const seen = new Set<string>();

  const news = results
    .flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .filter((item) => {
      const key = item.title.replaceAll(/\s/g, "").slice(0, 45);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);

  return news.length > 0 ? news : FALLBACK_NEWS;
}

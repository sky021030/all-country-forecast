export type ForecastPoint = {
  date: string;
  value: number;
  kind: "actual" | "forecast";
};

export type DailyChange = {
  date: string;
  value: number;
  amount: number;
  rate: number;
};

export type ForecastData = {
  fundName: string;
  fundShortName: string;
  previousValue: number;
  previousDate: string;
  forecastValue: number;
  forecastDate: string;
  forecastTitle: string;
  cutoffStatus: string;
  changeAmount: number;
  changeRate: number;
  usdJpy: number;
  usdJpyChange: number;
  marketReturn: number;
  fxReturn: number;
  updatedAt: string;
  points: ForecastPoint[];
  dailyChanges: DailyChange[];
  isLive: boolean;
  statusMessage: string;
};

type FundRow = { BASE_DATE: string; BASE_PRICE: number };
type FundChartResponse = { ROWS: FundRow[] };
type YahooChartResult = {
  meta: { regularMarketPrice?: number; regularMarketTime?: number };
  timestamp?: number[];
  indicators: { quote: Array<{ close?: Array<number | null> }> };
};
type YahooChartResponse = { chart: { result: YahooChartResult[] | null } };

const FUND_HISTORY_URL = "https://www.am.mufg.jp/fund_file/chart/chart_data_253425.js";
const ACWI_URL = "https://query1.finance.yahoo.com/v8/finance/chart/ACWI?range=10d&interval=1d";
const USDJPY_URL = "https://query1.finance.yahoo.com/v8/finance/chart/JPY=X?range=5d&interval=1h";

const fallbackRows: FundRow[] = [
  { BASE_DATE: "20261021", BASE_PRICE: 37858 },
  { BASE_DATE: "20261022", BASE_PRICE: 38036 },
  { BASE_DATE: "20261023", BASE_PRICE: 37162 },
  { BASE_DATE: "20261026", BASE_PRICE: 37189 },
  { BASE_DATE: "20261027", BASE_PRICE: 37441 },
];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "all-country-forecast/1.0" },
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`Data source returned ${response.status}`);
  return response.json() as Promise<T>;
}

function getLatestPair(result: YahooChartResult): [number, number] {
  const closes = (result.indicators.quote[0]?.close ?? []).filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value),
  );
  if (closes.length < 2) throw new Error("Not enough market data");
  return [closes.at(-2)!, result.meta.regularMarketPrice ?? closes.at(-1)!];
}

function formatFundDate(value: string): string {
  return `${Number(value.slice(4, 6))}/${Number(value.slice(6, 8))}`;
}

function formatLongDate(value: string): string {
  return `${value.slice(0, 4)}年${Number(value.slice(4, 6))}月${Number(value.slice(6, 8))}日`;
}

function tokyoNow(): { date: string; compactDate: string; dateTime: string; afterCutoff: boolean } {
  const now = new Date();
  const date = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  const dateTime = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now);
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(timeParts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(timeParts.find((part) => part.type === "minute")?.value ?? 0);
  return {
    date,
    compactDate: date.replaceAll("/", ""),
    dateTime,
    afterCutoff: hour > 18 || (hour === 18 && minute >= 30),
  };
}

export async function getForecastData(): Promise<ForecastData> {
  const results = await Promise.allSettled([
    fetchJson<FundChartResponse>(FUND_HISTORY_URL),
    fetchJson<YahooChartResponse>(ACWI_URL),
    fetchJson<YahooChartResponse>(USDJPY_URL),
  ] as const);

  const [fundResult, acwiResponse, fxResponse] = results;
  const fundLive = fundResult.status === "fulfilled";
  const marketLive = acwiResponse.status === "fulfilled" && fxResponse.status === "fulfilled";
  const rows = fundResult.status === "fulfilled"
    ? fundResult.value.ROWS.filter((row) => row.BASE_PRICE > 0).slice(-7)
    : fallbackRows;
  const latestFund = rows.at(-1)!;

  let acwiPrevious = 1;
  let acwiLatest = 1;
  let fxPrevious = 157.5;
  let fxLatest = 157.5;

  if (acwiResponse.status === "fulfilled" && fxResponse.status === "fulfilled") {
    const acwiResult = acwiResponse.value.chart.result?.[0];
    const fxResult = fxResponse.value.chart.result?.[0];
    if (!acwiResult || !fxResult) throw new Error("Market data is unavailable");
    [acwiPrevious, acwiLatest] = getLatestPair(acwiResult);
    [fxPrevious, fxLatest] = getLatestPair(fxResult);
  }

  const marketReturn = acwiLatest / acwiPrevious - 1;
  const fxReturn = fxLatest / fxPrevious - 1;
  const forecastReturn = (1 + marketReturn) * (1 + fxReturn) - 1;
  const forecastValue = Math.round(latestFund.BASE_PRICE * (1 + forecastReturn));
  const changeAmount = forecastValue - latestFund.BASE_PRICE;
  const { date, compactDate, dateTime, afterCutoff } = tokyoNow();
  const isLive = fundLive && marketLive;
  const officialToday = latestFund.BASE_DATE === compactDate;
  const dailyChanges = rows.slice(1).map((row, index) => {
    const previous = rows[index];
    const amount = row.BASE_PRICE - previous.BASE_PRICE;
    return {
      date: formatFundDate(row.BASE_DATE),
      value: row.BASE_PRICE,
      amount,
      rate: (amount / previous.BASE_PRICE) * 100,
    };
  }).reverse();

  return {
    fundName: "eMAXIS Slim 全世界株式（オール・カントリー）",
    fundShortName: "オルカン",
    previousValue: latestFund.BASE_PRICE,
    previousDate: formatLongDate(latestFund.BASE_DATE),
    forecastValue,
    forecastDate: officialToday ? "次回営業日" : date,
    forecastTitle: officialToday ? "次回営業日の予測基準価額" : "今日の予測基準価額",
    cutoffStatus: officialToday
      ? "本日分の公式値を確認済み・次回営業日を予測中"
      : afterCutoff
        ? "18:30締め予測・公式基準価額の更新待ち"
        : "18:30に当日予測を締めます",
    changeAmount,
    changeRate: forecastReturn * 100,
    usdJpy: fxLatest,
    usdJpyChange: fxLatest - fxPrevious,
    marketReturn: marketReturn * 100,
    fxReturn: fxReturn * 100,
    updatedAt: dateTime,
    points: [
      ...rows.slice(-6).map((row) => ({ date: formatFundDate(row.BASE_DATE), value: row.BASE_PRICE, kind: "actual" as const })),
      { date: "予測", value: forecastValue, kind: "forecast" as const },
    ],
    dailyChanges,
    isLive,
    statusMessage: isLive
      ? "公式基準価額と市場データを取得済み"
      : "一部データを取得できないため、直近確認値を表示中",
  };
}

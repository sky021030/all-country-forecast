export type ForecastPoint = {
  date: string;
  value: number;
  kind: "actual" | "forecast";
};

export type ForecastData = {
  fundName: string;
  fundShortName: string;
  previousValue: number;
  forecastValue: number;
  changeAmount: number;
  changeRate: number;
  usdJpy: number;
  usdJpyChange: number;
  updatedAt: string;
  points: ForecastPoint[];
};

// STEP 2 では、この関数の中身を API / DB 呼び出しに置き換えます。
export async function getForecastData(): Promise<ForecastData> {
  return {
    fundName: "eMAXIS Slim 全世界株式（オール・カントリー）",
    fundShortName: "オルカン",
    previousValue: 27184,
    forecastValue: 27492,
    changeAmount: 308,
    changeRate: 1.13,
    usdJpy: 150.42,
    usdJpyChange: 0.36,
    updatedAt: "2026年10月28日 10:30",
    points: [
      { date: "10/20", value: 26730, kind: "actual" },
      { date: "10/21", value: 26866, kind: "actual" },
      { date: "10/22", value: 26798, kind: "actual" },
      { date: "10/23", value: 27012, kind: "actual" },
      { date: "10/24", value: 26942, kind: "actual" },
      { date: "10/27", value: 27184, kind: "actual" },
      { date: "10/28", value: 27492, kind: "forecast" },
    ],
  };
}

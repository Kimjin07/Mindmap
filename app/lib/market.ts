/**
 * 实时行情 / 财报接入（Financial Modeling Prep）。
 *
 * 用法：
 *   1) 去 https://site.financialmodelingprep.com 注册，拿一个免费 API Key。
 *   2) 在项目根目录建 `.env.local`，写一行：  FMP_API_KEY=你的key
 *   3) 重启 `npm run dev`。公司页的市值/现价/财务会变成实时（缓存约 1 小时）。
 *
 * 没有 key（或拉取失败、或非美股）时自动回退到 companies.ts 里的近年约值，
 * 现状完全不受影响。为避免币种混乱，实时只对美股(NASDAQ/NYSE)生效，
 * 其它交易所暂用约值。
 */

import type { Company } from "../data/companies";

export interface LiveData {
  live: boolean; // 是否成功取到实时数据
  price?: number; // 现价(USD)
  marketCapB?: number; // 市值(USD 十亿)
  financials?: { year: number; revenue: number; netIncome: number }[];
}

const USD_EXCHANGES = new Set(["NASDAQ", "NYSE"]);
const BASE = "https://financialmodelingprep.com/api/v3";

export async function getLiveData(c: Company): Promise<LiveData> {
  const key = process.env.FMP_API_KEY;
  if (!key || c.kind !== "public" || !c.stock || !USD_EXCHANGES.has(c.stock.exchange)) {
    return { live: false };
  }
  const sym = c.stock.ticker;
  const out: LiveData = { live: false };
  try {
    const [quoteRes, incomeRes] = await Promise.allSettled([
      fetch(`${BASE}/quote/${sym}?apikey=${key}`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}/income-statement/${sym}?limit=2&apikey=${key}`, { next: { revalidate: 86400 } }),
    ]);

    if (quoteRes.status === "fulfilled" && quoteRes.value.ok) {
      const q = (await quoteRes.value.json())?.[0];
      if (q && typeof q.marketCap === "number" && q.marketCap > 0) {
        out.marketCapB = q.marketCap / 1e9;
        if (typeof q.price === "number") out.price = q.price;
        out.live = true;
      }
    }

    if (incomeRes.status === "fulfilled" && incomeRes.value.ok) {
      const rows = await incomeRes.value.json();
      if (Array.isArray(rows) && rows.length) {
        const fin = rows
          .map((r: { calendarYear?: string; revenue?: number; netIncome?: number }) => ({
            year: Number(r.calendarYear),
            revenue: (r.revenue ?? 0) / 1e9,
            netIncome: (r.netIncome ?? 0) / 1e9,
          }))
          .filter((f) => f.year && Number.isFinite(f.revenue))
          .sort((a, b) => a.year - b.year);
        if (fin.length) {
          out.financials = fin;
          out.live = true;
        }
      }
    }
    return out;
  } catch {
    return { live: false };
  }
}

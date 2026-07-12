/**
 * 实时行情 / 财报 / 公司资料接入（Financial Modeling Prep, FMP —— 新版 stable API）。
 *
 * 用法：
 *   1) 去 https://site.financialmodelingprep.com 注册，拿一个免费 API Key。
 *   2) 在项目根目录 `.env.local` 写一行（UTF-8 保存）：  FMP_API_KEY=你的key
 *   3) 重启 `npm run dev`。公司页(美股/美股 ADR)会显示实时市值/现价/市盈率/
 *      涨跌/52 周区间/财务/公司简介/员工数/CEO/行业等。
 *
 * 说明：
 *   · 2025-08-31 后注册的新账号只能用新版 stable 接口（本文件已用新版）。
 *   · 免费档只覆盖美股(NASDAQ/NYSE，含在美上市 ADR，如 TSM/ASML/ARM/UMC)。
 *     台股/港股/A 股/韩股/欧股本地代码需 FMP 付费档，否则自动回退到约值。
 *   · 未上市公司(OpenAI/Anthropic/SpaceX 等)无股票数据，始终用维护内容。
 *   · 服务端拉取（Key 不暴露给浏览器），行情缓存约 1 小时、财报/资料约 1 天。
 */

import type { Company } from "../data/companies";

export interface LiveData {
  live: boolean;
  price?: number;
  marketCapB?: number;
  peRatio?: number;
  changePct?: number;
  week52Low?: number;
  week52High?: number;
  currency?: string;
  history?: { date: string; price: number }[]; // 近 ~7 交易日日线，旧→新
  financials?: { year: number; revenue: number; netIncome: number }[];
  description?: string;
  ceo?: string;
  employees?: string;
  sector?: string;
  industry?: string;
  image?: string;
  website?: string;
}

/** 交易所 → FMP 代码后缀（付费档才有国际行情；美股无后缀）。 */
const EX_SUFFIX: Record<string, string> = {
  NASDAQ: "", NYSE: "",
  TWSE: ".TW", HKEX: ".HK", SZSE: ".SZ", SSE: ".SS",
  KRX: ".KS", ETR: ".DE", EPA: ".PA", TSE: ".T", ASX: ".AX",
};

const BASE = "https://financialmodelingprep.com/stable";

export async function getLiveData(c: Company): Promise<LiveData> {
  const key = process.env.FMP_API_KEY;
  if (!key || c.kind !== "public" || !c.stock) return { live: false };
  const suffix = EX_SUFFIX[c.stock.exchange];
  if (suffix === undefined) return { live: false };
  const sym = c.stock.ticker + suffix;
  const out: LiveData = { live: false };

  try {
    const [quoteRes, incomeRes, profileRes, ratioRes, histRes] = await Promise.allSettled([
      fetch(`${BASE}/quote?symbol=${sym}&apikey=${key}`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}/income-statement?symbol=${sym}&limit=2&apikey=${key}`, { next: { revalidate: 86400 } }),
      fetch(`${BASE}/profile?symbol=${sym}&apikey=${key}`, { next: { revalidate: 86400 } }),
      fetch(`${BASE}/ratios-ttm?symbol=${sym}&apikey=${key}`, { next: { revalidate: 86400 } }),
      fetch(`${BASE}/historical-price-eod/light?symbol=${sym}&apikey=${key}`, { next: { revalidate: 3600 } }),
    ]);

    if (quoteRes.status === "fulfilled" && quoteRes.value.ok) {
      const q = (await quoteRes.value.json())?.[0];
      if (q && typeof q.marketCap === "number" && q.marketCap > 0) {
        out.marketCapB = q.marketCap / 1e9;
        if (typeof q.price === "number") out.price = q.price;
        if (typeof q.changePercentage === "number") out.changePct = Math.round(q.changePercentage * 100) / 100;
        if (typeof q.yearLow === "number") out.week52Low = q.yearLow;
        if (typeof q.yearHigh === "number") out.week52High = q.yearHigh;
        out.live = true;
      }
    }

    if (incomeRes.status === "fulfilled" && incomeRes.value.ok) {
      const rows = await incomeRes.value.json();
      if (Array.isArray(rows) && rows.length) {
        const fin = rows
          .map((r: { date?: string; revenue?: number; netIncome?: number }) => ({
            year: Number(String(r.date ?? "").slice(0, 4)),
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

    if (profileRes.status === "fulfilled" && profileRes.value.ok) {
      const p = (await profileRes.value.json())?.[0];
      if (p) {
        if (typeof p.description === "string") out.description = p.description;
        if (typeof p.ceo === "string" && p.ceo) out.ceo = p.ceo;
        if (p.fullTimeEmployees) out.employees = String(p.fullTimeEmployees);
        if (typeof p.sector === "string") out.sector = p.sector;
        if (typeof p.industry === "string") out.industry = p.industry;
        if (typeof p.image === "string") out.image = p.image;
        if (typeof p.website === "string") out.website = p.website;
        if (typeof p.currency === "string") out.currency = p.currency;
      }
    }

    if (ratioRes.status === "fulfilled" && ratioRes.value.ok) {
      const r = (await ratioRes.value.json())?.[0];
      const pe = r?.priceToEarningsRatioTTM;
      if (typeof pe === "number" && pe > 0) out.peRatio = Math.round(pe * 10) / 10;
    }

    if (histRes.status === "fulfilled" && histRes.value.ok) {
      const rows = await histRes.value.json();
      if (Array.isArray(rows) && rows.length) {
        // 接口返回从新到旧；取最近 ~7 个交易日，反转成旧→新
        const pts = rows
          .filter((r: { date?: string; price?: number }) => r.date && typeof r.price === "number")
          .slice(0, 7)
          .map((r: { date: string; price: number }) => ({ date: r.date, price: r.price }))
          .reverse();
        if (pts.length >= 2) out.history = pts;
      }
    }

    return out;
  } catch {
    return { live: false };
  }
}

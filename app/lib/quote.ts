/**
 * 服务端预取行情(Yahoo Finance 免费公开端点),用于首屏直接显示股价,
 * 避免客户端加载前的"—"闪烁。缓存 60 秒;客户端随后每分钟轮询 /api/quote 刷新。
 */

const EX_SUFFIX: Record<string, string> = {
  NASDAQ: "", NYSE: "", AMEX: "",
  HKEX: ".HK", SSE: ".SS", SZSE: ".SZ", TWSE: ".TW",
  TSE: ".T", KRX: ".KS", ETR: ".DE", EPA: ".PA", ASX: ".AX", LSE: ".L",
};

export interface Quote {
  live: boolean;
  price?: number;
  changePct?: number;
  week52Low?: number;
  week52High?: number;
  history?: { date: string; price: number }[];
  currency?: string;
  ts?: number;
}

export async function getQuote(exchange?: string, ticker?: string): Promise<Quote> {
  if (!ticker) return { live: false };
  const suffix = exchange && exchange in EX_SUFFIX ? EX_SUFFIX[exchange] : "";
  const yh = encodeURIComponent(ticker + suffix);
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yh}?range=1mo&interval=1d`,
      { next: { revalidate: 60 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) return { live: false };
    const j = await r.json();
    const res = j?.chart?.result?.[0];
    const m = res?.meta;
    if (!m || typeof m.regularMarketPrice !== "number") return { live: false };
    const price = m.regularMarketPrice;
    const ts: number[] = res?.timestamp ?? [];
    const closes: (number | null)[] = res?.indicators?.quote?.[0]?.close ?? [];
    const history = ts
      .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), price: closes[i] }))
      .filter((p): p is { date: string; price: number } => typeof p.price === "number");
    const prev =
      typeof m.previousClose === "number"
        ? m.previousClose
        : history.length >= 2
        ? history[history.length - 2].price
        : undefined;
    const changePct =
      prev && prev > 0 ? Math.round(((price - prev) / prev) * 10000) / 100 : undefined;
    return {
      live: true,
      price,
      changePct,
      week52Low: typeof m.fiftyTwoWeekLow === "number" ? m.fiftyTwoWeekLow : undefined,
      week52High: typeof m.fiftyTwoWeekHigh === "number" ? m.fiftyTwoWeekHigh : undefined,
      history: history.slice(-14),
      currency: m.currency,
      ts: m.regularMarketTime ? m.regularMarketTime * 1000 : undefined,
    };
  } catch {
    return { live: false };
  }
}

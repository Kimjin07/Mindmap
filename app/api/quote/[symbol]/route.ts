import { NextResponse } from "next/server";

/**
 * 实时行情接口（Yahoo Finance 免费公开端点，无需 key，覆盖全球市场）。
 * 前端每分钟轮询刷新股价。交易所 → Yahoo 后缀：
 *   美股 NASDAQ/NYSE 无后缀；港股 .HK；A股 .SS/.SZ；台股 .TW；日 .T；韩 .KS；德 .DE；法 .PA；澳 .AX。
 */
export const dynamic = "force-dynamic";

const EX_SUFFIX: Record<string, string> = {
  NASDAQ: "", NYSE: "", AMEX: "",
  HKEX: ".HK", SSE: ".SS", SZSE: ".SZ", TWSE: ".TW",
  TSE: ".T", KRX: ".KS", ETR: ".DE", EPA: ".PA", ASX: ".AX", LSE: ".L",
};

export async function GET(
  req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const ex = new URL(req.url).searchParams.get("ex") ?? "";
  const suffix = ex in EX_SUFFIX ? EX_SUFFIX[ex] : "";
  const yh = encodeURIComponent(symbol + suffix);

  try {
    // 取近一个月日线：一次调用同时拿到现价、涨跌与走势图数据。
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yh}?range=1mo&interval=1d`,
      { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) return NextResponse.json({ live: false });
    const j = await r.json();
    const res = j?.chart?.result?.[0];
    const m = res?.meta;
    if (!m || typeof m.regularMarketPrice !== "number") {
      return NextResponse.json({ live: false });
    }
    const price = m.regularMarketPrice;

    // 走势图：时间戳 + 收盘价，过滤空值，旧→新。
    const ts: number[] = res?.timestamp ?? [];
    const closes: (number | null)[] = res?.indicators?.quote?.[0]?.close ?? [];
    const history = ts
      .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), price: closes[i] }))
      .filter((p): p is { date: string; price: number } => typeof p.price === "number");

    // 前收盘：优先 meta.previousClose，否则用日线序列里的倒数第二个收盘（即上一交易日）。
    const prev =
      typeof m.previousClose === "number"
        ? m.previousClose
        : history.length >= 2
        ? history[history.length - 2].price
        : undefined;
    const changePct =
      prev && prev > 0 ? Math.round(((price - prev) / prev) * 10000) / 100 : undefined;

    return NextResponse.json({
      live: true,
      price,
      changePct,
      week52Low: typeof m.fiftyTwoWeekLow === "number" ? m.fiftyTwoWeekLow : undefined,
      week52High: typeof m.fiftyTwoWeekHigh === "number" ? m.fiftyTwoWeekHigh : undefined,
      history: history.slice(-14),
      currency: m.currency,
      ts: m.regularMarketTime ? m.regularMarketTime * 1000 : undefined,
    });
  } catch {
    return NextResponse.json({ live: false });
  }
}

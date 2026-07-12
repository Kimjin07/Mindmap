import { NextResponse } from "next/server";

/**
 * 轻量「实时行情」接口，供前端每分钟轮询刷新股价。
 * FMP key 只在服务端使用，不会暴露给浏览器。仅覆盖美股（US-only 档位）。
 */
export const dynamic = "force-dynamic"; // 每次请求都取最新

const BASE = "https://financialmodelingprep.com/stable";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const key = process.env.FMP_API_KEY;
  if (!key || !symbol) return NextResponse.json({ live: false });

  try {
    const r = await fetch(
      `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${key}`,
      { cache: "no-store" }
    );
    if (!r.ok) return NextResponse.json({ live: false });
    const q = (await r.json())?.[0];
    if (!q || typeof q.price !== "number") return NextResponse.json({ live: false });

    return NextResponse.json({
      live: true,
      price: q.price,
      changePct:
        typeof q.changePercentage === "number"
          ? Math.round(q.changePercentage * 100) / 100
          : undefined,
      marketCapB:
        typeof q.marketCap === "number" && q.marketCap > 0
          ? q.marketCap / 1e9
          : undefined,
      week52Low: typeof q.yearLow === "number" ? q.yearLow : undefined,
      week52High: typeof q.yearHigh === "number" ? q.yearHigh : undefined,
      ts: q.timestamp ? q.timestamp * 1000 : undefined,
    });
  } catch {
    return NextResponse.json({ live: false });
  }
}

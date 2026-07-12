import { NextResponse } from "next/server";
import { getCompany } from "../../../data/companies";
import { fetchGoogleNews } from "../../../lib/rss";

/**
 * 实时公司新闻(Google News RSS,免 key)。
 * 按公司中文名搜索中文报道,数量不足时回退英文名搜英文报道;
 * 聚合了彭博、路透、财新等媒体的内容,含垃圾源过滤。服务端缓存 30 分钟。
 */
export const revalidate = 1800;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const c = getCompany(id);
  if (!c) return NextResponse.json({ items: [] });

  // 中文名优先;不足 3 条时补英文报道(去重)
  let items = await fetchGoogleNews(`"${c.name}"`, "zh", 6);
  if (items.length < 3 && c.nameEn && c.nameEn !== c.name) {
    const en = await fetchGoogleNews(`"${c.nameEn}"`, "en", 6 - items.length);
    const seen = new Set(items.map((i) => i.title));
    items = items.concat(en.filter((i) => !seen.has(i.title)));
  }
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return NextResponse.json({ items: items.slice(0, 6) });
}

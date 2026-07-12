import { NextResponse } from "next/server";
import { getCompany } from "../../../data/companies";

/**
 * 实时公司新闻(Google News RSS,免 key)。
 * 按公司中文名搜索中文报道,数量不足时回退英文名搜英文报道;
 * 聚合了彭博、路透、财新等媒体的内容。服务端缓存 30 分钟。
 */
export const revalidate = 1800;

interface NewsItem {
  title: string;
  link: string;
  source?: string;
  date?: string; // YYYY-MM-DD
}

const strip = (s: string) =>
  s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

function parseRss(xml: string, limit: number): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.split("<item>").slice(1);
  for (const b of blocks) {
    const title = b.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = b.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pub = b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    const source = b.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1];
    if (!title || !link) continue;
    let date: string | undefined;
    if (pub) {
      const t = new Date(pub);
      if (!isNaN(t.getTime())) date = t.toISOString().slice(0, 10);
    }
    const src = source ? strip(source) : undefined;
    let t = strip(title);
    // Google News 标题末尾带「 - 来源」,与单独的 source 字段重复,去掉
    if (src && t.endsWith(` - ${src}`)) t = t.slice(0, -(src.length + 3));
    items.push({ title: t, link: strip(link), source: src, date });
    if (items.length >= limit) break;
  }
  return items;
}

async function fetchNews(query: string, lang: "zh" | "en", limit: number): Promise<NewsItem[]> {
  const params =
    lang === "zh"
      ? `hl=zh-CN&gl=CN&ceid=CN:zh-Hans`
      : `hl=en-US&gl=US&ceid=US:en`;
  try {
    const r = await fetch(
      `https://news.google.com/rss/search?q=${encodeURIComponent(`"${query}"`)}&${params}`,
      { next: { revalidate: 1800 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) return [];
    return parseRss(await r.text(), limit);
  } catch {
    return [];
  }
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const c = getCompany(id);
  if (!c) return NextResponse.json({ items: [] });

  // 中文名优先;不足 3 条时补英文报道(去重)
  let items = await fetchNews(c.name, "zh", 6);
  if (items.length < 3 && c.nameEn && c.nameEn !== c.name) {
    const en = await fetchNews(c.nameEn, "en", 6 - items.length);
    const seen = new Set(items.map((i) => i.title));
    items = items.concat(en.filter((i) => !seen.has(i.title)));
  }
  // 按日期倒序
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return NextResponse.json({ items: items.slice(0, 6) });
}

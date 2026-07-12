/**
 * Google News RSS 共享工具:抓取、解析、垃圾源过滤。
 * 供 /api/news/[id](个股新闻)与 /api/news/feed(地图快讯)复用。
 */

export interface RssItem {
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

/** 垃圾来源(SEO 农场/软文站)与软文标题特征。 */
const SPAM_SOURCES = /中华网|商业新知|站长之家|太平洋电脑|极客网|品玩|至顶网营销|软文/;
const SPAM_TITLES = /避坑|口碑|价格透明|代理商|招商|加盟|优惠|促销|排行榜前十|哪家好|多少钱|股吧|讨论区|评论区/;

export function isSpam(title: string, source?: string): boolean {
  if (source && SPAM_SOURCES.test(source)) return true;
  if (SPAM_TITLES.test(title)) return true;
  return false;
}

export function parseRss(xml: string, limit: number): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.split("<item>").slice(1);
  for (const b of blocks) {
    const title = b.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = b.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pub = b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    const source = b.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1];
    if (!title || !link) continue;
    const src = source ? strip(source) : undefined;
    let t = strip(title);
    if (src && t.endsWith(` - ${src}`)) t = t.slice(0, -(src.length + 3));
    let date: string | undefined;
    if (pub) {
      const d = new Date(pub);
      if (!isNaN(d.getTime())) date = d.toISOString().slice(0, 10);
    }
    if (isSpam(t, src)) continue;
    items.push({ title: t, link: strip(link), source: src, date });
    if (items.length >= limit) break;
  }
  return items;
}

export async function fetchGoogleNews(
  query: string,
  lang: "zh" | "en",
  limit: number,
  opts?: { whenDays?: number }
): Promise<RssItem[]> {
  const params = lang === "zh" ? `hl=zh-CN&gl=CN&ceid=CN:zh-Hans` : `hl=en-US&gl=US&ceid=US:en`;
  const q = opts?.whenDays ? `${query} when:${opts.whenDays}d` : query;
  try {
    const r = await fetch(
      `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&${params}`,
      { next: { revalidate: 1800 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) return [];
    return parseRss(await r.text(), limit);
  } catch {
    return [];
  }
}

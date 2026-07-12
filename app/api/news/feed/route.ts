import { NextResponse } from "next/server";
import { COMPANIES } from "../../../data/companies";
import { fetchGoogleNews, type RssItem } from "../../../lib/rss";

/**
 * AI 产业快讯聚合(地图右侧快讯面板)——只取国际(英文)报道。
 * 来源:Google News 英文版(聚合路透/彭博/CNBC 等)多路查询 + 大厂财报专线
 *      + Reddit AI 板块热帖(r/singularity、r/artificial)。
 * 识别标题中提及的图谱内公司(可跳转)。服务端缓存 30 分钟。
 */
export const revalidate = 1800;

const QUERIES: string[] = [
  'Nvidia OR OpenAI OR Anthropic OR "Google DeepMind"',
  "earnings (Nvidia OR Microsoft OR Meta OR Amazon OR TSMC OR Samsung OR AMD)",
  'AI chip OR semiconductor OR HBM OR "data center"',
  'humanoid robot OR robotaxi OR "self-driving"',
  'AI funding OR "AI startup" billion',
];

const HN_AI = /\bAI\b|GPT|LLM|OpenAI|Anthropic|Claude|Gemini|Nvidia|agent|model|robot|neural|GPU/i;

type FeedItem = RssItem & { companies: { id: string; name: string }[] };

/** 公司匹配词表(启动时构建一次):中文词用包含匹配,英文词用词边界匹配。 */
const MATCHERS: { id: string; name: string; zh: string[]; en: RegExp[] }[] = Object.values(
  COMPANIES
).map((c) => {
  const terms = [c.name, c.nameEn, ...(c.aliases || [])].filter(Boolean) as string[];
  const zh: string[] = [];
  const en: RegExp[] = [];
  for (const t of new Set(terms)) {
    if (/[一-鿿]/.test(t)) {
      if (t.length >= 2) zh.push(t);
    } else if (/^[A-Z0-9]{3,6}$/.test(t)) {
      en.push(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`));
    } else if (t.length >= 4) {
      en.push(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"));
    }
  }
  return { id: c.id, name: c.name, zh, en };
});

function matchCompanies(title: string): { id: string; name: string }[] {
  const out: { id: string; name: string }[] = [];
  for (const m of MATCHERS) {
    if (m.zh.some((t) => title.includes(t)) || m.en.some((re) => re.test(title))) {
      out.push({ id: m.id, name: m.name });
      if (out.length >= 3) break;
    }
  }
  return out;
}

/** Hacker News 首页热榜里的 AI 相关帖(Algolia API,免 key;Reddit 屏蔽服务器访问故用 HN 代替)。 */
async function fetchHN(limit: number): Promise<RssItem[]> {
  try {
    const r = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30", {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return [];
    const j = await r.json();
    const out: RssItem[] = [];
    for (const h of j?.hits ?? []) {
      if (!h?.title || !HN_AI.test(h.title)) continue;
      out.push({
        title: h.title,
        link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        source: `Hacker News ▲${h.points ?? 0}`,
        date: h.created_at ? String(h.created_at).slice(0, 10) : undefined,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function GET() {
  const [newsLists, hnList] = await Promise.all([
    Promise.all(QUERIES.map((q) => fetchGoogleNews(q, "en", 10, { whenDays: 2 }))),
    fetchHN(6),
  ]);
  const seen = new Set<string>();
  const dedupe = (list: RssItem[]): FeedItem[] => {
    const out: FeedItem[] = [];
    for (const it of list) {
      const key = it.title.toLowerCase().slice(0, 32);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...it, companies: matchCompanies(it.title) });
    }
    return out;
  };
  // HN 热帖保留固定名额(不被新闻数量挤掉),新闻取剩余名额,最后统一按日期倒序
  const hn = dedupe(hnList);
  const news = dedupe(newsLists.flat()).slice(0, 28 - hn.length);
  const items = [...news, ...hn].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return NextResponse.json({ items });
}

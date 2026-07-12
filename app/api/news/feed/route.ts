import { NextResponse } from "next/server";
import { COMPANIES } from "../../../data/companies";
import { fetchGoogleNews, type RssItem } from "../../../lib/rss";

/**
 * AI 产业快讯聚合(地图右侧快讯面板)。
 * 多路 Google News RSS 查询合并去重,并识别标题中提及的图谱内公司(可跳转)。
 * 服务端缓存 30 分钟。
 */
export const revalidate = 1800;

const QUERIES: { q: string; lang: "zh" | "en" }[] = [
  { q: "人工智能 OR 大模型", lang: "zh" },
  { q: "AI芯片 OR 算力 OR 英伟达", lang: "zh" },
  { q: "人形机器人 OR 自动驾驶", lang: "zh" },
  { q: "OpenAI OR Anthropic OR Nvidia AI", lang: "en" },
];

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

export async function GET() {
  const lists = await Promise.all(
    QUERIES.map(({ q, lang }) => fetchGoogleNews(q, lang, 12, { whenDays: 2 }))
  );
  const seen = new Set<string>();
  const items: (RssItem & { companies: { id: string; name: string }[] })[] = [];
  for (const it of lists.flat()) {
    const key = it.title.slice(0, 24);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ ...it, companies: matchCompanies(it.title) });
  }
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return NextResponse.json({ items: items.slice(0, 24) });
}

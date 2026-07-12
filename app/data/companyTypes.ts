/**
 * 公司数据的类型与纯工具函数(不 import 任何 JSON 数据)。
 * 客户端组件从这里取类型/helper,避免把 1.6MB 的 companies.json 打进浏览器包;
 * 服务端 companies.ts 会 re-export 本模块,旧的服务端 import 路径不受影响。
 */

export interface Financial {
  year: number;
  revenue: number; // 营收，USD B
  netIncome: number; // 净利润，USD B
}

/** 股票 / 行情（对应 schema 的 Market 模块）。 */
export interface Stock {
  exchange: string;
  ticker: string;
  marketCapB?: number; // 市值，USD B
  sharePrice?: number; // 股价
  peRatio?: number; // 市盈率
  grossMargin?: string; // 毛利率，如 "76%"
  revenueTTM?: string; // 近 12 月营收，如 "$248B"
  week52High?: number;
  week52Low?: number;
  dayChangePct?: string; // 当日涨跌，如 "+2.13%"
}

/** 代表性产品 / 平台（对应 schema 的 Products 模块）。 */
export interface CompanyProduct {
  name: string;
  category?: string;
  description?: string;
  status?: string; // GA / Preview / ...
}

/** 一条新闻（对应 schema 的 News 模块）。 */
export interface NewsItem {
  title: string;
  date?: string;
  category?: string;
  summary?: string;
  url?: string;
}

/** 高管（对应 schema 的 Leadership 模块）。 */
export interface Exec {
  name: string;
  title: string;
}

/** 评分（对应 schema 的 Metrics 模块），0–100。 */
export interface Scores {
  ai?: number;
  moat?: number;
  growth?: number;
  innovation?: number;
  community?: number;
}

/** 外链 / 社媒（对应 schema 的 Links 模块）。 */
export interface CompanyLinks {
  docs?: string;
  developer?: string;
  investor?: string;
  blog?: string;
  github?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  discord?: string;
  huggingface?: string;
}

export interface Company {
  id: string;
  name: string;
  nameEn: string;
  oneLiner: string;
  kind: "public" | "private" | "oss"; // 上市 / 未上市 / 开源·学术·联盟
  /**
   * 官方 logo。把文件放到 public/logos/ 后：
   *   logo: true            → 用 /logos/<id>.svg
   *   logo: "/logos/x.png"  → 用指定路径
   *   不填                   → 回退到深色金字字标（不会有白底）
   */
  logo?: boolean | string;
  hq?: string;
  website?: string;
  aliases: string[]; // 把 players 的 `by` / `name` 文案匹配到本公司
  stock?: Stock;
  business: string;
  financials?: Financial[];
  competitors?: string[];

  /* ---- 富信息（对应 AI_Company_Schema.xlsx；均可选，缺省时页面自动隐藏对应区块） ---- */
  tagline?: string; // 一句话 slogan（缺省回退到 oneLiner）
  description?: string; // 公司介绍（缺省回退到 business）
  /* ---- 英文版（供「中/EN」切换；缺省时回退到中文） ---- */
  oneLinerEn?: string;
  taglineEn?: string;
  businessEn?: string;
  descriptionEn?: string;
  foundedYear?: number;
  employees?: string; // 如 "36,000+"
  country?: string;
  status?: string; // Active / Acquired / IPO
  coverImage?: string;
  industry?: string; // 如 "AI 基础设施"
  subcategory?: string; // 如 "GPU"
  role?: string; // 在产业链中的角色
  aiScore?: number; // AI Score，0–100（缺省回退到 scores.ai）
  whyItMatters?: string[]; // 「为什么重要」要点
  scores?: Scores;
  products?: CompanyProduct[];
  keyCustomers?: string[]; // 公司 id 优先，找不到则按原文显示
  partners?: string[];
  suppliers?: string[];
  relatedCompanies?: string[];
  investors?: string[];
  leadership?: Exec[];
  news?: NewsItem[];
  links?: CompanyLinks;
  tags?: string[];
}

export type Lang = "zh" | "en";

/** 标语：优先 tagline，回退到 oneLiner；英文优先 En 字段。 */
export const companyTagline = (c: Company, lang: Lang = "zh"): string =>
  lang === "en"
    ? c.taglineEn ?? c.oneLinerEn ?? c.tagline ?? c.oneLiner
    : c.tagline ?? c.oneLiner;
/** 介绍：优先 description，回退到 business；英文优先 En 字段。 */
export const companyDescription = (c: Company, lang: Lang = "zh"): string =>
  lang === "en"
    ? c.descriptionEn ?? c.businessEn ?? c.description ?? c.business
    : c.description ?? c.business;
/** 是否有人工英文简介。 */
export const hasEnglishDescription = (c: Company): boolean =>
  !!(c.descriptionEn ?? c.businessEn);
/** AI Score：优先 aiScore，回退到 scores.ai。 */
export const companyAiScore = (c: Company): number | undefined => c.aiScore ?? c.scores?.ai;

export const KIND_LABEL: Record<Company["kind"], string> = {
  public: "上市公司",
  private: "未上市",
  oss: "开源 / 学术",
};

"use client";

/**
 * 公司详情的「纯展示」组件，被两处复用：
 *   ① /company/[id] 独立页（variant="page"，带实时数据 live）
 *   ② 世界地图左侧抽屉（variant="panel"，点关联公司在抽屉内切换，不跳页）
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COMPANIES, KIND_LABEL,
  companyTagline, companyDescription, companyAiScore,
  type Company, type Lang,
} from "../data/companies";
import { NODES } from "../data/nodes";
import { productsOfCompany } from "../data/players";
import CompanyLogo from "./CompanyLogo";

/** 该节点在世界地图上的回跳链接（定位到对应城市）。 */
function nodeHref(nodeId: string): string {
  const n = NODES[nodeId];
  if (!n) return "/map";
  const layer = n.type === "layer" ? n.id : n.parentId;
  return `/map/${layer}#${nodeId}`;
}

const fmtCap = (b?: number) => {
  if (b == null) return "—";
  if (b >= 1000) return `$${(b / 1000).toFixed(2)}T`;
  if (b < 1) return `$${(b * 1000).toFixed(0)}M`;
  return `$${b.toFixed(0)}B`;
};
// 自适应量级：大额用 B/T、小于 10 亿用 M，负值(亏损)保留符号
const fmtB = (v: number) => {
  const sign = v < 0 ? "-" : "";
  const a = Math.abs(v);
  if (a === 0) return "$0";
  if (a < 1) return `${sign}$${(a * 1000).toFixed(0)}M`;
  if (a < 10) return `${sign}$${a.toFixed(1)}B`;
  return `${sign}$${Math.round(a)}B`;
};
const fmtPrice = (p?: number) => (p == null ? "—" : `$${p.toFixed(2)}`);
// 价格数字：≥1000 用千分位整数(如 ₩285,000),否则两位小数(如 43.04)
const fmtNum = (v: number) => (v >= 1000 ? Math.round(v).toLocaleString("en-US") : v.toFixed(2));

function Stars({ score }: { score: number }) {
  const full = Math.max(0, Math.min(5, Math.round(score / 20)));
  return (
    <span className="cp-stars" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < full ? "on" : ""}>★</span>
      ))}
    </span>
  );
}

const SCORE_LABELS: { key: keyof NonNullable<Company["scores"]>; label: string }[] = [
  { key: "ai", label: "AI" },
  { key: "moat", label: "护城河" },
  { key: "growth", label: "成长" },
  { key: "innovation", label: "创新" },
  { key: "community", label: "社区" },
];

/** 近一周股价走势的简易折线图。 */
function MiniChart({ data }: { data: { date: string; price: number }[] }) {
  const W = 280, H = 70, pad = 7;
  const prices = data.map((d) => d.price);
  const n = prices.length;
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (p: number) => pad + (1 - (p - min) / span) * (H - 2 * pad);
  const line = prices.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(" ");
  const up = prices[n - 1] >= prices[0];
  const pct = prices[0] ? ((prices[n - 1] - prices[0]) / prices[0]) * 100 : 0;
  const color = up ? "#3ecf8e" : "#e06b6b";
  return (
    <div className="cp-chart">
      <div className="cp-chart-head">
        <span>近一周走势</span>
        <span className={up ? "up" : "down"}>
          {up ? "+" : ""}{pct.toFixed(2)}%
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="cp-chart-svg">
        <path d={`${line} L ${x(n - 1)} ${H - pad} L ${x(0)} ${H - pad} Z`} fill={color} opacity="0.12" />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="cp-chart-foot">
        <span>{data[0].date}</span>
        <span>{data[n - 1].date}</span>
      </div>
    </div>
  );
}

export interface CompanyDetailProps {
  c: Company;
  /** 抽屉模式下：点关联公司 → 在抽屉内切换，而不是跳转。 */
  onOpenCompany?: (id: string) => void;
  /** 抽屉模式下：点地图环节 → 让地图飞过去，而不是跳转。 */
  onGotoNode?: (nodeId: string) => void;
}

export default function CompanyDetail({ c, onOpenCompany, onGotoNode }: CompanyDetailProps) {
  // 中/EN 语言切换（记忆在 localStorage，跨公司/跨页保持）。
  const [lang, setLang] = useState<Lang>("zh");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cp-lang");
      if (saved === "en" || saved === "zh") setLang(saved);
    } catch {}
  }, []);
  const changeLang = (l: Lang) => {
    setLang(l);
    try { window.localStorage.setItem("cp-lang", l); } catch {}
  };
  const en = lang === "en";

  // 实时股价：任何有股票代码的公司都轮询 Yahoo（全球市场），每 60 秒刷新一次（仅标签页可见时）。
  type LiveQuote = { price?: number; changePct?: number; marketCapB?: number; week52Low?: number; week52High?: number; history?: { date: string; price: number }[]; currency?: string; ts?: number };
  const [liveQuote, setLiveQuote] = useState<LiveQuote | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  useEffect(() => {
    setLiveQuote(null);
    setUpdatedAt(null);
    const ticker = c.stock?.ticker;
    if (!ticker) return;
    const ex = c.stock?.exchange ?? "";
    let stopped = false;
    const load = async () => {
      try {
        const r = await fetch(
          `/api/quote/${encodeURIComponent(ticker)}?ex=${encodeURIComponent(ex)}`,
          { cache: "no-store" }
        );
        const j = await r.json();
        if (!stopped && j?.live) {
          setLiveQuote(j as LiveQuote);
          setUpdatedAt(Date.now());
        }
      } catch {}
    };
    load();
    const id = setInterval(() => {
      if (typeof document === "undefined" || document.visibilityState === "visible") load();
    }, 60_000);
    return () => { stopped = true; clearInterval(id); };
  }, [c.id, c.stock?.ticker, c.stock?.exchange]);

  // 货币符号（Yahoo 返回本地货币；美股为 USD）。
  const CUR_SYM: Record<string, string> = {
    USD: "$", HKD: "HK$", CNY: "¥", TWD: "NT$", JPY: "¥", KRW: "₩", EUR: "€", GBP: "£", AUD: "A$",
  };
  const curSym = CUR_SYM[liveQuote?.currency ?? "USD"] ?? "$";
  const isLive = !!liveQuote;

  const chainIds = new Set<string>();
  Object.values(NODES).forEach((n) => {
    if (n.companyIds.includes(c.id)) chainIds.add(n.id);
  });
  productsOfCompany(c.id).forEach((s) => chainIds.add(s.cityId));
  const chainNodes = [...chainIds].map((nid) => NODES[nid]).filter(Boolean);

  const marketCapB = liveQuote?.marketCapB ?? c.stock?.marketCapB;
  const financials = c.financials;
  const price = liveQuote?.price ?? c.stock?.sharePrice;
  const peRatio = c.stock?.peRatio;
  const changePctNum = liveQuote?.changePct;
  const dayChangePct =
    changePctNum != null
      ? `${changePctNum > 0 ? "+" : ""}${changePctNum.toFixed(2)}%`
      : c.stock?.dayChangePct;
  const week52Low = liveQuote?.week52Low ?? c.stock?.week52Low;
  const week52High = liveQuote?.week52High ?? c.stock?.week52High;
  const employees = c.employees;
  const leadership = c.leadership ?? [];

  const tagline = companyTagline(c, lang);
  const description = companyDescription(c, lang);
  const aboutText = description;
  const aiScore = companyAiScore(c);

  const fallbackProducts = productsOfCompany(c.id);
  const hasOwnProducts = !!(c.products && c.products.length);
  const badges = [c.subcategory, c.industry, KIND_LABEL[c.kind]].filter(Boolean) as string[];

  const linkNav: { label: string; href: string }[] = [
    c.website && { label: "官网", href: `https://${c.website}` },
    c.links?.investor && { label: "投资者关系", href: c.links.investor },
    c.links?.developer && { label: "开发者文档", href: c.links.developer },
    c.links?.docs && { label: "文档", href: c.links.docs },
    c.links?.blog && { label: "博客", href: c.links.blog },
    c.links?.github && { label: "GitHub", href: c.links.github },
    c.links?.linkedin && { label: "LinkedIn", href: c.links.linkedin },
    c.links?.x && { label: "X", href: c.links.x },
    c.links?.youtube && { label: "YouTube", href: c.links.youtube },
    c.links?.huggingface && { label: "Hugging Face", href: c.links.huggingface },
    c.links?.discord && { label: "Discord", href: c.links.discord },
  ].filter(Boolean) as { label: string; href: string }[];

  const showIndustryPos = !!(c.industry || c.subcategory || c.role || (c.whyItMatters && c.whyItMatters.length));
  const showMarket = !!c.stock;

  /** 公司引用 chip：抽屉模式内切换，页面模式跳转。 */
  const CompanyRef = ({ refId }: { refId: string }) => {
    const rc = COMPANIES[refId];
    if (rc) {
      const inner = (
        <>
          <CompanyLogo companyId={rc.id} size={26} />
          <span>{rc.name}</span>
        </>
      );
      return onOpenCompany ? (
        <button type="button" className="cp-ref" onClick={() => onOpenCompany(rc.id)}>
          {inner}
        </button>
      ) : (
        <Link href={`/company/${rc.id}`} className="cp-ref">
          {inner}
        </Link>
      );
    }
    return (
      <span className="cp-ref plain">
        <span className="cp-ref-dot" />
        <span>{refId}</span>
      </span>
    );
  };

  const RefColumn = ({ title, refs }: { title: string; refs?: string[] }) => {
    if (!refs || refs.length === 0) return null;
    return (
      <div className="cp-refcol">
        <h3>{title}</h3>
        <div className="cp-reflist">
          {refs.map((r) => (
            <CompanyRef key={r} refId={r} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ---------- 头部 ---------- */}
      <header className="cp-hero">
        <div className="cp-hero-top">
          <div className="cp-id">
            <CompanyLogo companyId={c.id} size={64} />
            <div className="cp-id-text">
              <div className="cp-name-row">
                <h1>{c.name}</h1>
                {c.status && <span className="cp-status" title={c.status} />}
                <span className={`kind-badge ${c.kind}`}>{KIND_LABEL[c.kind]}</span>
              </div>
              <span className="company-en">{c.nameEn}</span>
              {aiScore != null && (
                <div className="cp-score">
                  <Stars score={aiScore} />
                  <span>
                    AI Score <b>{aiScore}</b>/100
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="cp-hero-actions">
            <div className="cp-lang" role="group" aria-label="语言 / language">
              <button
                type="button"
                className={!en ? "on" : ""}
                onClick={() => changeLang("zh")}
                aria-pressed={!en}
              >
                中
              </button>
              <button
                type="button"
                className={en ? "on" : ""}
                onClick={() => changeLang("en")}
                aria-pressed={en}
              >
                EN
              </button>
            </div>
            {c.stock && (
              <div className="ticker">
                <span className="ticker-ex">{c.stock.exchange}</span>
                <span className="ticker-sym">{c.stock.ticker}</span>
              </div>
            )}
            {c.website && (
              <a className="cp-btn primary" href={`https://${c.website}`} target="_blank" rel="noreferrer">
                访问官网 →
              </a>
            )}
          </div>
        </div>

        <p className="cp-tagline">{tagline}</p>

        {badges.length > 0 && (
          <div className="cp-badges">
            {badges.map((b) => (
              <span key={b} className="cp-badge">{b}</span>
            ))}
          </div>
        )}

        <div className="company-meta cp-meta">
          {c.hq && <span>🏛 {c.hq}</span>}
          {c.foundedYear && <span>📅 成立于 {c.foundedYear}</span>}
          {employees && <span>👥 {employees} 员工</span>}
        </div>

        {linkNav.length > 0 && (
          <div className="cp-linknav">
            {linkNav.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="cp-link">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ---------- 两栏主体 ---------- */}
      <div className="cp-grid">
        <div className="cp-col-main">
          <section className="company-card">
            <h2>{en ? `About ${c.nameEn}` : `关于${c.name}`}</h2>
            <p className="company-business">{aboutText}</p>
          </section>

          {c.news && c.news.length > 0 && (
            <section className="company-card">
              <h2>最新动态</h2>
              <div className="cp-news">
                {[...c.news].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((n, i) => {
                  const inner = (
                    <>
                      <div className="cp-news-meta">
                        {n.category && <span className="cp-news-cat">{n.category}</span>}
                        {n.date && <span className="cp-news-date">{n.date}</span>}
                      </div>
                      <span className="cp-news-title">{n.title}</span>
                      {n.summary && <p className="cp-news-sum">{n.summary}</p>}
                    </>
                  );
                  return n.url ? (
                    <a key={i} className="cp-news-item link" href={n.url} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="cp-news-item">{inner}</div>
                  );
                })}
              </div>
            </section>
          )}

          {showMarket && (
            <section className="company-card">
              <h2>
                {en ? "Stock" : "股票表现"}
                {isLive && (
                  <span className={`live-badge${liveQuote ? " pulse" : ""}`}>
                    ● {en ? "live" : "实时"}
                  </span>
                )}
                {updatedAt && (
                  <span className="live-time">
                    {en ? "updated " : "更新于 "}
                    {new Date(updatedAt).toLocaleTimeString(en ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </h2>
              <div className="cp-stat-grid">
                <div className="cp-stat">
                  <span className="stat-k">市值{liveQuote?.marketCapB != null ? "" : "（约值）"}</span>
                  <span className="stat-v">{fmtCap(marketCapB)}</span>
                </div>
                <div className="cp-stat">
                  <span className="stat-k">股价</span>
                  <span className="stat-v">{price == null ? "—" : `${curSym}${fmtNum(price)}`}</span>
                </div>
                {dayChangePct && (
                  <div className="cp-stat">
                    <span className="stat-k">当日</span>
                    <span className={`stat-v ${dayChangePct.startsWith("-") ? "down" : "up"}`}>
                      {dayChangePct}
                    </span>
                  </div>
                )}
                {peRatio != null && (
                  <div className="cp-stat">
                    <span className="stat-k">市盈率 P/E</span>
                    <span className="stat-v">{peRatio}</span>
                  </div>
                )}
                {c.stock?.grossMargin && (
                  <div className="cp-stat">
                    <span className="stat-k">毛利率</span>
                    <span className="stat-v">{c.stock.grossMargin}</span>
                  </div>
                )}
                {c.stock?.revenueTTM && (
                  <div className="cp-stat">
                    <span className="stat-k">营收 (TTM)</span>
                    <span className="stat-v">{c.stock.revenueTTM}</span>
                  </div>
                )}
                {week52Low != null && week52High != null && (
                  <div className="cp-stat">
                    <span className="stat-k">52 周区间</span>
                    <span className="stat-v">
                      {curSym}{fmtNum(week52Low)} – {curSym}{fmtNum(week52High)}
                    </span>
                  </div>
                )}
                <div className="cp-stat">
                  <span className="stat-k">交易所 / 代码</span>
                  <span className="stat-v mono">
                    {c.stock!.exchange}:{c.stock!.ticker}
                  </span>
                </div>
              </div>
              {(() => {
                const hist = liveQuote?.history;
                return hist && hist.length >= 2 ? <MiniChart data={hist} /> : null;
              })()}
            </section>
          )}

          {(hasOwnProducts || fallbackProducts.length > 0) && (
            <section className="company-card">
              <h2>产品与平台</h2>
              <div className="cp-products">
                {hasOwnProducts
                  ? c.products!.map((p) => (
                      <div key={p.name} className="cp-product">
                        <div className="cp-product-top">
                          <span className="cp-product-name">{p.name}</span>
                          {p.status && <span className="cp-product-status">{p.status}</span>}
                        </div>
                        {p.category && <span className="cp-product-cat">{p.category}</span>}
                        {p.description && <p className="cp-product-desc">{p.description}</p>}
                      </div>
                    ))
                  : fallbackProducts.map((p, i) => {
                      const inner = (
                        <>
                          <div className="cp-product-top">
                            <span className="cp-product-name">{p.name}</span>
                          </div>
                          <span className="cp-product-cat">{NODES[p.cityId]?.name}</span>
                          {p.note && <p className="cp-product-desc">{p.note}</p>}
                        </>
                      );
                      return onGotoNode ? (
                        <button
                          key={`${p.name}-${i}`}
                          type="button"
                          className="cp-product link"
                          onClick={() => onGotoNode(p.cityId)}
                        >
                          {inner}
                        </button>
                      ) : (
                        <Link key={`${p.name}-${i}`} href={nodeHref(p.cityId)} className="cp-product link">
                          {inner}
                        </Link>
                      );
                    })}
              </div>
            </section>
          )}

          {financials && financials.length > 0 && (
            <section className="company-card">
              <h2>
                {en ? "Financials" : "财务（近年数据）"}
              </h2>
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>年度</th>
                    <th>营收</th>
                    <th>同比</th>
                    <th>净利润</th>
                    <th>净利率</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((f, i) => {
                    const prev = i > 0 ? financials[i - 1] : null;
                    const yoy = prev && prev.revenue > 0 ? (f.revenue / prev.revenue - 1) * 100 : null;
                    return (
                    <tr key={f.year}>
                      <td>{f.year}</td>
                      <td>{fmtB(f.revenue)}</td>
                      <td className={yoy == null ? "" : yoy >= 0 ? "up" : "down"}>
                        {yoy == null ? "—" : `${yoy > 0 ? "+" : ""}${yoy.toFixed(0)}%`}
                      </td>
                      <td className={f.netIncome < 0 ? "neg" : ""}>{fmtB(f.netIncome)}</td>
                      <td>
                        {f.revenue && Math.abs(f.netIncome / f.revenue) < 5
                          ? `${((f.netIncome / f.revenue) * 100).toFixed(0)}%`
                          : "—"}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

        </div>

        <aside className="cp-col-side">
          {showIndustryPos && (
            <section className="company-card">
              <h2>产业链定位</h2>
              <div className="cp-pos">
                {c.industry && (
                  <div className="cp-pos-row"><span>行业</span><b>{c.industry}</b></div>
                )}
                {c.subcategory && (
                  <div className="cp-pos-row"><span>细分</span><b>{c.subcategory}</b></div>
                )}
                {c.role && (
                  <div className="cp-pos-row"><span>角色</span><b>{c.role}</b></div>
                )}
              </div>
              {c.whyItMatters && c.whyItMatters.length > 0 && (
                <div className="cp-why">
                  <h3>为什么重要</h3>
                  <ul>
                    {c.whyItMatters.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {c.scores && (
            <section className="company-card">
              <h2>关键评分</h2>
              <div className="cp-scores">
                {SCORE_LABELS.map(({ key, label }) => {
                  const v = c.scores![key];
                  if (v == null) return null;
                  return (
                    <div key={key} className="cp-scorebar">
                      <div className="cp-scorebar-head">
                        <span>{label}</span>
                        <b>{v}</b>
                      </div>
                      <div className="cp-scorebar-track">
                        <div className="cp-scorebar-fill" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {(c.keyCustomers?.length ||
            c.competitors?.length ||
            c.relatedCompanies?.length ||
            c.partners?.length ||
            c.suppliers?.length ||
            c.investors?.length) ? (
            <section className="company-card">
              <h2>关系网络</h2>
              <RefColumn title="投资方 / 股东" refs={c.investors} />
              <RefColumn title="重要客户" refs={c.keyCustomers} />
              <RefColumn title="主要竞争对手" refs={c.competitors} />
              <RefColumn title="合作伙伴" refs={c.partners} />
              <RefColumn title="上游供应" refs={c.suppliers} />
              <RefColumn title="相关公司" refs={c.relatedCompanies} />
            </section>
          ) : null}

          {leadership.length > 0 && (
            <section className="company-card">
              <h2>领导团队</h2>
              <div className="cp-leaders">
                {leadership.map((e) => (
                  <div key={e.name} className="cp-leader">
                    <b>{e.name}</b>
                    <span>{e.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {chainNodes.length > 0 && (
            <section className="company-card">
              <h2>地图中的环节</h2>
              <p className="card-hint">
                {onGotoNode ? "点击在地图上定位：" : "点击回到世界地图对应城市："}
              </p>
              <div className="chain-chips">
                {chainNodes.map((n) =>
                  onGotoNode ? (
                    <button key={n.id} type="button" className="chain-chip" onClick={() => onGotoNode(n.id)}>
                      {n.name}
                      <span>{n.nameEn}</span>
                    </button>
                  ) : (
                    <Link key={n.id} href={nodeHref(n.id)} className="chain-chip">
                      {n.name}
                      <span>{n.nameEn}</span>
                    </Link>
                  )
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

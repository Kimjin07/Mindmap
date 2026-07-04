"use client";

/**
 * 公司详情的「纯展示」组件，被两处复用：
 *   ① /company/[id] 独立页（variant="page"，带实时数据 live）
 *   ② 世界地图左侧抽屉（variant="panel"，点关联公司在抽屉内切换，不跳页）
 */

import Link from "next/link";
import {
  COMPANIES, KIND_LABEL,
  companyTagline, companyDescription, companyAiScore, type Company,
} from "../data/companies";
import { NODES } from "../data/nodes";
import { productsOfCompany } from "../data/players";
import type { LiveData } from "../lib/market";
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
  return b >= 1000 ? `$${(b / 1000).toFixed(2)}T` : `$${b.toFixed(0)}B`;
};
const fmtB = (v: number) => `$${v.toFixed(1)}B`;
const fmtPrice = (p?: number) => (p == null ? "—" : `$${p.toFixed(2)}`);

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

export interface CompanyDetailProps {
  c: Company;
  live?: LiveData;
  /** 抽屉模式下：点关联公司 → 在抽屉内切换，而不是跳转。 */
  onOpenCompany?: (id: string) => void;
  /** 抽屉模式下：点地图环节 → 让地图飞过去，而不是跳转。 */
  onGotoNode?: (nodeId: string) => void;
}

export default function CompanyDetail({ c, live, onOpenCompany, onGotoNode }: CompanyDetailProps) {
  const chainIds = new Set<string>();
  Object.values(NODES).forEach((n) => {
    if (n.companyIds.includes(c.id)) chainIds.add(n.id);
  });
  productsOfCompany(c.id).forEach((s) => chainIds.add(s.cityId));
  const chainNodes = [...chainIds].map((nid) => NODES[nid]).filter(Boolean);

  const marketCapB = live?.marketCapB ?? c.stock?.marketCapB;
  const financials = live?.financials && live.financials.length ? live.financials : c.financials;
  const finLive = !!(live?.financials && live.financials.length);
  const price = live?.price ?? c.stock?.sharePrice;

  const tagline = companyTagline(c);
  const description = companyDescription(c);
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
          {c.employees && <span>👥 {c.employees} 员工</span>}
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
            <h2>关于{c.name}</h2>
            <p className="company-business">{description}</p>
          </section>

          {showMarket && (
            <section className="company-card">
              <h2>
                股票表现
                {live?.live && <span className="live-badge">● 实时</span>}
              </h2>
              <div className="cp-stat-grid">
                <div className="cp-stat">
                  <span className="stat-k">市值{live?.marketCapB != null ? "" : "（约值）"}</span>
                  <span className="stat-v">{fmtCap(marketCapB)}</span>
                </div>
                <div className="cp-stat">
                  <span className="stat-k">股价</span>
                  <span className="stat-v">{fmtPrice(price)}</span>
                </div>
                {c.stock?.dayChangePct && (
                  <div className="cp-stat">
                    <span className="stat-k">当日</span>
                    <span className={`stat-v ${c.stock.dayChangePct.startsWith("-") ? "down" : "up"}`}>
                      {c.stock.dayChangePct}
                    </span>
                  </div>
                )}
                {c.stock?.peRatio != null && (
                  <div className="cp-stat">
                    <span className="stat-k">市盈率 P/E</span>
                    <span className="stat-v">{c.stock.peRatio}</span>
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
                {c.stock?.week52Low != null && c.stock?.week52High != null && (
                  <div className="cp-stat">
                    <span className="stat-k">52 周区间</span>
                    <span className="stat-v">
                      ${c.stock.week52Low} – ${c.stock.week52High}
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
                {finLive ? "财务（实时财报）" : "财务（近年约值）"}
                {finLive && <span className="live-badge">● 实时</span>}
              </h2>
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>年度</th>
                    <th>营收</th>
                    <th>净利润</th>
                    <th>净利率</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((f) => (
                    <tr key={f.year}>
                      <td>{f.year}</td>
                      <td>{fmtB(f.revenue)}</td>
                      <td className={f.netIncome < 0 ? "neg" : ""}>{fmtB(f.netIncome)}</td>
                      <td>{f.revenue ? ((f.netIncome / f.revenue) * 100).toFixed(0) : "—"}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {c.news && c.news.length > 0 && (
            <section className="company-card">
              <h2>最新动态</h2>
              <div className="cp-news">
                {c.news.map((n, i) => {
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
            c.suppliers?.length) ? (
            <section className="company-card">
              <h2>关系网络</h2>
              <RefColumn title="重要客户" refs={c.keyCustomers} />
              <RefColumn title="主要竞争对手" refs={c.competitors} />
              <RefColumn title="合作伙伴" refs={c.partners} />
              <RefColumn title="上游供应" refs={c.suppliers} />
              <RefColumn title="相关公司" refs={c.relatedCompanies} />
            </section>
          ) : null}

          {c.leadership && c.leadership.length > 0 && (
            <section className="company-card">
              <h2>领导团队</h2>
              <div className="cp-leaders">
                {c.leadership.map((e) => (
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

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  COMPANIES, getCompany, allCompanyIds, nodesForCompany, KIND_LABEL,
} from "../../data/companies";
import { NODES } from "../../data/nodes";
import { productsOfCompany } from "../../data/players";
import CompanyLogo from "../../components/CompanyLogo";
import { getLiveData } from "../../lib/market";

export function generateStaticParams() {
  return allCompanyIds().map((id) => ({ id }));
}

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

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCompany(id);
  if (!c) notFound();

  // 「在产业链中的位置」：合并 ① 节点显式关联的公司 ② 该公司有产品入驻的城市
  const chainIds = new Set<string>();
  nodesForCompany(c.id).forEach((n) => chainIds.add(n.id));
  productsOfCompany(c.id).forEach((s) => chainIds.add(s.cityId));
  const chainNodes = [...chainIds].map((nid) => NODES[nid]).filter(Boolean);

  // 实时行情 / 财报（有 FMP_API_KEY 时生效，否则回退到约值）
  const live = await getLiveData(c);
  const marketCapB = live.marketCapB ?? c.stock?.marketCapB;
  const financials = live.financials && live.financials.length ? live.financials : c.financials;
  const finLive = !!(live.financials && live.financials.length);

  return (
    <main className="company-page">
      <nav className="company-crumb">
        <Link href="/map">← AI 产业链世界地图</Link>
      </nav>

      <header className="company-head">
        <div className="company-head-l">
          <CompanyLogo companyId={c.id} size={52} />
          <div>
            <div className="company-name-row">
              <h1>{c.name}</h1>
              <span className={`kind-badge ${c.kind}`}>{KIND_LABEL[c.kind]}</span>
            </div>
            <span className="company-en">{c.nameEn}</span>
          </div>
        </div>
        {c.stock && (
          <div className="ticker">
            <span className="ticker-ex">{c.stock.exchange}</span>
            <span className="ticker-sym">{c.stock.ticker}</span>
          </div>
        )}
      </header>

      <p className="company-oneliner">{c.oneLiner}</p>

      <div className="company-meta">
        {c.hq && <span>🏛 {c.hq}</span>}
        {c.website && (
          <a href={`https://${c.website}`} target="_blank" rel="noreferrer">
            🔗 {c.website}
          </a>
        )}
      </div>

      {/* 股票信息 */}
      {c.stock && (
        <section className="company-card stock">
          <h2>
            股票信息
            {live.live && <span className="live-badge">● 实时</span>}
          </h2>
          <div className="stat-row">
            <div className="stat">
              <span className="stat-k">交易所</span>
              <span className="stat-v">{c.stock.exchange}</span>
            </div>
            <div className="stat">
              <span className="stat-k">股票代码</span>
              <span className="stat-v mono">{c.stock.ticker}</span>
            </div>
            {live.price != null && (
              <div className="stat">
                <span className="stat-k">现价</span>
                <span className="stat-v">{fmtPrice(live.price)}</span>
              </div>
            )}
            <div className="stat">
              <span className="stat-k">市值{live.marketCapB != null ? "" : "（约值）"}</span>
              <span className="stat-v">{fmtCap(marketCapB)}</span>
            </div>
          </div>
        </section>
      )}

      {/* 在产业链中的位置 */}
      {chainNodes.length > 0 && (
        <section className="company-card">
          <h2>在产业链中的位置</h2>
          <p className="card-hint">该公司涉及以下环节，点击回到世界地图对应城市：</p>
          <div className="chain-chips">
            {chainNodes.map((n) => (
              <Link key={n.id} href={nodeHref(n.id)} className="chain-chip">
                {n.name}
                <span>{n.nameEn}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 业务 */}
      <section className="company-card">
        <h2>业务拆解</h2>
        <p className="company-business">{c.business}</p>
      </section>

      {/* 财务 */}
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

      {/* 竞争格局 */}
      {c.competitors && c.competitors.length > 0 && (
        <section className="company-card">
          <h2>竞争格局</h2>
          <div className="chain-chips">
            {c.competitors
              .filter((cid) => COMPANIES[cid])
              .map((cid) => (
                <Link key={cid} href={`/company/${cid}`} className="chain-chip">
                  {COMPANIES[cid].name}
                  <span>{COMPANIES[cid].nameEn}</span>
                </Link>
              ))}
          </div>
        </section>
      )}

      <p className="company-disclaimer">
        {live.live
          ? "数据来自 Financial Modeling Prep（缓存约 1 小时）。未上市公司及非美股暂无实时数据。"
          : "⚠️ 财务为近年年报的约值（量级正确、非实时）；市值为约值。设置 FMP_API_KEY 后将自动接入实时行情 / 财报（见 app/lib/market.ts）。"}
      </p>
    </main>
  );
}

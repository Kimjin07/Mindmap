import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, allCompanyIds } from "../../data/companies";
import { getQuote } from "../../lib/quote";
import CompanyDetail from "../../components/CompanyDetail";

export function generateStaticParams() {
  return allCompanyIds().map((id) => ({ id }));
}

/** 每家公司独立的 SEO 标题与描述(否则 354 页共用同一标题)。 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCompany(id);
  if (!c) return {};
  const title =
    c.nameEn && c.nameEn !== c.name ? `${c.name} (${c.nameEn})` : c.name;
  return {
    title: `${title} | The AI Stack`,
    description: c.oneLiner || c.business,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCompany(id);
  if (!c) notFound();

  // 服务端预取行情：首屏直接显示股价(缓存 60s),客户端再轮询刷新
  const initialQuote = c.stock ? await getQuote(c.stock.exchange, c.stock.ticker) : null;

  return (
    <main className="company-page wide">
      <nav className="company-crumb">
        <Link href="/map">← AI 产业链世界地图</Link>
      </nav>

      <CompanyDetail c={c} initialQuote={initialQuote} />

      <p className="company-disclaimer">
        ⚠️ 富信息字段（产品 / 评分 / 关系 / 新闻等）为人工维护内容，部分为示例值；财务与市值为近年数据（量级正确）。
        实时股价 / 涨跌 / 走势由 Yahoo Finance 免费接口提供（覆盖全球市场）。
      </p>
    </main>
  );
}

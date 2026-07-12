import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, allCompanyIds } from "../../data/companies";
import CompanyDetail from "../../components/CompanyDetail";

export function generateStaticParams() {
  return allCompanyIds().map((id) => ({ id }));
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCompany(id);
  if (!c) notFound();

  return (
    <main className="company-page wide">
      <nav className="company-crumb">
        <Link href="/map">← AI 产业链世界地图</Link>
      </nav>

      <CompanyDetail c={c} />

      <p className="company-disclaimer">
        ⚠️ 富信息字段（产品 / 评分 / 关系 / 新闻等）为人工维护内容，部分为示例值；财务与市值为近年数据（量级正确）。
        实时股价 / 涨跌 / 走势由 Yahoo Finance 免费接口提供（覆盖全球市场）。
      </p>
    </main>
  );
}

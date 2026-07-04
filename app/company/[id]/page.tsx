import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, allCompanyIds } from "../../data/companies";
import { getLiveData } from "../../lib/market";
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

  // 实时行情 / 财报（有 FMP_API_KEY 时生效，否则回退到约值）
  const live = await getLiveData(c);

  return (
    <main className="company-page wide">
      <nav className="company-crumb">
        <Link href="/map">← AI 产业链世界地图</Link>
      </nav>

      <CompanyDetail c={c} live={live} />

      <p className="company-disclaimer">
        {live.live
          ? "数据来自 Financial Modeling Prep（缓存约 1 小时）。未上市公司及非美股暂无实时数据。"
          : "⚠️ 富信息字段（产品 / 评分 / 关系 / 新闻等）按 AI_Company_Schema 结构维护，部分为示例值；财务与市值为近年约值（量级正确、非实时）。设置 FMP_API_KEY 后将自动接入实时行情 / 财报（见 app/lib/market.ts）。"}
      </p>
    </main>
  );
}

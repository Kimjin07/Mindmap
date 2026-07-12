import type { MetadataRoute } from "next";
import { allCompanyIds } from "./data/companies";

/** 站点地图:首页 + 地图 + 全部 354 个公司页(部署后设 NEXT_PUBLIC_SITE_URL)。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/map`, changeFrequency: "daily", priority: 0.9 },
    ...allCompanyIds().map((id) => ({
      url: `${base}/company/${id}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}

/**
 * 浏览器端安全的公司数据(瘦版,~53KB):只含名称/别名/kind/hq/官网/logo。
 * 由 scripts/gen-slim.mjs 从 companies.json 生成(predev/prebuild 自动跑)。
 * 完整公司数据请走服务端 companies.ts 或 /api/company/[id]。
 */

import slimData from "./companies.slim.json";

export interface SlimCompany {
  name: string;
  nameEn: string;
  kind: "public" | "private" | "oss";
  aliases?: string[];
  hq?: string;
  website?: string;
  logo?: boolean | string;
}

export const SLIM: Record<string, SlimCompany> = slimData as unknown as Record<
  string,
  SlimCompany
>;

/** 别名 → 公司 id 的索引(含中文名、英文名、aliases)。 */
const ALIAS_INDEX: Record<string, string> = (() => {
  const idx: Record<string, string> = {};
  for (const [id, c] of Object.entries(SLIM)) {
    idx[c.name.toLowerCase()] = id;
    idx[c.nameEn.toLowerCase()] = id;
    for (const a of c.aliases ?? []) idx[a.toLowerCase()] = id;
  }
  return idx;
})();

/** 把一段文案(players 的 by 或 name)解析到公司 id。 */
export const companyIdByName = (s?: string): string | undefined =>
  s ? ALIAS_INDEX[s.trim().toLowerCase()] : undefined;

/** 公司是否为中国(含港澳台)公司,用于「国内 / 国外」分行展示。 */
export const isDomesticCompany = (id?: string): boolean => {
  if (!id) return false;
  const c = SLIM[id];
  return !!c?.hq && c.hq.includes("中国");
};

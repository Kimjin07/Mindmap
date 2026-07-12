/**
 * 公司 / 机构数据(服务端)。⚠️ 本模块 import 完整 companies.json(1.6MB+),
 * 只能在服务端(页面 RSC / API 路由)使用;客户端组件请用:
 *   - 类型与纯函数:./companyTypes
 *   - 瘦版数据(名称/别名/logo):./companiesClient
 *   - 完整单个公司:GET /api/company/[id]
 */

import { NODES, type NodeData } from "./nodes";
import companiesData from "./companies.json";
import type { Company } from "./companyTypes";

/* 类型与纯工具函数统一定义在 companyTypes(客户端安全),这里 re-export 兼容旧引用。 */
export * from "./companyTypes";

export const COMPANIES: Record<string, Company> = companiesData as unknown as Record<string, Company>;

/* ---------------- 工具函数 ---------------- */
export const getCompany = (id: string): Company | undefined => COMPANIES[id];
export const allCompanyIds = (): string[] => Object.keys(COMPANIES);

/** 别名 → 公司 id 的索引（含中文名、英文名、aliases）。 */
const ALIAS_INDEX: Record<string, string> = (() => {
  const idx: Record<string, string> = {};
  for (const c of Object.values(COMPANIES)) {
    idx[c.name.toLowerCase()] = c.id;
    idx[c.nameEn.toLowerCase()] = c.id;
    for (const a of c.aliases) idx[a.toLowerCase()] = c.id;
  }
  return idx;
})();

/** 把一段文案（players 的 by 或 name）解析到公司 id。 */
export const companyIdByName = (s?: string): string | undefined =>
  s ? ALIAS_INDEX[s.trim().toLowerCase()] : undefined;

/** 公司是否为中国（含港澳台）公司，用于「国内 / 国外」分行展示。 */
export const isDomesticCompany = (id?: string): boolean => {
  if (!id) return false;
  const c = COMPANIES[id];
  return !!c?.hq && c.hq.includes("中国");
};

/** 该公司出现在产业链的哪些节点（由 nodes.ts 反查）。 */
export const nodesForCompany = (id: string): NodeData[] =>
  Object.values(NODES).filter((n) => n.companyIds.includes(id));

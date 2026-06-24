/**
 * 「世界地图」数据层：把**全部五个板块**（应用 / 模型 / 基础设施 / 芯片 / 能源）
 * 的所有细分赛道，合并到**同一张无边界地图**上。
 *
 * - 每个赛道 = 一座城市；每个板块 = 一片区域(continent)，区域内城市抱团。
 * - 区域之间按产业链上下游就近摆放：应用 → 模型 → 芯片/基础设施 → 能源。
 * - 公路(RELATIONS)既连同区域内的城市，也连**跨板块**的城市，形成一整张连通网。
 */

import { NODES, getChildren } from "./nodes";

export interface Pt {
  x: number;
  y: number;
}

export const LAYER_IDS = ["apps", "models", "infra", "chips", "energy", "space", "optical"] as const;

/** 各板块在世界地图上的中心位置（世界单位 ≈ px）。按产业链上下游布局。 */
export const CLUSTERS: Record<string, Pt> = {
  apps: { x: 0, y: -1650 }, //   应用层 —— 最上
  models: { x: 0, y: -350 }, //  模型层 —— 居中枢纽
  infra: { x: -1200, y: 800 }, // 基础设施 —— 左下
  chips: { x: 1450, y: 850 }, //  芯片 —— 右下（城市变多，外移一点）
  energy: { x: 0, y: 1800 }, //   能源 —— 最底
  space: { x: 2100, y: -750 }, // 太空 —— 右上前沿
  optical: { x: -2150, y: -350 }, // 光通信 —— 左上前沿
};

/** 城市之间的公路（无向）。两端都是 nodes.ts 里的节点 id。 */
export const RELATIONS: [string, string][] = [
  /* ============ 区域内 ============ */
  /* 应用层 */
  ["chatbots", "ai_coder"],
  ["chatbots", "enterprise"],
  ["chatbots", "digital_biology"],
  ["chatbots", "robotaxi"],
  ["digital_biology", "science"],
  ["robotaxi", "robotics"],
  ["robotics", "manufacturing"],
  ["enterprise", "ai_coder"],
  ["science", "robotics"],
  ["manufacturing", "robotaxi"],
  /* 模型层 */
  ["llm", "gpt"],
  ["llm", "vlm"],
  ["llm", "moe"],
  ["moe", "ssm"],
  ["vlm", "mmllm"],
  ["vlm", "vla"],
  ["vla", "lbm"],
  ["mmllm", "dm"],
  ["gpt", "gnn"],
  /* 芯片层 */
  ["gpu", "cpu"],
  ["gpu", "dpu"],
  ["cpu", "dpu"],
  ["gpu", "foundry"],
  ["foundry", "packaging"],
  ["foundry", "equipment"],
  ["equipment", "eda"],
  ["eda", "gpu"],
  ["packaging", "gpu"],
  /* 太空层 */
  ["satellite", "launch"],
  ["launch", "orbital_dc"],
  ["satellite", "orbital_dc"],
  /* 基础设施层 */
  ["network", "nvlink"],
  ["nvlink", "storage"],
  ["network", "storage"],
  /* 光通信层（上→中→下游） */
  ["opt_chip", "opt_module"],
  ["opt_module", "opt_network"],
  ["opt_chip", "opt_network"],
  /* 能源层 */
  ["power", "cooling"],
  ["power", "grid"],
  ["cooling", "grid"],
  ["power", "generation"],
  ["generation", "nuclear"],
  ["grid", "generation"],

  /* ============ 跨板块·航线 ============ */
  /* 应用 ↔ 模型：应用调用模型 */
  ["chatbots", "llm"],
  ["chatbots", "mmllm"],
  ["ai_coder", "llm"],
  ["enterprise", "llm"],
  ["digital_biology", "gnn"],
  ["science", "gnn"],
  ["robotaxi", "vla"],
  ["robotics", "vla"],
  ["robotics", "lbm"],
  ["manufacturing", "vlm"],
  /* 模型 ↔ 芯片：训练/推理要算力 */
  ["llm", "gpu"],
  ["moe", "gpu"],
  ["mmllm", "gpu"],
  ["ssm", "gpu"],
  /* 芯片 ↔ 基础设施：芯片连成集群 */
  ["gpu", "nvlink"],
  ["gpu", "network"],
  ["dpu", "network"],
  ["cpu", "storage"],
  /* 基础设施 ↔ 能源：数据中心要供电散热 */
  ["network", "power"],
  ["storage", "cooling"],
  /* 芯片 ↔ 能源：算力的尽头是能源 */
  ["gpu", "power"],
  ["gpu", "cooling"],
  /* 太空 ↔ 芯片 / 能源 / 网络 */
  ["orbital_dc", "gpu"],
  ["orbital_dc", "power"],
  ["satellite", "network"],
  /* 光通信 ↔ 基础设施 / 芯片 */
  ["opt_module", "network"],
  ["opt_network", "network"],
  ["opt_chip", "foundry"],
];

/** 黄金角 ≈ 137.5°，向日葵排布的核心。 */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const INNER = 205; // 区域内城市间距

/** 区域内第几片用的相位偏移，让各板块朝向略有不同，更像自然分布。 */
const PHASE: Record<string, number> = {
  apps: 0.4, models: 1.7, infra: 2.6, chips: 3.5, energy: 5.0, space: 2.1, optical: 4.2,
};

/**
 * 计算**整张世界地图**所有城市的坐标：每个板块在自己的中心附近用
 * 向日葵螺旋铺开。结果确定可复现。
 */
export function worldLayout(): Record<string, Pt> {
  const out: Record<string, Pt> = {};
  for (const layer of LAYER_IDS) {
    const c = CLUSTERS[layer];
    const kids = getChildren(layer);
    const phase = PHASE[layer] ?? 0;
    kids.forEach((n, i) => {
      const r = INNER * Math.sqrt(i + 0.5);
      const a = i * GOLDEN + phase;
      out[n.id] = { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
    });
  }
  return out;
}

/** 某板块区域的半径（用于画区域底图 / 标签定位）。 */
export function clusterRadius(layer: string): number {
  const n = getChildren(layer).length;
  return INNER * Math.sqrt(Math.max(1, n - 0.5)) + 110;
}

/** 取出「两端都存在」的公路（这里所有节点都在，等于全部 RELATIONS）。 */
export function roadsFor(ids: string[]): [string, string][] {
  const set = new Set(ids);
  return RELATIONS.filter(([a, b]) => set.has(a) && set.has(b));
}

/** 一条公路是否跨板块（两端属于不同板块）。 */
export function isCrossLayer(a: string, b: string): boolean {
  return NODES[a]?.parentId !== NODES[b]?.parentId;
}

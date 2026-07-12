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

export const LAYER_IDS = ["apps", "models", "infra", "chips", "energy", "space", "optical", "storage", "materials"] as const;

/** 各板块在世界地图上的中心位置（世界单位 ≈ px）。按产业链上下游布局。 */
/**
 * 布局原则：**五个核心层竖排居中**（应用→模型→基础设施→芯片→能源，正如首页那张
 * 分层图），其余「扩展板块」各自**贴到它对应的核心层旁边**：
 *   · 光通信 / 太空算力  → 贴基础设施（连接 / 数据中心）
 *   · 上游材料 / 存储     → 贴芯片（原料在左、显存存储在右）
 * 以后新增板块也照此就近归位。
 */
export const CLUSTERS: Record<string, Pt> = {
  // —— 五个核心层放在「五角星」的五个角上，不再一条竖线那么规整 ——
  apps: { x: 0, y: -3200 }, //      应用层 —— 顶角
  models: { x: 3050, y: -1000 }, // 模型层 —— 右上角
  chips: { x: 1900, y: 2600 }, //   芯片 —— 右下角
  energy: { x: -1900, y: 2600 }, // 能源 —— 左下角
  infra: { x: -3050, y: -1000 }, // 基础设施 —— 左上角
  // —— 光通信 / 太空：贴在「基础设施」外侧 ——
  optical: { x: -4200, y: -2300 }, // 光通信
  space: { x: -4750, y: -450 }, //    太空算力
  // —— 上游材料 / 存储：贴在「芯片」外侧 ——
  materials: { x: 2200, y: 4650 }, //  上游材料
  storage: { x: 3850, y: 3450 }, //    存储
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
const INNER = 235; // 区域内城市间距（城市变多、图标变大后适当拉开）

/** 区域内第几片用的相位偏移，让各板块朝向略有不同，更像自然分布。 */
const PHASE: Record<string, number> = {
  apps: 0.4, models: 1.7, infra: 2.6, chips: 3.5, energy: 5.0, space: 2.1, optical: 4.2,
};

/** 确定性哈希 → [0,1)，用于给布局加「可复现的随机」（避免服务端/客户端不一致）。 */
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/**
 * 「大层拆小簇」：城市多的板块拆成几个**分散的小簇**（相对板块中心的偏移 + 城市 id），
 * 避免一坨太挤。未列出的板块整层用一个簇。offset 单位为世界坐标。
 */
export const LAYER_GROUPS: Record<string, { dx: number; dy: number; name: string; nameEn: string; ids: string[] }[]> = {
  apps: [
    { dx: -1050, dy: -1050, nameEn: "Consumer", name: "消费应用", ids: ["chatbots", "search_ai", "genmedia", "design_ai", "edu_ai", "productivity_ai"] },
    { dx: 1050, dy: -1050, nameEn: "Enterprise Agents", name: "企业智能体", ids: ["enterprise", "ai_agent", "ai_coder", "fin_ai", "voice_agent", "ai_security", "ai_ad"] },
    { dx: -1050, dy: 1050, nameEn: "Embodied AI", name: "具身机器人", ids: ["robotics", "robotaxi", "manufacturing", "robot_parts", "edge_ai"] },
    { dx: 1050, dy: 1050, nameEn: "Science & Frontier", name: "科学前沿", ids: ["science", "digital_biology", "health_ai", "defense_ai", "bci", "game_ai"] },
  ],
  models: [
    { dx: 230, dy: 680, nameEn: "Language & Reasoning", name: "语言·推理", ids: ["llm", "gpt", "moe", "ssm", "gnn", "world_model"] },
    { dx: -230, dy: -680, nameEn: "Multimodal & GenAI", name: "多模态·生成", ids: ["vlm", "vla", "mmllm", "dm", "lbm"] },
  ],
  chips: [
    { dx: 580, dy: -420, nameEn: "Compute Chips", name: "计算芯片", ids: ["gpu", "cpu", "dpu", "ai_accel", "quantum", "av_chip"] },
    { dx: -580, dy: 420, nameEn: "Fab & Manufacturing", name: "制造·代工", ids: ["foundry", "packaging", "equipment", "eda", "asic_design"] },
  ],
  energy: [
    { dx: 580, dy: 420, nameEn: "Power & Grid", name: "供电·电网", ids: ["cooling", "power", "grid", "transformer", "power_supply"] },
    { dx: -580, dy: -420, nameEn: "Generation", name: "发电·能源", ids: ["generation", "nuclear", "fusion", "uranium", "fuelcell"] },
  ],
  infra: [
    { dx: -230, dy: 680, nameEn: "Networking", name: "组网·互联", ids: ["nvlink", "network", "connector", "pcb"] },
    { dx: 230, dy: -680, nameEn: "Cloud & Data Centers", name: "云·数据中心", ids: ["neocloud", "depin", "ai_datacenter", "ai_server", "ai_infra_sw"] },
  ],
};

/** 在指定中心用向日葵螺旋 + 确定性扰动铺开一组城市。 */
function placeGroup(out: Record<string, Pt>, ids: string[], cx: number, cy: number, phase: number): void {
  ids.forEach((id, i) => {
    const h1 = hash01(id + "#r"), h2 = hash01(id + "#a"), h3 = hash01(id + "#x"), h4 = hash01(id + "#y");
    const r = INNER * Math.sqrt(i + 0.5) * (0.9 + 0.24 * h1);
    const a = i * GOLDEN + phase + (h2 - 0.5) * 0.7;
    const jit = INNER * 0.18;
    out[id] = { x: cx + Math.cos(a) * r + (h3 - 0.5) * jit, y: cy + Math.sin(a) * r + (h4 - 0.5) * jit };
  });
}

/**
 * 计算**整张世界地图**所有城市的坐标：大层拆成几个分散小簇，其余整层一个簇。
 * 结果确定可复现（同一 id 永远同一位置）。
 */
export function worldLayout(): Record<string, Pt> {
  const out: Record<string, Pt> = {};
  for (const layer of LAYER_IDS) {
    const c = CLUSTERS[layer];
    const phase = PHASE[layer] ?? 0;
    const groups = LAYER_GROUPS[layer];
    if (groups) {
      const seen = new Set<string>();
      for (const g of groups) {
        placeGroup(out, g.ids, c.x + g.dx, c.y + g.dy, phase);
        g.ids.forEach((id) => seen.add(id));
      }
      const rest = getChildren(layer).map((n) => n.id).filter((id) => !seen.has(id));
      if (rest.length) placeGroup(out, rest, c.x, c.y, phase);
    } else {
      placeGroup(out, getChildren(layer).map((n) => n.id), c.x, c.y, phase);
    }
  }
  return out;
}

/** 某板块区域的半径（用于画区域底图 / 标签定位）。拆簇的层按覆盖所有小簇计算。 */
export function clusterRadius(layer: string): number {
  const groups = LAYER_GROUPS[layer];
  if (groups) {
    let max = 0;
    for (const g of groups) {
      const sub = INNER * Math.sqrt(Math.max(1, g.ids.length - 0.5)) * 1.14;
      const d = Math.hypot(g.dx, g.dy) + sub;
      if (d > max) max = d;
    }
    return max + 130;
  }
  const n = getChildren(layer).length;
  return INNER * Math.sqrt(Math.max(1, n - 0.5)) * 1.14 + 150;
}

/**
 * 一个板块 = 一块「大陆」。返回若干重叠的圆（中央主体 + 各小簇凸起），
 * 同色填充叠在一起，形成有起伏的连成一体的陆地轮廓。
 */
export function continentLobes(layer: string): { x: number; y: number; r: number }[] {
  const c = CLUSTERS[layer];
  const groups = LAYER_GROUPS[layer];
  const R = clusterRadius(layer);
  const lobes: { x: number; y: number; r: number }[] = [{ x: c.x, y: c.y, r: R * 0.82 }];
  if (groups) {
    for (const g of groups) {
      const sub = INNER * Math.sqrt(Math.max(1, g.ids.length - 0.5)) * 1.14 + 220;
      lobes.push({ x: c.x + g.dx, y: c.y + g.dy, r: sub });
    }
  }
  return lobes;
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

/**
 * 公司 / 机构（L4，链路最终落点）。覆盖所有 players 背后的出品方——上市公司、
 * 未上市公司、开源/学术项目，保证「每个产品都能点进去」。
 *
 * ⚠️ 股价 / 市值 / 财报均为**人工维护的示例值**（量级正确、并非实时），
 *    用于先把「知识 → 公司 → 股票」的结构跑通；后期再接行情 / 财报 API。
 */

import { NODES, type NodeData } from "./nodes";

export interface Financial {
  year: number;
  revenue: number; // 营收，USD B
  netIncome: number; // 净利润，USD B
}

/** 股票 / 行情（对应 schema 的 Market 模块）。 */
export interface Stock {
  exchange: string;
  ticker: string;
  marketCapB?: number; // 市值，USD B
  sharePrice?: number; // 股价
  peRatio?: number; // 市盈率
  grossMargin?: string; // 毛利率，如 "76%"
  revenueTTM?: string; // 近 12 月营收，如 "$248B"
  week52High?: number;
  week52Low?: number;
  dayChangePct?: string; // 当日涨跌，如 "+2.13%"
}

/** 代表性产品 / 平台（对应 schema 的 Products 模块）。 */
export interface CompanyProduct {
  name: string;
  category?: string;
  description?: string;
  status?: string; // GA / Preview / ...
}

/** 一条新闻（对应 schema 的 News 模块）。 */
export interface NewsItem {
  title: string;
  date?: string;
  category?: string;
  summary?: string;
  url?: string;
}

/** 高管（对应 schema 的 Leadership 模块）。 */
export interface Exec {
  name: string;
  title: string;
}

/** 评分（对应 schema 的 Metrics 模块），0–100。 */
export interface Scores {
  ai?: number;
  moat?: number;
  growth?: number;
  innovation?: number;
  community?: number;
}

/** 外链 / 社媒（对应 schema 的 Links 模块）。 */
export interface CompanyLinks {
  docs?: string;
  developer?: string;
  investor?: string;
  blog?: string;
  github?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  discord?: string;
  huggingface?: string;
}

export interface Company {
  id: string;
  name: string;
  nameEn: string;
  oneLiner: string;
  kind: "public" | "private" | "oss"; // 上市 / 未上市 / 开源·学术·联盟
  /**
   * 官方 logo。把文件放到 public/logos/ 后：
   *   logo: true            → 用 /logos/<id>.svg
   *   logo: "/logos/x.png"  → 用指定路径
   *   不填                   → 回退到深色金字字标（不会有白底）
   */
  logo?: boolean | string;
  hq?: string;
  website?: string;
  aliases: string[]; // 把 players 的 `by` / `name` 文案匹配到本公司
  stock?: Stock;
  business: string;
  financials?: Financial[];
  competitors?: string[];

  /* ---- 富信息（对应 AI_Company_Schema.xlsx；均可选，缺省时页面自动隐藏对应区块） ---- */
  tagline?: string; // 一句话 slogan（缺省回退到 oneLiner）
  description?: string; // 公司介绍（缺省回退到 business）
  foundedYear?: number;
  employees?: string; // 如 "36,000+"
  country?: string;
  status?: string; // Active / Acquired / IPO
  coverImage?: string;
  industry?: string; // 如 "AI 基础设施"
  subcategory?: string; // 如 "GPU"
  role?: string; // 在产业链中的角色
  aiScore?: number; // AI Score，0–100（缺省回退到 scores.ai）
  whyItMatters?: string[]; // 「为什么重要」要点
  scores?: Scores;
  products?: CompanyProduct[];
  keyCustomers?: string[]; // 公司 id 优先，找不到则按原文显示
  partners?: string[];
  suppliers?: string[];
  relatedCompanies?: string[];
  investors?: string[];
  leadership?: Exec[];
  news?: NewsItem[];
  links?: CompanyLinks;
  tags?: string[];
}

/** 标语：优先 tagline，回退到 oneLiner。 */
export const companyTagline = (c: Company): string => c.tagline ?? c.oneLiner;
/** 介绍：优先 description，回退到 business。 */
export const companyDescription = (c: Company): string => c.description ?? c.business;
/** AI Score：优先 aiScore，回退到 scores.ai。 */
export const companyAiScore = (c: Company): number | undefined => c.aiScore ?? c.scores?.ai;

export const COMPANIES: Record<string, Company> = {
  /* ============ 上市·重点 ============ */
  msft: {
    id: "msft", name: "微软", nameEn: "Microsoft", kind: "public",
    aliases: ["Microsoft", "微软", "Microsoft Research", "M365"],
    oneLiner: "把 AI 装进 Windows、Office 与 Azure 云的软件巨头，OpenAI 最大投资方。",
    hq: "美国·雷德蒙德", website: "microsoft.com",
    stock: { exchange: "NASDAQ", ticker: "MSFT", marketCapB: 3100 },
    business: "云计算(Azure)、生产力软件(Microsoft 365 + Copilot)、操作系统与游戏。Azure 是 OpenAI 模型的独家云底座。",
    financials: [{ year: 2023, revenue: 211.9, netIncome: 72.4 }, { year: 2024, revenue: 245.1, netIncome: 88.1 }],
    competitors: ["googl", "amzn", "crm", "now"],
    partners: ["openai", "nvda"],
    relatedCompanies: ["openai"],
    suppliers: ["nvda", "tsm"],
  },
  googl: {
    id: "googl", name: "谷歌母公司", nameEn: "Alphabet", kind: "public",
    aliases: ["Google", "Alphabet", "DeepMind", "谷歌", "Google DeepMind", "Google / Pinterest", "Google（原始论文）"],
    oneLiner: "搜索 + 安卓 + 云 + DeepMind，AI 研究与产品最全面的公司之一。",
    hq: "美国·山景城", website: "abc.xyz",
    stock: { exchange: "NASDAQ", ticker: "GOOGL", marketCapB: 2100 },
    business: "广告(搜索/YouTube)、谷歌云、安卓生态。旗下 DeepMind 产出 Gemini、AlphaFold、Waymo，自研 TPU 芯片。",
    financials: [{ year: 2023, revenue: 307.4, netIncome: 73.8 }, { year: 2024, revenue: 350.0, netIncome: 100.1 }],
    competitors: ["msft", "meta", "amzn", "openai"],
    partners: ["anthropic"],
    relatedCompanies: ["anthropic"],
    suppliers: ["tsm"],
  },
  nvda: {
    id: "nvda", name: "英伟达", nameEn: "NVIDIA", kind: "public", aliases: ["NVIDIA", "英伟达"],
    oneLiner: "AI 算力的「卖铲人」，GPU 与 CUDA 生态的绝对龙头。",
    tagline: "为 AI 时代提供加速计算",
    hq: "美国·圣克拉拉", country: "美国", website: "nvidia.com",
    foundedYear: 1993, employees: "36,000+", status: "Active",
    industry: "AI 基础设施", subcategory: "GPU", role: "算力",
    stock: {
      exchange: "NASDAQ", ticker: "NVDA", marketCapB: 5100,
      sharePrice: 213.48, peRatio: 57.2, grossMargin: "76%", revenueTTM: "$248B",
      week52High: 230, week52Low: 86, dayChangePct: "+2.13%",
    },
    business: "数据中心 GPU(H100/Blackwell)、CUDA 软件栈、NVLink 互联、机器人(GR00T)与汽车平台。",
    description:
      "英伟达是全球加速计算的领导者。其 GPU、CUDA 软件平台与高速网络/系统，已成为现代 AI 基础设施的根基——从训练前沿大模型到大规模推理部署，几乎所有 AI 算力都跑在英伟达之上。",
    aiScore: 96,
    whyItMatters: [
      "数据中心 AI 训练 GPU 市场份额超过 90%",
      "CUDA 软件生态构筑十余年的深厚护城河",
      "Blackwell 平台供不应求，订单排到明年",
      "对整个 AI 产业链具有系统级影响力",
    ],
    scores: { ai: 96, moat: 97, growth: 95, innovation: 100, community: 93 },
    products: [
      { name: "Blackwell", category: "GPU", status: "GA", description: "新一代 AI 训练 / 推理 GPU 平台。" },
      { name: "DGX", category: "系统", description: "开箱即用的 AI 超级计算机。" },
      { name: "CUDA", category: "软件", description: "并行计算平台与编程模型，生态护城河。" },
      { name: "Spectrum-X", category: "网络", description: "面向 AI 的高性能以太网平台。" },
      { name: "NVLink", category: "互联", description: "GPU 之间的高速互联。" },
      { name: "Omniverse", category: "仿真", description: "工业数字孪生与仿真平台。" },
    ],
    keyCustomers: ["msft", "meta", "amzn", "googl", "tsla"],
    partners: ["tsm", "skhynix"],
    suppliers: ["tsm", "skhynix", "asml"],
    relatedCompanies: ["tsm", "asml", "avgo", "arm"],
    leadership: [{ name: "黄仁勋", title: "创始人 / CEO" }],
    news: [
      { title: "Blackwell 平台全面售罄", date: "2026", category: "产品", summary: "新一代 GPU 需求超预期，产能排满。" },
      { title: "英伟达与沙特达成 AI 算力合作", date: "2026", category: "合作", summary: "向中东大型 AI 数据中心供应算力。" },
      { title: "市值站上 5 万亿美元", date: "2026", category: "市场", summary: "成为全球市值最高的公司之一。" },
    ],
    links: {
      investor: "https://investor.nvidia.com",
      developer: "https://developer.nvidia.com",
      github: "https://github.com/NVIDIA",
      linkedin: "https://www.linkedin.com/company/nvidia",
      x: "https://x.com/nvidia",
      youtube: "https://www.youtube.com/nvidia",
    },
    tags: ["GPU", "CUDA", "数据中心", "加速计算"],
    financials: [{ year: 2023, revenue: 60.9, netIncome: 29.8 }, { year: 2024, revenue: 130.5, netIncome: 72.9 }],
    competitors: ["amd", "avgo", "intc"],
  },
  tsla: {
    id: "tsla", name: "特斯拉", nameEn: "Tesla", kind: "public", aliases: ["Tesla", "特斯拉"],
    oneLiner: "电动车 + 自动驾驶(FSD) + 人形机器人(Optimus)的具身智能公司。",
    hq: "美国·奥斯汀", website: "tesla.com",
    stock: { exchange: "NASDAQ", ticker: "TSLA", marketCapB: 800 },
    business: "电动汽车、储能、FSD 自动驾驶与 Robotaxi、Optimus 人形机器人，自研 Dojo 训练芯片。",
    financials: [{ year: 2023, revenue: 96.8, netIncome: 15.0 }, { year: 2024, revenue: 97.7, netIncome: 7.1 }],
    competitors: ["googl", "nvda"],
  },
  meta: {
    id: "meta", name: "Meta", nameEn: "Meta Platforms", kind: "public", aliases: ["Meta", "Facebook"],
    oneLiner: "社交帝国，开源大模型 Llama 的推手。",
    hq: "美国·门洛帕克", website: "about.meta.com",
    stock: { exchange: "NASDAQ", ticker: "META", marketCapB: 1300 },
    business: "社交广告(Facebook/Instagram/WhatsApp)、Reality Labs(VR/AR)。Llama 开源模型推动了整个开源 AI 生态。",
    financials: [{ year: 2023, revenue: 134.9, netIncome: 39.1 }, { year: 2024, revenue: 164.5, netIncome: 62.4 }],
    competitors: ["googl", "msft", "openai"],
    partners: ["nvda"],
    suppliers: ["nvda", "tsm"],
  },
  amd: {
    id: "amd", name: "超威半导体", nameEn: "AMD", kind: "public", aliases: ["AMD"],
    oneLiner: "英伟达在 GPU 与 CPU 上的主要挑战者。", hq: "美国·圣克拉拉", website: "amd.com",
    stock: { exchange: "NASDAQ", ticker: "AMD", marketCapB: 250 },
    business: "数据中心 GPU(Instinct MI300)、EPYC 服务器 CPU、消费级处理器与显卡。",
    financials: [{ year: 2024, revenue: 25.8, netIncome: 1.6 }],
    competitors: ["nvda", "intc"],
    keyCustomers: ["msft", "meta", "amzn", "openai"],
    partners: ["tsm", "ualink"],
    suppliers: ["tsm", "skhynix"],
  },
  intc: {
    id: "intc", name: "英特尔", nameEn: "Intel", kind: "public", aliases: ["Intel", "英特尔"],
    oneLiner: "老牌 CPU 龙头，正艰难追赶 AI 与先进制程。", hq: "美国·圣克拉拉", website: "intel.com",
    stock: { exchange: "NASDAQ", ticker: "INTC", marketCapB: 100 },
    business: "x86 CPU(Xeon/Core)、AI 加速器(Gaudi)、代工(IDM 2.0)。",
    financials: [{ year: 2024, revenue: 53.1, netIncome: -19.2 }], competitors: ["amd", "nvda", "tsm"],
  },
  avgo: {
    id: "avgo", name: "博通", nameEn: "Broadcom", kind: "public", aliases: ["Broadcom", "博通"],
    oneLiner: "定制 AI 芯片(ASIC)与数据中心网络芯片的隐形冠军。", hq: "美国·帕洛阿尔托", website: "broadcom.com",
    stock: { exchange: "NASDAQ", ticker: "AVGO", marketCapB: 800 },
    business: "为云厂商定制 AI ASIC、Tomahawk 交换芯片、光通信器件，以及 VMware 等基础软件。",
    financials: [{ year: 2024, revenue: 51.6, netIncome: 5.9 }], competitors: ["nvda", "mrvl", "anet"],
  },
  anet: {
    id: "anet", name: "Arista", nameEn: "Arista Networks", kind: "public", aliases: ["Arista"],
    oneLiner: "AI 数据中心高速以太网交换机的领导者。", hq: "美国·圣克拉拉", website: "arista.com",
    stock: { exchange: "NYSE", ticker: "ANET", marketCapB: 120 },
    business: "高性能数据中心交换机与 EOS 网络操作系统，支撑大规模 GPU 集群互联。",
    financials: [{ year: 2024, revenue: 7.0, netIncome: 2.8 }], competitors: ["avgo", "nvda"],
  },
  tsm: {
    id: "tsm", name: "台积电", nameEn: "TSMC", kind: "public", aliases: ["TSMC", "台积电"],
    oneLiner: "全球先进芯片制造的绝对核心，英伟达/苹果都靠它代工。", hq: "中国台湾·新竹", website: "tsmc.com",
    stock: { exchange: "NYSE", ticker: "TSM", marketCapB: 900 },
    business: "晶圆代工龙头，掌握最先进制程(3nm/2nm)与 CoWoS 先进封装——AI 芯片产能的真正瓶颈。",
    financials: [{ year: 2024, revenue: 90.0, netIncome: 36.0 }],
    competitors: ["intc", "samsung"],
    keyCustomers: ["nvda", "amd", "avgo"],
    partners: ["asml"],
    suppliers: ["asml", "amat", "lrcx", "klac"],
  },
  adbe: {
    id: "adbe", name: "Adobe", nameEn: "Adobe", kind: "public", aliases: ["Adobe"],
    oneLiner: "创意软件龙头，用 Firefly 把生成式 AI 装进设计工具。", hq: "美国·圣何塞", website: "adobe.com",
    stock: { exchange: "NASDAQ", ticker: "ADBE", marketCapB: 220 },
    business: "Creative Cloud(PS/AI/Premiere)、文档(Acrobat)，Firefly 提供合规的生成式创作。",
    financials: [{ year: 2024, revenue: 21.5, netIncome: 5.6 }], competitors: ["googl", "msft"],
  },
  crm: {
    id: "crm", name: "Salesforce", nameEn: "Salesforce", kind: "public", aliases: ["Salesforce"],
    oneLiner: "全球最大 CRM，用 Agentforce 押注企业级 AI 智能体。", hq: "美国·旧金山", website: "salesforce.com",
    stock: { exchange: "NYSE", ticker: "CRM", marketCapB: 270 },
    business: "客户关系管理(销售/服务/营销)云，Agentforce 为企业部署自主 AI 智能体。",
    financials: [{ year: 2024, revenue: 37.9, netIncome: 6.2 }], competitors: ["msft", "now"],
  },
  now: {
    id: "now", name: "ServiceNow", nameEn: "ServiceNow", kind: "public", aliases: ["ServiceNow"],
    oneLiner: "企业工作流自动化平台，AI 重塑 IT/HR 流程。", hq: "美国·圣克拉拉", website: "servicenow.com",
    stock: { exchange: "NYSE", ticker: "NOW", marketCapB: 180 },
    business: "数字工作流平台(IT/客服/HR)，Now Assist 把生成式 AI 嵌入企业流程。",
    financials: [{ year: 2024, revenue: 10.9, netIncome: 1.4 }], competitors: ["crm", "msft"],
  },
  pltr: {
    id: "pltr", name: "Palantir", nameEn: "Palantir", kind: "public", aliases: ["Palantir"],
    oneLiner: "把 AI 落到政府与大企业实战决策的数据平台。", hq: "美国·丹佛", website: "palantir.com",
    stock: { exchange: "NASDAQ", ticker: "PLTR", marketCapB: 150 },
    business: "Gotham(政府)、Foundry(企业)与 AIP(AI 平台)，把大模型接入真实业务数据做决策。",
    financials: [{ year: 2024, revenue: 2.9, netIncome: 0.5 }], competitors: ["msft", "now"],
  },
  mrvl: {
    id: "mrvl", name: "Marvell", nameEn: "Marvell", kind: "public", aliases: ["Marvell"],
    oneLiner: "定制 AI 芯片与数据中心互联的重要玩家。", hq: "美国·圣克拉拉", website: "marvell.com",
    stock: { exchange: "NASDAQ", ticker: "MRVL", marketCapB: 70 },
    business: "定制 ASIC、光 DSP、DPU 与数据中心连接芯片。",
    financials: [{ year: 2024, revenue: 5.8, netIncome: -0.9 }], competitors: ["avgo", "nvda"],
  },
  wdc: {
    id: "wdc", name: "西部数据", nameEn: "Western Digital", kind: "public", aliases: ["Western Digital", "西部数据"],
    oneLiner: "海量数据存储(硬盘/闪存)的主要供应商。", hq: "美国·圣何塞", website: "westerndigital.com",
    stock: { exchange: "NASDAQ", ticker: "WDC", marketCapB: 20 },
    business: "企业级硬盘(HDD)与闪存(NAND)，为 AI 数据中心提供海量存储。", competitors: ["skhynix"],
  },
  vrt: {
    id: "vrt", name: "Vertiv", nameEn: "Vertiv", kind: "public", aliases: ["Vertiv", "维谛"],
    oneLiner: "数据中心供电与液冷的核心供应商，AI 散热龙头。", hq: "美国·哥伦布", website: "vertiv.com",
    stock: { exchange: "NYSE", ticker: "VRT", marketCapB: 40 },
    business: "数据中心电源、配电与热管理(含液冷)，直接受益于 AI 算力的功耗与发热激增。",
    financials: [{ year: 2024, revenue: 8.0, netIncome: 0.5 }], competitors: ["etn", "schneider"],
  },
  etn: {
    id: "etn", name: "伊顿", nameEn: "Eaton", kind: "public", aliases: ["Eaton", "伊顿"],
    oneLiner: "电力管理巨头，给数据中心供配电。", hq: "爱尔兰·都柏林", website: "eaton.com",
    stock: { exchange: "NYSE", ticker: "ETN", marketCapB: 130 },
    business: "电气设备与电力管理(供配电、不间断电源、电网设备)，是 AI 数据中心扩张的卖水人。",
    financials: [{ year: 2024, revenue: 24.9, netIncome: 3.8 }], competitors: ["vrt", "nee"],
  },
  nee: {
    id: "nee", name: "新纪元能源", nameEn: "NextEra Energy", kind: "public", aliases: ["NextEra", "NextEra Energy"],
    oneLiner: "美国最大公用事业 + 全球最大风光发电商。", hq: "美国·朱诺比奇", website: "nexteraenergy.com",
    stock: { exchange: "NYSE", ticker: "NEE", marketCapB: 160 },
    business: "受监管公用事业(佛州电力)与可再生能源(风/光/储)，为 AI 数据中心的用电激增供能。",
    financials: [{ year: 2024, revenue: 24.8, netIncome: 6.9 }], competitors: ["etn", "gev"],
  },
  cohr: {
    id: "cohr", name: "高意", nameEn: "Coherent", kind: "public", aliases: ["Coherent"],
    oneLiner: "光通信器件与光模块的关键供应商。", hq: "美国·萨克森堡", website: "coherent.com",
    stock: { exchange: "NYSE", ticker: "COHR", marketCapB: 12 },
    business: "光模块、激光与光电子器件，为 AI 数据中心高速光互联提供核心元件。",
    competitors: ["lite", "aaoi", "fn"],
    investors: ["nvda"],
    keyCustomers: ["nvda", "csco"],
  },

  /* ============ 上市·补充 ============ */
  baba: {
    id: "baba", name: "阿里巴巴", nameEn: "Alibaba", kind: "public", aliases: ["阿里", "Alibaba", "阿里巴巴", "阿里云"],
    oneLiner: "中国电商与云龙头，通义千问(Qwen)开源模型推手。", hq: "中国·杭州", website: "alibaba.com",
    stock: { exchange: "NYSE", ticker: "BABA", marketCapB: 220 },
    business: "电商(淘宝/天猫)、阿里云与通义大模型(Qwen 系列，开源生态领先)。",
    financials: [{ year: 2024, revenue: 130.0, netIncome: 11.0 }], competitors: ["bidu", "msft"],
  },
  bidu: {
    id: "bidu", name: "百度", nameEn: "Baidu", kind: "public", aliases: ["百度", "Baidu", "Apollo"],
    oneLiner: "中国搜索龙头，文心一言 + 萝卜快跑自动驾驶。", hq: "中国·北京", website: "baidu.com",
    stock: { exchange: "NASDAQ", ticker: "BIDU", marketCapB: 35 },
    business: "搜索与广告、智能云、文心(ERNIE)大模型，Apollo Go 萝卜快跑是中国领先的 Robotaxi。",
    financials: [{ year: 2024, revenue: 18.0, netIncome: 3.2 }], competitors: ["baba", "pony"],
  },
  amzn: {
    id: "amzn", name: "亚马逊", nameEn: "Amazon", kind: "public", aliases: ["Amazon", "AWS", "亚马逊", "Annapurna"],
    oneLiner: "云计算(AWS)龙头 + 电商，自研芯片与 Zoox 无人车。", hq: "美国·西雅图", website: "amazon.com",
    stock: { exchange: "NASDAQ", ticker: "AMZN", marketCapB: 2000 },
    business: "AWS 云、电商与广告，自研 Trainium/Inferentia 芯片，Zoox Robotaxi，重金投资 Anthropic。",
    financials: [{ year: 2024, revenue: 638.0, netIncome: 59.2 }],
    competitors: ["msft", "googl"],
    partners: ["anthropic", "nvda"],
    relatedCompanies: ["anthropic"],
    suppliers: ["nvda", "tsm"],
  },
  pony: {
    id: "pony", name: "小马智行", nameEn: "Pony.ai", kind: "public", aliases: ["Pony.ai", "小马智行"],
    oneLiner: "中国头部 Robotaxi 公司，2024 年赴美上市。", hq: "中国·广州", website: "pony.ai",
    stock: { exchange: "NASDAQ", ticker: "PONY", marketCapB: 5 },
    business: "L4 级自动驾驶与 Robotaxi 运营，覆盖北上广深等核心城市。", competitors: ["wrd", "bidu"],
  },
  wrd: {
    id: "wrd", name: "文远知行", nameEn: "WeRide", kind: "public", aliases: ["WeRide", "文远知行"],
    oneLiner: "中国自动驾驶公司，覆盖 Robotaxi/小巴/清扫车。", hq: "中国·广州", website: "weride.ai",
    stock: { exchange: "NASDAQ", ticker: "WRD", marketCapB: 4 },
    business: "L4 通用自动驾驶平台，多车型量产落地。", competitors: ["pony", "bidu"],
  },
  rxrx: {
    id: "rxrx", name: "Recursion", nameEn: "Recursion Pharma", kind: "public", aliases: ["Recursion", "RXRX"],
    oneLiner: "用 AI + 自动化实验室加速新药发现的 TechBio 公司。", hq: "美国·盐湖城", website: "recursion.com",
    stock: { exchange: "NASDAQ", ticker: "RXRX", marketCapB: 3 },
    business: "把湿实验室与机器学习结合，大规模生成生物数据训练药物发现模型，与英伟达合作。",
    competitors: ["insilico"],
  },
  cgnx: {
    id: "cgnx", name: "康耐视", nameEn: "Cognex", kind: "public", aliases: ["Cognex", "康耐视"],
    oneLiner: "工业机器视觉龙头。", hq: "美国·内蒂克", website: "cognex.com",
    stock: { exchange: "NASDAQ", ticker: "CGNX", marketCapB: 6 },
    business: "机器视觉系统与传感器，用于工厂质检、定位、读码。", competitors: ["sie"],
  },
  arm: {
    id: "arm", name: "Arm", nameEn: "Arm Holdings", kind: "public", aliases: ["Arm", "ARM 架构", "ARM"],
    oneLiner: "全球移动与低功耗芯片架构的事实标准。", hq: "英国·剑桥", website: "arm.com",
    stock: { exchange: "NASDAQ", ticker: "ARM", marketCapB: 130 },
    business: "授权 CPU/GPU 架构(IP)，几乎所有手机与越来越多数据中心芯片基于 Arm 架构。数据中心里，英伟达 Grace、AWS Graviton/Trainium、Ampere 等都采用 Arm 架构。",
    competitors: ["intc", "amd"],
    keyCustomers: ["nvda", "amzn", "avgo", "mrvl"],
    partners: ["tsm", "snps", "cdns"],
    relatedCompanies: ["nvda", "tsm"],
    role: "芯片架构 / IP 授权",
    industry: "半导体 IP", subcategory: "CPU 架构",
  },
  pstg: {
    id: "pstg", name: "Pure Storage", nameEn: "Pure Storage", kind: "public", aliases: ["Pure Storage"],
    oneLiner: "全闪存企业存储领先者。", hq: "美国·圣克拉拉", website: "purestorage.com",
    stock: { exchange: "NYSE", ticker: "PSTG", marketCapB: 18 },
    business: "全闪存阵列与数据存储平台，面向 AI 训练的高吞吐存储。", competitors: ["wdc"],
  },
  gev: {
    id: "gev", name: "GE Vernova", nameEn: "GE Vernova", kind: "public", aliases: ["GE Vernova"],
    oneLiner: "通用电气拆分出的能源装备巨头。", hq: "美国·剑桥(麻省)", website: "gevernova.com",
    stock: { exchange: "NYSE", ticker: "GEV", marketCapB: 90 },
    business: "燃气/风电/电网设备与电气化解决方案，承接 AI 用电激增带来的电力装备需求。",
    competitors: ["etn", "nee"],
  },
  sie: {
    id: "sie", name: "西门子", nameEn: "Siemens", kind: "public", aliases: ["Siemens", "西门子"],
    oneLiner: "工业自动化与数字化巨头。", hq: "德国·慕尼黑", website: "siemens.com",
    stock: { exchange: "ETR", ticker: "SIE", marketCapB: 180 },
    business: "工业自动化、数字孪生(Xcelerator)、轨道交通与楼宇。Industrial AI 落地智能制造。",
    competitors: ["cgnx"],
  },
  foxconn: {
    id: "foxconn", name: "富士康", nameEn: "Hon Hai / Foxconn", kind: "public", aliases: ["富士康", "Foxconn", "鸿海"],
    oneLiner: "全球最大电子代工厂，AI 服务器组装主力。", hq: "中国台湾·新北", website: "honhai.com",
    stock: { exchange: "TWSE", ticker: "2317", marketCapB: 90 },
    business: "消费电子与服务器代工(含英伟达 AI 服务器)，推进「灯塔工厂」智能制造。",
    competitors: [],
  },
  schneider: {
    id: "schneider", name: "施耐德电气", nameEn: "Schneider Electric", kind: "public", aliases: ["Schneider", "施耐德", "施耐德电气"],
    oneLiner: "能源管理与自动化巨头，数据中心配电/制冷主力。", hq: "法国·吕埃马迈松", website: "se.com",
    stock: { exchange: "EPA", ticker: "SU", marketCapB: 140 },
    business: "数据中心供配电与制冷(EcoStruxure)、工业自动化，AI 数据中心基建核心供应商。",
    competitors: ["vrt", "etn"],
  },
  envicool: {
    id: "envicool", name: "英维克", nameEn: "Envicool", kind: "public", aliases: ["英维克", "Envicool"],
    oneLiner: "中国数据中心温控/液冷龙头。", hq: "中国·深圳", website: "envicool.com",
    stock: { exchange: "SZSE", ticker: "002837", marketCapB: 8 },
    business: "机房精密温控与液冷方案，受益 AI 算力散热需求。", competitors: ["vrt"],
  },
  innolight: {
    id: "innolight", name: "中际旭创", nameEn: "Innolight", kind: "public", aliases: ["中际旭创", "Innolight", "中际旭创 Innolight", "旭创"],
    oneLiner: "全球高速光模块出货龙头。", hq: "中国·苏州", website: "innolight.com",
    stock: { exchange: "SZSE", ticker: "300308", marketCapB: 30 },
    business: "800G/1.6T 高速光模块，AI 数据中心光互联核心供应商。", competitors: ["cohr", "eoptolink"],
  },
  eoptolink: {
    id: "eoptolink", name: "新易盛", nameEn: "Eoptolink", kind: "public", aliases: ["新易盛", "Eoptolink"],
    oneLiner: "中国高速光模块主要厂商。", hq: "中国·成都", website: "eoptolink.com",
    stock: { exchange: "SZSE", ticker: "300502", marketCapB: 20 },
    business: "高速光模块研发与制造，AI 算力网络受益标的。", competitors: ["innolight", "cohr"],
  },
  skhynix: {
    id: "skhynix", name: "SK 海力士", nameEn: "SK Hynix", kind: "public", aliases: ["SK Hynix", "SK Hynix / 三星", "海力士"],
    oneLiner: "HBM 高带宽显存的领导者，英伟达核心供应商。", hq: "韩国·利川", website: "skhynix.com",
    stock: { exchange: "KRX", ticker: "000660", marketCapB: 120 },
    business: "DRAM、NAND 与 HBM 显存。HBM 是 AI GPU 的关键瓶颈部件，SK 海力士份额领先。",
    competitors: ["samsung", "wdc"],
  },
  samsung: {
    id: "samsung", name: "三星电子", nameEn: "Samsung", kind: "public", aliases: ["三星", "Samsung"],
    oneLiner: "存储芯片与代工巨头。", hq: "韩国·水原", website: "samsung.com",
    stock: { exchange: "KRX", ticker: "005930", marketCapB: 320 },
    business: "存储(DRAM/NAND/HBM)、晶圆代工、消费电子。", competitors: ["skhynix", "tsm"],
  },

  /* ============ 上市·光网络 / 存储补充 ============ */
  lite: {
    id: "lite", name: "Lumentum", nameEn: "Lumentum", kind: "public", aliases: ["Lumentum", "LITE"],
    oneLiner: "光模块的「卖铲人」——1.6T 时代关键 EML 激光芯片的量产者。",
    hq: "美国·圣何塞", website: "lumentum.com",
    stock: { exchange: "NASDAQ", ticker: "LITE", marketCapB: 18 },
    business: "激光器、EML/光芯片与光器件。目前少数能量产 200G/lane EML（1.6T 光模块核心元件）的厂商，另有大额光交换(OCS)订单。2026 营收高速增长。",
    competitors: ["cohr", "aaoi"],
  },
  aaoi: {
    id: "aaoi", name: "应用光电", nameEn: "Applied Optoelectronics", kind: "public", aliases: ["Applied Optoelectronics", "AAOI"],
    oneLiner: "2026 涨幅最猛的光模块股之一，800G/1.6T 收发模块放量。",
    hq: "美国·休斯顿", website: "ao-inc.com",
    stock: { exchange: "NASDAQ", ticker: "AAOI", marketCapB: 5 },
    business: "数据中心光收发模块(800G/1.6T)。2026 完成 800G 放量并拿下 1.6T 大单，全年营收指引超 10 亿美元。",
    competitors: ["lite", "cohr", "innolight"],
  },
  cien: {
    id: "cien", name: "Ciena", nameEn: "Ciena", kind: "public", aliases: ["Ciena"],
    oneLiner: "相干光网络与高容量路由设备龙头。",
    hq: "美国·汉诺威", website: "ciena.com",
    stock: { exchange: "NYSE", ticker: "CIEN", marketCapB: 16 },
    business: "相干光传输、路由与网络自动化软件，连接 AI 数据中心之间的长途 / 城域网络。",
    competitors: ["nok", "anet"],
  },
  nok: {
    id: "nok", name: "诺基亚", nameEn: "Nokia", kind: "public", aliases: ["Nokia", "诺基亚"],
    oneLiner: "电信级网络基建巨头，光网络与数据中心互联业务增长。",
    hq: "芬兰·埃斯波", website: "nokia.com",
    stock: { exchange: "NYSE", ticker: "NOK", marketCapB: 28 },
    business: "移动 / 固定网络基础设施、IP 路由与光网络，正向 AI 数据中心互联延伸。",
    competitors: ["cien", "anet"],
  },
  mu: {
    id: "mu", name: "美光", nameEn: "Micron", kind: "public", aliases: ["Micron", "美光"],
    oneLiner: "美系唯一存储大厂，HBM 是 AI 内存的关键供应。",
    hq: "美国·博伊西", website: "micron.com",
    stock: { exchange: "NASDAQ", ticker: "MU", marketCapB: 140 },
    business: "DRAM、NAND 与 HBM 高带宽显存。HBM 是 AI GPU 的关键瓶颈部件之一，美光是三大供应商中唯一美系厂商。",
    financials: [{ year: 2024, revenue: 25.1, netIncome: 0.8 }],
    competitors: ["skhynix", "samsung", "wdc"],
  },

  /* ============ 上市·光通信补充 ============ */
  fn: {
    id: "fn", name: "Fabrinet", nameEn: "Fabrinet", kind: "public", aliases: ["Fabrinet"],
    oneLiner: "全球光模块/光器件代工龙头。", hq: "泰国·曼谷", website: "fabrinet.com",
    stock: { exchange: "NYSE", ticker: "FN", marketCapB: 25 },
    business: "为 Lumentum、Cisco、NVIDIA 等代工光模块与精密光机电组件，是光通信中游的隐形巨头。",
    competitors: ["innolight", "accelink"],
  },
  csco: {
    id: "csco", name: "思科", nameEn: "Cisco", kind: "public", aliases: ["Cisco", "思科"],
    oneLiner: "企业与数据中心网络设备龙头，光网络的下游买家。", hq: "美国·圣何塞", website: "cisco.com",
    stock: { exchange: "NASDAQ", ticker: "CSCO", marketCapB: 250 },
    business: "交换机、路由器、网络安全与协作软件；自研硅光与光模块，是光通信下游主力。",
    competitors: ["anet", "nok", "cien"],
  },
  accelink: {
    id: "accelink", name: "光迅科技", nameEn: "Accelink", kind: "public", aliases: ["光迅科技", "Accelink", "光迅"],
    oneLiner: "国产光器件与光模块老牌厂商。", hq: "中国·武汉", website: "accelink.com",
    stock: { exchange: "SZSE", ticker: "002281", marketCapB: 12 },
    business: "光芯片、光器件与光模块全产业链，国产光通信骨干。", competitors: ["innolight", "eoptolink", "tianfu"],
  },
  tianfu: {
    id: "tianfu", name: "天孚通信", nameEn: "T&S Communications", kind: "public", aliases: ["天孚通信", "天孚", "T&S Communications"],
    oneLiner: "光器件配套龙头，光模块「卖铲人」。", hq: "中国·苏州", website: "tfc-photon.com",
    stock: { exchange: "SZSE", ticker: "300394", marketCapB: 15 },
    business: "光器件、陶瓷套管、光引擎等配套，深度绑定头部光模块厂。", competitors: ["accelink"],
  },
  yuanjie: {
    id: "yuanjie", name: "源杰科技", nameEn: "Yuanjie Semiconductor", kind: "public", aliases: ["源杰科技", "源杰", "Yuanjie"],
    oneLiner: "国产高速光芯片(激光器)代表。", hq: "中国·西安", website: "yuanjiephotonics.com",
    stock: { exchange: "SSE", ticker: "688498", marketCapB: 6 },
    business: "DFB/EML 激光器芯片，国产替代上游光芯片的关键力量。", competitors: ["lite", "cohr"],
  },

  mtsi: {
    id: "mtsi", name: "MACOM", nameEn: "MACOM", kind: "public", aliases: ["MACOM"],
    oneLiner: "高速模拟与光电芯片(激光驱动器/TIA)供应商。", hq: "美国·洛厄尔", website: "macom.com",
    stock: { exchange: "NASDAQ", ticker: "MTSI", marketCapB: 10 },
    business: "光模块用的激光驱动器、跨阻放大器(TIA)与高速模拟/射频芯片，光通信上游关键器件。",
    competitors: ["smtc", "avgo", "lite"],
  },
  smtc: {
    id: "smtc", name: "Semtech", nameEn: "Semtech", kind: "public", aliases: ["Semtech"],
    oneLiner: "光模块时钟恢复(CDR)/PMD 与信号芯片。", hq: "美国·卡马里奥", website: "semtech.com",
    stock: { exchange: "NASDAQ", ticker: "SMTC", marketCapB: 5 },
    business: "光通信 CDR/PMD 信号芯片、模拟混合信号 IC 与 LoRa 物联网，受益 AI 数据中心光互联。",
    competitors: ["mtsi", "mrvl"],
  },
  jnpr: {
    id: "jnpr", name: "瞻博网络", nameEn: "Juniper Networks", kind: "public", aliases: ["Juniper", "Juniper Networks", "瞻博"],
    oneLiner: "数据中心与电信网络设备商（现并入 HPE）。", hq: "美国·森尼维尔", website: "juniper.net",
    stock: { exchange: "NYSE", ticker: "JNPR", marketCapB: 12 },
    business: "路由器、交换机与 AI 驱动的网络运维(Mist)，光模块的下游买家。",
    competitors: ["csco", "anet", "nok"],
  },
  eric: {
    id: "eric", name: "爱立信", nameEn: "Ericsson", kind: "public", aliases: ["Ericsson", "爱立信"],
    oneLiner: "全球电信网络设备巨头。", hq: "瑞典·斯德哥尔摩", website: "ericsson.com",
    stock: { exchange: "NASDAQ", ticker: "ERIC", marketCapB: 28 },
    business: "5G/电信无线与传输网络设备，光传输是其重要一环。",
    competitors: ["nok", "cien"],
  },

  /* ============ 上市·能源 / 电力链 ============ */
  ceg: {
    id: "ceg", name: "Constellation", nameEn: "Constellation Energy", kind: "public", aliases: ["Constellation", "Constellation Energy"],
    oneLiner: "美国最大核电运营商，直接给 AI 数据中心供电。", hq: "美国·巴尔的摩", website: "constellationenergy.com",
    stock: { exchange: "NASDAQ", ticker: "CEG", marketCapB: 90 },
    business: "核电为主的无碳电力生产，与微软等签署数据中心长期供电协议（含重启三里岛）。",
    financials: [{ year: 2024, revenue: 23.6, netIncome: 3.7 }],
    competitors: ["vst", "nee"],
  },
  vst: {
    id: "vst", name: "Vistra", nameEn: "Vistra", kind: "public", aliases: ["Vistra"],
    oneLiner: "综合电力生产商，核电 + 燃气 + 储能。", hq: "美国·欧文", website: "vistracorp.com",
    stock: { exchange: "NYSE", ticker: "VST", marketCapB: 50 },
    business: "发电与零售电力，收购核电资产受益 AI 用电激增。", competitors: ["ceg", "nee"],
  },
  oklo: {
    id: "oklo", name: "Oklo", nameEn: "Oklo", kind: "public", aliases: ["Oklo"],
    oneLiner: "先进核裂变 / SMR 新锐，Sam Altman 押注。", hq: "美国·圣克拉拉", website: "oklo.com",
    stock: { exchange: "NYSE", ticker: "OKLO", marketCapB: 15 },
    business: "小型模块化反应堆(微堆)，瞄准数据中心专属供电。", competitors: ["smr", "ceg"],
  },
  smr: {
    id: "smr", name: "NuScale", nameEn: "NuScale Power", kind: "public", aliases: ["NuScale", "NuScale Power"],
    oneLiner: "小型模块化反应堆(SMR)先行者。", hq: "美国·波特兰", website: "nuscalepower.com",
    stock: { exchange: "NYSE", ticker: "SMR", marketCapB: 10 },
    business: "首个获 NRC 认证的 SMR 设计，面向数据中心等专属电力需求。", competitors: ["oklo", "ceg"],
  },
  cat: {
    id: "cat", name: "卡特彼勒", nameEn: "Caterpillar", kind: "public", aliases: ["Caterpillar", "卡特彼勒"],
    oneLiner: "工程机械巨头，也是数据中心备用 / 就地发电主力。", hq: "美国·欧文", website: "caterpillar.com",
    stock: { exchange: "NYSE", ticker: "CAT", marketCapB: 180 },
    business: "工程机械与燃气 / 柴油发电机组，AI 数据中心抢电期的供电设备供应商。",
    competitors: ["cmi", "gev"],
  },
  cmi: {
    id: "cmi", name: "康明斯", nameEn: "Cummins", kind: "public", aliases: ["Cummins", "康明斯"],
    oneLiner: "发动机与发电机组龙头。", hq: "美国·哥伦布", website: "cummins.com",
    stock: { exchange: "NYSE", ticker: "CMI", marketCapB: 50 },
    business: "发电机组、发动机与电力系统，数据中心备电常用。", competitors: ["cat", "gev"],
  },
  harmonic: {
    id: "harmonic", name: "哈默纳科", nameEn: "Harmonic Drive", kind: "public", aliases: ["Harmonic Drive", "哈默纳科"],
    oneLiner: "谐波减速器全球龙头，人形机器人关节核心。", hq: "日本·东京", website: "harmonicdrive.net",
    stock: { exchange: "TSE", ticker: "6324", marketCapB: 4 },
    business: "谐波减速器(精密减速器)，是人形机器人关节的关键零部件，全球份额领先。",
    competitors: ["teradyne"],
  },
  teradyne: {
    id: "teradyne", name: "泰瑞达", nameEn: "Teradyne", kind: "public", aliases: ["Teradyne", "泰瑞达"],
    oneLiner: "半导体测试设备 + 协作机器人(Universal Robots)。", hq: "美国·北雷丁", website: "teradyne.com",
    stock: { exchange: "NASDAQ", ticker: "TER", marketCapB: 25 },
    business: "芯片测试设备，并通过 Universal Robots 做协作机械臂，横跨芯片与机器人。",
    competitors: ["klac", "harmonic"],
  },

  /* ============ 上市·半导体供应链 ============ */
  asml: {
    id: "asml", name: "阿斯麦", nameEn: "ASML", kind: "public", aliases: ["ASML", "阿斯麦"],
    oneLiner: "全球唯一 EUV 光刻机供应商，半导体设备皇冠上的明珠。",
    hq: "荷兰·费尔德霍芬", website: "asml.com",
    stock: { exchange: "NASDAQ", ticker: "ASML", marketCapB: 380 },
    business: "光刻机（含独家 EUV/High-NA EUV），先进制程绕不开它，是整个芯片产业的咽喉。",
    financials: [{ year: 2024, revenue: 28.3, netIncome: 7.6 }],
    competitors: ["amat", "lrcx"],
  },
  amat: {
    id: "amat", name: "应用材料", nameEn: "Applied Materials", kind: "public", aliases: ["Applied Materials", "应用材料"],
    oneLiner: "全球最大半导体设备厂（沉积/刻蚀/CMP 等）。", hq: "美国·圣克拉拉", website: "appliedmaterials.com",
    stock: { exchange: "NASDAQ", ticker: "AMAT", marketCapB: 160 },
    business: "薄膜沉积、刻蚀、离子注入、量测等多类制造设备，覆盖面最广。",
    financials: [{ year: 2024, revenue: 27.2, netIncome: 7.2 }],
    competitors: ["lrcx", "klac", "asml"],
  },
  lrcx: {
    id: "lrcx", name: "泛林", nameEn: "Lam Research", kind: "public", aliases: ["Lam Research", "泛林", "Lam"],
    oneLiner: "刻蚀与沉积设备龙头，存储芯片制造关键。", hq: "美国·弗里蒙特", website: "lamresearch.com",
    stock: { exchange: "NASDAQ", ticker: "LRCX", marketCapB: 120 },
    business: "等离子刻蚀与薄膜沉积设备，在 3D NAND/DRAM 制造中份额领先。",
    competitors: ["amat", "klac"],
  },
  klac: {
    id: "klac", name: "科磊", nameEn: "KLA", kind: "public", aliases: ["KLA", "科磊"],
    oneLiner: "半导体量测与检测设备龙头。", hq: "美国·米尔皮塔斯", website: "kla.com",
    stock: { exchange: "NASDAQ", ticker: "KLAC", marketCapB: 100 },
    business: "缺陷检测与量测设备，保障先进制程良率。", competitors: ["amat", "lrcx"],
  },
  snps: {
    id: "snps", name: "新思科技", nameEn: "Synopsys", kind: "public", aliases: ["Synopsys", "新思", "新思科技"],
    oneLiner: "EDA 芯片设计软件双雄之一。", hq: "美国·森尼维尔", website: "synopsys.com",
    stock: { exchange: "NASDAQ", ticker: "SNPS", marketCapB: 90 },
    business: "EDA 工具、IP 与系统设计软件——没有它画不出现代芯片。", competitors: ["cdns"],
  },
  cdns: {
    id: "cdns", name: "楷登", nameEn: "Cadence", kind: "public", aliases: ["Cadence", "楷登"],
    oneLiner: "EDA 芯片设计软件双雄之一。", hq: "美国·圣何塞", website: "cadence.com",
    stock: { exchange: "NASDAQ", ticker: "CDNS", marketCapB: 90 },
    business: "EDA 工具、IP 与系统仿真，和新思共同主导芯片设计软件。", competitors: ["snps"],
  },
  ase: {
    id: "ase", name: "日月光", nameEn: "ASE Technology", kind: "public", aliases: ["ASE", "日月光"],
    oneLiner: "全球最大封装测试(OSAT)厂。", hq: "中国台湾·高雄", website: "aseglobal.com",
    stock: { exchange: "NYSE", ticker: "ASX", marketCapB: 25 },
    business: "芯片封装与测试，承接先进封装外包需求。", competitors: ["amkr", "tsm"],
  },
  amkr: {
    id: "amkr", name: "安靠", nameEn: "Amkor", kind: "public", aliases: ["Amkor", "安靠"],
    oneLiner: "美系封装测试龙头。", hq: "美国·坦佩", website: "amkor.com",
    stock: { exchange: "NASDAQ", ticker: "AMKR", marketCapB: 8 },
    business: "封装与测试服务，是西方供应链本地化的关键一环。", competitors: ["ase"],
  },

  /* ============ 上市·太空 ============ */
  rklb: {
    id: "rklb", name: "火箭实验室", nameEn: "Rocket Lab", kind: "public", aliases: ["Rocket Lab", "火箭实验室"],
    oneLiner: "小型可回收火箭 + 卫星系统的太空新贵。", hq: "美国·长滩", website: "rocketlabusa.com",
    stock: { exchange: "NASDAQ", ticker: "RKLB", marketCapB: 30 },
    business: "Electron 小型火箭、在研的中型可回收火箭 Neutron，以及卫星与航天系统，2026 订单饱满。",
    competitors: ["spacex", "asts"],
  },
  asts: {
    id: "asts", name: "AST SpaceMobile", nameEn: "AST SpaceMobile", kind: "public", aliases: ["AST SpaceMobile", "AST"],
    oneLiner: "卫星直连普通手机，无需地面基站。", hq: "美国·米德兰", website: "ast-science.com",
    stock: { exchange: "NASDAQ", ticker: "ASTS", marketCapB: 20 },
    business: "建设可与普通手机直连的低轨卫星星座，瞄准全球移动覆盖盲区。", competitors: ["spacex"],
  },

  /* ============ 未上市 ============ */
  spacex: {
    id: "spacex", name: "SpaceX", nameEn: "SpaceX", kind: "private", aliases: ["SpaceX", "Starlink", "星链"],
    oneLiner: "可回收火箭 + 星链 + 轨道数据中心，太空领域的绝对主角。",
    hq: "美国·霍桑", website: "spacex.com",
    business: "Falcon/Starship 可回收火箭、Starlink 卫星互联网、Starship 重型运力，并探索轨道数据中心。2026 启动史上最大规模 IPO 计划。",
    competitors: ["rklb", "asts"],
  },
  openai: {
    id: "openai", name: "OpenAI", nameEn: "OpenAI", kind: "private", aliases: ["OpenAI"],
    oneLiner: "ChatGPT 与 GPT/o 系列、Sora 的缔造者，本轮 AI 浪潮的引爆点。",
    hq: "美国·旧金山", website: "openai.com",
    business: "前沿大模型(GPT/o 系列)、ChatGPT 产品、Sora 视频生成、API 平台。微软是其最大投资方与云伙伴。",
    competitors: ["googl", "anthropic", "xai", "mistral"],
    investors: ["msft", "nvda"],
    partners: ["msft", "nvda", "onex"],
    keyCustomers: ["msft", "anysphere", "replit", "glean"],
    suppliers: ["nvda", "msft"],
  },
  anthropic: {
    id: "anthropic", name: "Anthropic", nameEn: "Anthropic", kind: "private", aliases: ["Anthropic"],
    oneLiner: "Claude 系列大模型的研发公司，主打安全与编程能力。",
    hq: "美国·旧金山", website: "anthropic.com",
    business: "Claude 大模型与 API，强调 AI 安全(Constitutional AI)，编程与智能体能力突出。亚马逊、谷歌为主要投资方。",
    competitors: ["openai", "googl", "xai", "mistral"],
    investors: ["amzn", "googl"],
    partners: ["amzn", "googl", "nvda"],
    keyCustomers: ["anysphere", "codeium", "replit", "glean"],
    suppliers: ["nvda", "amzn"],
  },
  xai: {
    id: "xai", name: "xAI", nameEn: "xAI", kind: "private", aliases: ["xAI"],
    oneLiner: "马斯克创立的 AI 公司，产品为 Grok。", hq: "美国·旧金山", website: "x.ai",
    business: "Grok 大模型，深度绑定 X 平台数据，自建 Colossus 超大算力集群。",
    competitors: ["openai", "googl", "anthropic"],
    partners: ["nvda"], suppliers: ["nvda", "skhynix"],
  },
  deepseek: {
    id: "deepseek", name: "深度求索", nameEn: "DeepSeek", kind: "private", aliases: ["深度求索", "DeepSeek", "幻方"],
    oneLiner: "中国开源大模型黑马，以极致性价比震动行业。", hq: "中国·杭州", website: "deepseek.com",
    business: "DeepSeek-V3/R1 等高性能开源模型，训练成本与推理价格大幅低于同行，推动开源平权。",
    competitors: ["baba", "openai"],
  },
  huawei: {
    id: "huawei", name: "华为", nameEn: "Huawei", kind: "private", aliases: ["华为", "Huawei"],
    oneLiner: "中国 ICT 巨头，昇腾 AI 芯片 + 盘古大模型自成体系。", hq: "中国·深圳", website: "huawei.com",
    business: "通信设备、终端、云与昇腾(Ascend)AI 芯片、鲲鹏 CPU、盘古大模型，构建国产算力闭环。",
    competitors: ["nvda", "intc"],
  },
  bostondynamics: {
    id: "bostondynamics", name: "波士顿动力", nameEn: "Boston Dynamics", kind: "private", aliases: ["Boston Dynamics", "波士顿动力"],
    oneLiner: "传奇机器人公司，Atlas 人形机器人的缔造者(现属现代汽车)。",
    hq: "美国·沃尔瑟姆", website: "bostondynamics.com",
    business: "Atlas 人形机器人、Spot 四足、Stretch 物流机器人，运动控制能力业界标杆。",
    competitors: ["tsla", "figure", "unitree"],
  },
  figure: {
    id: "figure", name: "Figure", nameEn: "Figure AI", kind: "private", aliases: ["Figure"],
    oneLiner: "明星人形机器人初创，主打通用具身智能。", hq: "美国·桑尼维尔", website: "figure.ai",
    business: "Figure 人形机器人与自研 Helix VLA 模型，目标工厂与家庭通用作业。",
    competitors: ["tsla", "bostondynamics", "onex", "apptronik", "agility"],
    investors: ["msft", "nvda", "openai"],
    partners: ["nvda"],
    suppliers: ["nvda", "harmonic"],
  },
  agility: {
    id: "agility", name: "Agility Robotics", nameEn: "Agility Robotics", kind: "private", aliases: ["Agility Robotics", "Agility"],
    oneLiner: "物流人形机器人 Digit 的开发商，已进仓库商用。", hq: "美国·科瓦利斯", website: "agilityrobotics.com",
    business: "Digit 双足人形机器人，主攻仓储搬运，已在亚马逊等场景试用。", competitors: ["figure", "apptronik", "bostondynamics"],
  },
  apptronik: {
    id: "apptronik", name: "Apptronik", nameEn: "Apptronik", kind: "private", aliases: ["Apptronik"],
    oneLiner: "人形机器人 Apollo 的开发商，与奔驰、GXO 合作。", hq: "美国·奥斯汀", website: "apptronik.com",
    business: "Apollo 通用人形机器人，瞄准制造与物流，获谷歌等投资。",
    competitors: ["figure", "agility", "tsla", "bostondynamics"],
    investors: ["googl"],
    suppliers: ["nvda"],
  },
  unitree: {
    id: "unitree", name: "宇树科技", nameEn: "Unitree", kind: "private", aliases: ["Unitree", "宇树", "宇树科技"],
    oneLiner: "中国人形/四足机器人黑马，以高性价比著称。", hq: "中国·杭州", website: "unitree.com",
    business: "G1 人形与四足机器人，价格大幅低于同行，出货量领先。", competitors: ["tsla", "figure"],
  },
  onex: {
    id: "onex", name: "1X", nameEn: "1X Technologies", kind: "private", aliases: ["1X", "1X NEO"],
    oneLiner: "挪威人形机器人公司，主打家用机器人 NEO。", hq: "挪威·莫斯", website: "1x.tech",
    business: "NEO 家用人形机器人，OpenAI 为投资方之一。",
    competitors: ["figure", "tsla", "apptronik"],
    investors: ["openai"],
    suppliers: ["nvda"],
  },
  anysphere: {
    id: "anysphere", name: "Anysphere", nameEn: "Anysphere (Cursor)", kind: "private", aliases: ["Anysphere", "Cursor"],
    oneLiner: "AI 代码编辑器 Cursor 的开发商，增长最快的 AI 编程工具之一。",
    hq: "美国·旧金山", website: "cursor.com",
    business: "Cursor —— 深度集成大模型的 AI 代码编辑器，主打整库理解与智能体式编程。",
    competitors: ["msft", "codeium", "replit"],
  },
  codeium: {
    id: "codeium", name: "Codeium", nameEn: "Codeium (Windsurf)", kind: "private", aliases: ["Codeium", "Windsurf"],
    oneLiner: "AI 编程工具 Windsurf 的开发商。", hq: "美国·山景城", website: "windsurf.com",
    business: "Windsurf 编辑器与代码补全/智能体，面向个人与企业。", competitors: ["anysphere", "msft"],
  },
  replit: {
    id: "replit", name: "Replit", nameEn: "Replit", kind: "private", aliases: ["Replit"],
    oneLiner: "云端 IDE，Replit Agent 让人人能「说话编程」。", hq: "美国·旧金山", website: "replit.com",
    business: "浏览器内云开发环境与 Replit Agent，自然语言生成并部署应用。", competitors: ["msft", "anysphere"],
  },
  mistral: {
    id: "mistral", name: "Mistral AI", nameEn: "Mistral AI", kind: "private", aliases: ["Mistral"],
    oneLiner: "欧洲开源大模型旗手，以 MoE 架构著称。", hq: "法国·巴黎", website: "mistral.ai",
    business: "Mistral/Mixtral 开源与商用模型，混合专家(MoE)架构高效。", competitors: ["meta", "openai"],
  },
  stabilityai: {
    id: "stabilityai", name: "Stability AI", nameEn: "Stability AI", kind: "private", aliases: ["Stability AI", "Stable Diffusion"],
    oneLiner: "开源图像生成模型 Stable Diffusion 的推手。", hq: "英国·伦敦", website: "stability.ai",
    business: "Stable Diffusion 系列开源生成模型(图像/视频/音频)。", competitors: ["midjourney", "adbe"],
  },
  midjourney: {
    id: "midjourney", name: "Midjourney", nameEn: "Midjourney", kind: "private", aliases: ["Midjourney"],
    oneLiner: "以画质著称的 AI 图像生成产品。", hq: "美国·旧金山", website: "midjourney.com",
    business: "高质量文生图服务，独立小团队、无外部融资仍高营收。", competitors: ["stabilityai", "openai", "adbe"],
  },
  physicalint: {
    id: "physicalint", name: "Physical Intelligence", nameEn: "Physical Intelligence", kind: "private", aliases: ["Physical Intelligence", "π0", "Pi"],
    oneLiner: "机器人基础模型公司，打造通用「动作大模型」。", hq: "美国·旧金山", website: "physicalintelligence.company",
    business: "π0 等跨本体通用机器人策略模型，目标让一个模型驱动各种机器人。",
    competitors: ["covariant", "googl", "figure"],
    investors: ["openai"],
    suppliers: ["nvda"],
  },
  covariant: {
    id: "covariant", name: "Covariant", nameEn: "Covariant", kind: "private", aliases: ["Covariant"],
    oneLiner: "仓储机器人 AI 公司，主攻拣选大模型。", hq: "美国·埃默里维尔", website: "covariant.ai",
    business: "RFM 机器人基础模型，用于仓储分拣等真实操作任务。", competitors: ["physicalint"],
  },
  ai21: {
    id: "ai21", name: "AI21 Labs", nameEn: "AI21 Labs", kind: "private", aliases: ["AI21"],
    oneLiner: "以色列大模型公司，Jamba 融合 SSM 与 Transformer。", hq: "以色列·特拉维夫", website: "ai21.com",
    business: "Jurassic/Jamba 模型，Jamba 采用 Mamba(SSM)+Transformer 混合架构处理超长上下文。",
    competitors: ["openai", "mistral"],
  },
  insilico: {
    id: "insilico", name: "英矽智能", nameEn: "Insilico Medicine", kind: "private", aliases: ["Insilico Medicine", "英矽智能"],
    oneLiner: "AI 制药公司，端到端生成式药物发现。", hq: "中国香港 / 美国", website: "insilico.com",
    business: "用生成式 AI 做靶点发现与分子设计，多条管线进入临床。", competitors: ["rxrx"],
  },
  perplexity: {
    id: "perplexity", name: "Perplexity", nameEn: "Perplexity", kind: "private", aliases: ["Perplexity"],
    oneLiner: "对话式 AI 搜索引擎的代表。", hq: "美国·旧金山", website: "perplexity.ai",
    business: "用大模型 + 实时检索做「答案引擎」，挑战传统搜索。", competitors: ["googl", "openai"],
  },
  gm: {
    id: "gm", name: "通用汽车", nameEn: "General Motors", kind: "public", aliases: ["GM", "General Motors", "Cruise", "通用汽车"],
    oneLiner: "美国汽车巨头，旗下 Cruise 做自动驾驶。", hq: "美国·底特律", website: "gm.com",
    stock: { exchange: "NYSE", ticker: "GM", marketCapB: 55 },
    business: "整车制造与电动化，自动驾驶子公司 Cruise 运营 Robotaxi。", competitors: ["tsla", "googl"],
  },
  glean: {
    id: "glean", name: "Glean", nameEn: "Glean", kind: "private", aliases: ["Glean"],
    oneLiner: "企业 AI 搜索与工作助手。", hq: "美国·帕洛阿尔托", website: "glean.com",
    business: "连接企业内部各系统的 AI 搜索与智能体，帮员工找信息、自动化工作。",
    competitors: ["msft", "now"],
  },

  /* ============ 开源 · 学术 · 联盟 ============ */
  oss_graph: {
    id: "oss_graph", name: "图机器学习开源社区", nameEn: "PyG / DGL", kind: "oss", aliases: ["开源", "PyG / DGL", "PyG", "DGL"],
    oneLiner: "图神经网络的主流开源框架。", website: "pyg.org",
    business: "PyTorch Geometric 与 DGL 等开源库，是学术与工业界做图神经网络的基础工具。",
  },
  mamba: {
    id: "mamba", name: "Mamba（学术）", nameEn: "Mamba", kind: "oss", aliases: ["Mamba"],
    oneLiner: "状态空间模型(SSM)的代表，Transformer 的高效挑战者。", website: "github.com/state-spaces/mamba",
    business: "由卡内基梅隆与普林斯顿研究者提出的 SSM 架构，线性复杂度处理超长序列。", competitors: ["ai21"],
  },
  llava: {
    id: "llava", name: "LLaVA（学术）", nameEn: "LLaVA", kind: "oss", aliases: ["LLaVA"],
    oneLiner: "开源视觉语言模型的代表作。", website: "llava-vl.github.io",
    business: "把视觉编码器接到开源 LLM 上的多模态模型，是开源 VLM 研究的常用基线。",
  },
  openvla: {
    id: "openvla", name: "OpenVLA（学术）", nameEn: "OpenVLA", kind: "oss", aliases: ["OpenVLA"],
    oneLiner: "开源的视觉-语言-动作机器人模型。", website: "openvla.github.io",
    business: "斯坦福等团队开源的 VLA 模型，让机器人从图像+指令直接输出动作。", competitors: ["physicalint"],
  },
  ualink: {
    id: "ualink", name: "UALink 联盟", nameEn: "UALink Consortium", kind: "oss", aliases: ["UALink", "UALink 联盟"],
    oneLiner: "对标 NVLink 的开放加速器互联标准联盟。", website: "ualinkconsortium.org",
    business: "AMD、博通、谷歌等共同推动的开放 GPU/加速器高速互联标准，挑战英伟达 NVLink。",
    competitors: ["nvda"],
  },

  /* ============ 扩充·生成式媒体（语音 / 音乐 / 视频 / 数字人）============ */
  elevenlabs: {
    id: "elevenlabs", name: "ElevenLabs", nameEn: "ElevenLabs", kind: "private", aliases: ["ElevenLabs", "11Labs"],
    oneLiner: "最逼真的 AI 语音合成与配音平台。", hq: "美国·纽约", website: "elevenlabs.io",
    business: "文本转语音、语音克隆与多语种配音 API，广泛用于有声书、游戏与视频创作。",
    competitors: ["openai", "runwayml"],
  },
  runwayml: {
    id: "runwayml", name: "Runway", nameEn: "Runway", kind: "private", aliases: ["Runway", "RunwayML"],
    oneLiner: "AI 视频生成先驱，Gen 系列模型。", hq: "美国·纽约", website: "runwayml.com",
    business: "Gen-3/Gen-4 文生视频与视频编辑工具，面向影视与广告创作。",
    competitors: ["openai", "pika", "luma", "googl"],
  },
  pika: {
    id: "pika", name: "Pika", nameEn: "Pika Labs", kind: "private", aliases: ["Pika", "Pika Labs"],
    oneLiner: "主打易用与特效的 AI 视频生成。", hq: "美国·帕洛阿尔托", website: "pika.art",
    business: "文/图生视频与创意特效，社区驱动增长快。", competitors: ["runwayml", "luma", "openai"],
  },
  luma: {
    id: "luma", name: "Luma AI", nameEn: "Luma AI", kind: "private", aliases: ["Luma", "Luma AI", "Dream Machine"],
    oneLiner: "Dream Machine 视频生成与 3D 重建。", hq: "美国·帕洛阿尔托", website: "lumalabs.ai",
    business: "Dream Machine 文生视频与 NeRF/3D 捕捉，兼顾视频与三维内容。",
    competitors: ["runwayml", "pika", "openai"],
  },
  suno: {
    id: "suno", name: "Suno", nameEn: "Suno", kind: "private", aliases: ["Suno"],
    oneLiner: "现象级 AI 音乐生成，一句话生成整首歌。", hq: "美国·剑桥(麻省)", website: "suno.com",
    business: "文本生成带人声的完整歌曲，重塑音乐创作，面临版权争议。", competitors: ["udio"],
  },
  udio: {
    id: "udio", name: "Udio", nameEn: "Udio", kind: "private", aliases: ["Udio"],
    oneLiner: "高音质 AI 音乐生成，Suno 的主要对手。", hq: "美国·纽约", website: "udio.com",
    business: "AI 音乐生成平台，主打音质与可控性。", competitors: ["suno"],
  },
  heygen: {
    id: "heygen", name: "HeyGen", nameEn: "HeyGen", kind: "private", aliases: ["HeyGen"],
    oneLiner: "AI 数字人视频与口播生成。", hq: "美国·洛杉矶", website: "heygen.com",
    business: "用 AI 头像 + 语音克隆批量生成多语种口播视频，主攻营销与培训。",
    competitors: ["synthesia", "elevenlabs"],
  },
  synthesia: {
    id: "synthesia", name: "Synthesia", nameEn: "Synthesia", kind: "private", aliases: ["Synthesia"],
    oneLiner: "企业级 AI 数字人视频平台。", hq: "英国·伦敦", website: "synthesia.io",
    business: "AI 虚拟主播生成企业培训与沟通视频，客户覆盖大量世界 500 强。",
    competitors: ["heygen"],
  },
  ideogram: {
    id: "ideogram", name: "Ideogram", nameEn: "Ideogram", kind: "private", aliases: ["Ideogram"],
    oneLiner: "擅长文字排版的 AI 图像生成。", hq: "美国·多伦多/旧金山", website: "ideogram.ai",
    business: "文生图工具，尤其擅长在图中准确生成文字与海报排版。",
    competitors: ["midjourney", "openai", "adbe"],
  },
  blackforest: {
    id: "blackforest", name: "Black Forest Labs", nameEn: "Black Forest Labs", kind: "private", aliases: ["Black Forest Labs", "FLUX", "Flux"],
    oneLiner: "开源图像模型 FLUX 的开发商，原 Stable Diffusion 核心团队。",
    hq: "德国·弗莱堡", website: "blackforestlabs.ai",
    business: "FLUX 系列高质量开源/商用图像生成模型，被 X(Grok) 等集成。",
    competitors: ["stabilityai", "midjourney", "openai"],
  },

  /* ============ 扩充·AI 加速芯片（新架构）============ */
  groq: {
    id: "groq", name: "Groq", nameEn: "Groq", kind: "private", aliases: ["Groq", "LPU"],
    oneLiner: "LPU 推理芯片，主打超低延迟大模型推理。", hq: "美国·山景城", website: "groq.com",
    business: "自研 LPU(语言处理单元)与 GroqCloud，以极快的 token 生成速度切入推理市场。",
    competitors: ["nvda", "cerebras", "sambanova"],
  },
  cerebras: {
    id: "cerebras", name: "Cerebras", nameEn: "Cerebras Systems", kind: "private", aliases: ["Cerebras"],
    oneLiner: "晶圆级引擎(WSE)——世界最大的 AI 芯片。", hq: "美国·森尼维尔", website: "cerebras.ai",
    business: "把整块晶圆做成一颗巨型芯片(WSE-3)，主打超大模型训练与高速推理。",
    competitors: ["nvda", "groq", "sambanova"],
  },
  sambanova: {
    id: "sambanova", name: "SambaNova", nameEn: "SambaNova Systems", kind: "private", aliases: ["SambaNova"],
    oneLiner: "数据流架构 AI 芯片与整机系统。", hq: "美国·帕洛阿尔托", website: "sambanova.ai",
    business: "可重构数据流单元(RDU)与 AI 一体机，面向企业私有部署大模型。",
    competitors: ["nvda", "groq", "cerebras"],
  },
  graphcore: {
    id: "graphcore", name: "Graphcore", nameEn: "Graphcore", kind: "private", aliases: ["Graphcore", "IPU"],
    oneLiner: "IPU 智能处理器，已被软银收购。", hq: "英国·布里斯托", website: "graphcore.ai",
    business: "IPU(智能处理单元)架构 AI 芯片，2024 年被软银收购。",
    competitors: ["nvda", "cerebras"],
  },
  tenstorrent: {
    id: "tenstorrent", name: "Tenstorrent", nameEn: "Tenstorrent", kind: "private", aliases: ["Tenstorrent"],
    oneLiner: "Jim Keller 掌舵的 RISC-V + AI 芯片新锐。", hq: "加拿大·多伦多", website: "tenstorrent.com",
    business: "基于 RISC-V 的 AI 处理器与 IP 授权，走开放路线挑战英伟达。",
    competitors: ["nvda", "arm", "amd"],
  },
  etched: {
    id: "etched", name: "Etched", nameEn: "Etched", kind: "private", aliases: ["Etched", "Sohu"],
    oneLiner: "把 Transformer 直接刻进芯片的 ASIC。", hq: "美国·库比蒂诺", website: "etched.com",
    business: "Sohu 芯片专为 Transformer 架构定制，宣称推理吞吐远超 GPU。",
    competitors: ["nvda", "groq"],
  },

  /* ============ 扩充·AI 云算力（Neoclouds）============ */
  crwv: {
    id: "crwv", name: "CoreWeave", nameEn: "CoreWeave", kind: "public", aliases: ["CoreWeave"],
    oneLiner: "最大的 AI 专属 GPU 云，2025 年上市。", hq: "美国·利文斯顿", website: "coreweave.com",
    stock: { exchange: "NASDAQ", ticker: "CRWV", marketCapB: 70 },
    business: "以英伟达 GPU 为核心的 AI 云算力租赁，微软、OpenAI 等为大客户。",
    competitors: ["lambda", "crusoe", "nbis", "amzn"], keyCustomers: ["msft", "openai"], suppliers: ["nvda"],
  },
  lambda: {
    id: "lambda", name: "Lambda", nameEn: "Lambda", kind: "private", aliases: ["Lambda", "Lambda Labs"],
    oneLiner: "面向研究者与企业的 GPU 云与工作站。", hq: "美国·旧金山", website: "lambdalabs.com",
    business: "GPU 云、AI 工作站与集群，主打易用与性价比。", competitors: ["crwv", "crusoe"], suppliers: ["nvda"],
  },
  crusoe: {
    id: "crusoe", name: "Crusoe", nameEn: "Crusoe Energy", kind: "private", aliases: ["Crusoe", "Crusoe Energy"],
    oneLiner: "用低碳能源驱动的 AI 数据中心与 GPU 云。", hq: "美国·丹佛", website: "crusoe.ai",
    business: "自建低碳(弃电/天然气)供电的 AI 数据中心与 GPU 云，绑定能源与算力。",
    competitors: ["crwv", "lambda"], suppliers: ["nvda"],
  },
  nbis: {
    id: "nbis", name: "Nebius", nameEn: "Nebius Group", kind: "public", aliases: ["Nebius"],
    oneLiner: "源自 Yandex 的欧洲 AI 云算力商。", hq: "荷兰·阿姆斯特丹", website: "nebius.com",
    stock: { exchange: "NASDAQ", ticker: "NBIS", marketCapB: 20 },
    business: "全栈 AI 云与 GPU 算力，自建数据中心，英伟达为战略投资方之一。",
    competitors: ["crwv", "lambda", "crusoe"], suppliers: ["nvda"], investors: ["nvda"],
  },
  together: {
    id: "together", name: "Together AI", nameEn: "Together AI", kind: "private", aliases: ["Together", "Together AI"],
    oneLiner: "开源模型的推理/训练云平台。", hq: "美国·旧金山", website: "together.ai",
    business: "为开源大模型提供高性价比推理与微调云，主打开放生态。",
    competitors: ["fireworks", "crwv"], suppliers: ["nvda"],
  },
  fireworks: {
    id: "fireworks", name: "Fireworks AI", nameEn: "Fireworks AI", kind: "private", aliases: ["Fireworks", "Fireworks AI"],
    oneLiner: "极速开源模型推理平台。", hq: "美国·雷德伍德城", website: "fireworks.ai",
    business: "面向开发者的高速、低成本大模型推理 API，主打开源模型托管。",
    competitors: ["together", "openai"],
  },

  /* ============ 扩充·AI 开发框架 / 数据底座 ============ */
  huggingface: {
    id: "huggingface", name: "Hugging Face", nameEn: "Hugging Face", kind: "private", aliases: ["Hugging Face", "HuggingFace"],
    oneLiner: "开源 AI 社区与模型托管中心——AI 界的 GitHub。", hq: "美国·纽约", website: "huggingface.co",
    business: "模型/数据集托管、Transformers 库与协作平台，开源 AI 生态的枢纽。",
    competitors: ["googl", "msft"],
  },
  databricks: {
    id: "databricks", name: "Databricks", nameEn: "Databricks", kind: "private", aliases: ["Databricks", "DBRX", "Mosaic", "MosaicML"],
    oneLiner: "数据 + AI 一体化平台，估值最高的 AI 独角兽之一。", hq: "美国·旧金山", website: "databricks.com",
    business: "湖仓一体(Lakehouse)数据平台与 DBRX 开源模型，帮企业用自有数据训练/部署 AI。",
    competitors: ["snow", "msft", "googl"],
  },
  snow: {
    id: "snow", name: "Snowflake", nameEn: "Snowflake", kind: "public", aliases: ["Snowflake"],
    oneLiner: "云数据仓库龙头，向 AI 数据平台延伸。", hq: "美国·博兹曼", website: "snowflake.com",
    stock: { exchange: "NYSE", ticker: "SNOW", marketCapB: 60 },
    business: "云数据云与 Cortex AI，帮企业在数据上直接跑 AI。", competitors: ["databricks", "msft"],
  },
  pinecone: {
    id: "pinecone", name: "Pinecone", nameEn: "Pinecone", kind: "private", aliases: ["Pinecone"],
    oneLiner: "最流行的向量数据库，RAG 标配。", hq: "美国·纽约", website: "pinecone.io",
    business: "托管向量数据库，为检索增强(RAG)与语义搜索提供长期记忆。",
    competitors: ["weaviate", "chroma"],
  },
  weaviate: {
    id: "weaviate", name: "Weaviate", nameEn: "Weaviate", kind: "private", aliases: ["Weaviate"],
    oneLiner: "开源向量数据库。", hq: "荷兰·阿姆斯特丹", website: "weaviate.io",
    business: "开源向量数据库与混合检索，面向 RAG 与 AI 搜索。", competitors: ["pinecone", "chroma"],
  },
  chroma: {
    id: "chroma", name: "Chroma", nameEn: "Chroma", kind: "private", aliases: ["Chroma", "ChromaDB"],
    oneLiner: "开发者友好的开源向量库。", hq: "美国·旧金山", website: "trychroma.com",
    business: "轻量开源向量数据库，深受 AI 应用开发者欢迎。", competitors: ["pinecone", "weaviate"],
  },
  langchain: {
    id: "langchain", name: "LangChain", nameEn: "LangChain", kind: "private", aliases: ["LangChain", "LangGraph"],
    oneLiner: "最流行的大模型应用编排框架。", hq: "美国·旧金山", website: "langchain.com",
    business: "LangChain/LangGraph 开发框架与 LangSmith 可观测平台，串起模型、工具与数据。",
    competitors: ["llamaindex"],
  },
  llamaindex: {
    id: "llamaindex", name: "LlamaIndex", nameEn: "LlamaIndex", kind: "private", aliases: ["LlamaIndex"],
    oneLiner: "面向 RAG 的数据编排框架。", hq: "美国·旧金山", website: "llamaindex.ai",
    business: "把企业数据接进大模型的检索/索引框架，主攻知识型 AI 应用。",
    competitors: ["langchain"],
  },
  scaleai: {
    id: "scaleai", name: "Scale AI", nameEn: "Scale AI", kind: "private", aliases: ["Scale AI", "Scale"],
    oneLiner: "AI 训练数据标注与评测龙头。", hq: "美国·旧金山", website: "scale.com",
    business: "为大模型提供数据标注、RLHF 与评测，Meta 于 2025 年大额入股。",
    competitors: ["surge"], investors: ["meta"], keyCustomers: ["openai", "meta"],
  },
  surge: {
    id: "surge", name: "Surge AI", nameEn: "Surge AI", kind: "private", aliases: ["Surge AI", "Surge"],
    oneLiner: "高质量 RLHF 数据标注新贵。", hq: "美国·旧金山", website: "surgehq.ai",
    business: "面向前沿实验室的高质量人类反馈与数据标注服务。", competitors: ["scaleai"],
  },

  /* ============ 扩充·大模型 / 实验室 ============ */
  cohere: {
    id: "cohere", name: "Cohere", nameEn: "Cohere", kind: "private", aliases: ["Cohere", "Command"],
    oneLiner: "面向企业的大模型公司，主打私有部署。", hq: "加拿大·多伦多", website: "cohere.com",
    business: "Command 系列大模型与 Embed/Rerank 检索模型，专注企业级安全部署。",
    competitors: ["openai", "anthropic", "mistral"],
  },
  reka: {
    id: "reka", name: "Reka AI", nameEn: "Reka AI", kind: "private", aliases: ["Reka", "Reka AI"],
    oneLiner: "多模态大模型新锐。", hq: "美国·旧金山", website: "reka.ai",
    business: "Reka 系列原生多模态模型，团队来自 DeepMind/FAIR。", competitors: ["openai", "googl"],
  },
  zeroone: {
    id: "zeroone", name: "零一万物", nameEn: "01.AI", kind: "private", aliases: ["零一万物", "01.AI", "Yi"],
    oneLiner: "李开复创立的中国大模型公司，Yi 系列开源。", hq: "中国·北京", website: "01.ai",
    business: "Yi 系列开源大模型与应用，主打高性价比与中英双语。", competitors: ["deepseek", "baba", "moonshot2"],
  },
  moonshot2: {
    id: "moonshot2", name: "月之暗面", nameEn: "Moonshot AI", kind: "private", aliases: ["月之暗面", "Moonshot", "Kimi"],
    oneLiner: "中国大模型独角兽，Kimi 以超长上下文见长。", hq: "中国·北京", website: "moonshot.cn",
    business: "Kimi 助手与月之暗面大模型，长上下文能力突出。", competitors: ["deepseek", "zeroone", "baba"], investors: ["baba"],
  },

  /* ============ 扩充·代码 / 企业智能体 ============ */
  cognition: {
    id: "cognition", name: "Cognition", nameEn: "Cognition AI", kind: "private", aliases: ["Cognition", "Devin"],
    oneLiner: "首个「AI 软件工程师」Devin 的开发商。", hq: "美国·纽约", website: "cognition.ai",
    business: "Devin —— 能自主完成编程任务的 AI 智能体，2025 年收购 Windsurf。",
    competitors: ["anysphere", "msft", "replit"],
  },
  tabnine: {
    id: "tabnine", name: "Tabnine", nameEn: "Tabnine", kind: "private", aliases: ["Tabnine"],
    oneLiner: "注重隐私与私有部署的 AI 代码助手。", hq: "以色列·特拉维夫", website: "tabnine.com",
    business: "企业级 AI 代码补全与智能体，支持私有化与合规部署。",
    competitors: ["msft", "anysphere", "codeium"],
  },
  vercel: {
    id: "vercel", name: "Vercel", nameEn: "Vercel", kind: "private", aliases: ["Vercel", "v0"],
    oneLiner: "前端云平台，v0 用 AI 生成界面。", hq: "美国·旧金山", website: "vercel.com",
    business: "Next.js 与前端部署云，v0 从提示词生成可用 UI 代码。",
    competitors: ["replit", "anysphere"],
  },
  writer: {
    id: "writer", name: "Writer", nameEn: "Writer", kind: "private", aliases: ["Writer", "Writer AI"],
    oneLiner: "面向企业的全栈生成式 AI 平台。", hq: "美国·旧金山", website: "writer.com",
    business: "自研 Palmyra 模型与企业工作流平台，主攻大企业内容与知识场景。",
    competitors: ["crm", "glean", "cohere"],
  },
  sierra: {
    id: "sierra", name: "Sierra", nameEn: "Sierra", kind: "private", aliases: ["Sierra", "Sierra AI"],
    oneLiner: "Bret Taylor 创立的企业级 AI 客服智能体。", hq: "美国·旧金山", website: "sierra.ai",
    business: "面向企业的对话式 AI 客服智能体平台，主打真实业务落地。",
    competitors: ["crm", "decagon"],
  },
  decagon: {
    id: "decagon", name: "Decagon", nameEn: "Decagon", kind: "private", aliases: ["Decagon"],
    oneLiner: "AI 客服智能体新贵。", hq: "美国·旧金山", website: "decagon.ai",
    business: "面向企业的 AI 客服智能体，自动化大规模客户支持。", competitors: ["sierra", "crm"],
  },
  harvey: {
    id: "harvey", name: "Harvey", nameEn: "Harvey", kind: "private", aliases: ["Harvey", "Harvey AI"],
    oneLiner: "法律行业专用的 AI 智能体。", hq: "美国·旧金山", website: "harvey.ai",
    business: "面向律所与法务的生成式 AI，处理合同、检索与起草。",
    competitors: ["openai", "thomson"],
  },
  hebbia: {
    id: "hebbia", name: "Hebbia", nameEn: "Hebbia", kind: "private", aliases: ["Hebbia"],
    oneLiner: "面向金融/专业服务的 AI 知识智能体。", hq: "美国·纽约", website: "hebbia.com",
    business: "Matrix 平台对海量文档做检索与分析，主攻投行、PE 等专业场景。",
    competitors: ["glean", "openai"],
  },
  characterai: {
    id: "characterai", name: "Character.AI", nameEn: "Character.AI", kind: "private", aliases: ["Character.AI", "Character AI", "c.ai"],
    oneLiner: "AI 角色扮演聊天平台，用户黏性极高。", hq: "美国·门洛帕克", website: "character.ai",
    business: "可自定义 AI 角色的对话娱乐平台；核心团队 2024 年加入谷歌。",
    competitors: ["openai", "meta"], investors: ["googl"],
  },
  inflection: {
    id: "inflection", name: "Inflection AI", nameEn: "Inflection AI", kind: "private", aliases: ["Inflection", "Pi"],
    oneLiner: "个人 AI 助手 Pi 的开发商，后转向企业。", hq: "美国·帕洛阿尔托", website: "inflection.ai",
    business: "曾推出情感陪伴助手 Pi，2024 年核心团队加入微软，转向企业 AI。",
    competitors: ["openai", "msft"],
  },

  /* ============ 扩充·机器人 / 自动驾驶 ============ */
  sanctuary: {
    id: "sanctuary", name: "Sanctuary AI", nameEn: "Sanctuary AI", kind: "private", aliases: ["Sanctuary", "Sanctuary AI"],
    oneLiner: "加拿大人形机器人公司，主打灵巧手操作。", hq: "加拿大·温哥华", website: "sanctuary.ai",
    business: "Phoenix 人形机器人与 Carbon 控制系统，强调类人灵巧操作。",
    competitors: ["figure", "tsla", "apptronik"],
  },
  fourier: {
    id: "fourier", name: "傅利叶", nameEn: "Fourier Intelligence", kind: "private", aliases: ["傅利叶", "Fourier", "Fourier Intelligence"],
    oneLiner: "中国人形与康复机器人公司。", hq: "中国·上海", website: "fftai.com",
    business: "GR 系列通用人形机器人与康复机器人，产学结合落地。",
    competitors: ["unitree", "tsla", "figure"],
  },
  mbly: {
    id: "mbly", name: "Mobileye", nameEn: "Mobileye", kind: "public", aliases: ["Mobileye"],
    oneLiner: "自动驾驶视觉与芯片老牌龙头（英特尔控股）。", hq: "以色列·耶路撒冷", website: "mobileye.com",
    stock: { exchange: "NASDAQ", ticker: "MBLY", marketCapB: 15 },
    business: "EyeQ 视觉芯片与 ADAS/自动驾驶方案，供货全球主流车企。",
    competitors: ["nvda", "tsla", "aurora"],
  },
  aurora: {
    id: "aurora", name: "Aurora", nameEn: "Aurora Innovation", kind: "public", aliases: ["Aurora", "Aurora Innovation"],
    oneLiner: "自动驾驶卡车领先者，已开启无人商运。", hq: "美国·匹兹堡", website: "aurora.tech",
    stock: { exchange: "NASDAQ", ticker: "AUR", marketCapB: 12 },
    business: "Aurora Driver 自动驾驶系统，率先在美国德州开展无人重卡货运。",
    competitors: ["tsla", "waymo", "kodiak"],
  },
  wayve: {
    id: "wayve", name: "Wayve", nameEn: "Wayve", kind: "private", aliases: ["Wayve"],
    oneLiner: "端到端学习的自动驾驶英国新锐。", hq: "英国·伦敦", website: "wayve.ai",
    business: "用端到端 AI(无高精地图)做通用自动驾驶，获软银、英伟达投资。",
    competitors: ["tsla", "waymo", "mbly"], investors: ["nvda"],
  },
  nuro: {
    id: "nuro", name: "Nuro", nameEn: "Nuro", kind: "private", aliases: ["Nuro"],
    oneLiner: "无人配送车先驱，转向授权自动驾驶。", hq: "美国·山景城", website: "nuro.ai",
    business: "自研 Nuro Driver，从无人配送转向对外授权 L4 自动驾驶方案。",
    competitors: ["waymo", "tsla"],
  },

  /* ============ 扩充·数字生物 ============ */
  xaira: {
    id: "xaira", name: "Xaira", nameEn: "Xaira Therapeutics", kind: "private", aliases: ["Xaira", "Xaira Therapeutics"],
    oneLiner: "重金起步的 AI 药物发现公司。", hq: "美国·旧金山湾区", website: "xaira.com",
    business: "由 ARCH 等重金孵化，用生成式 AI 与大规模实验做新药发现。",
    competitors: ["isomorphic", "rxrx", "insilico"],
  },
  evoscale: {
    id: "evoscale", name: "EvolutionaryScale", nameEn: "EvolutionaryScale", kind: "private", aliases: ["EvolutionaryScale", "ESM3", "ESM"],
    oneLiner: "蛋白质大语言模型 ESM3 的开发商。", hq: "美国·纽约", website: "evolutionaryscale.ai",
    business: "ESM 系列蛋白质语言模型，能生成全新蛋白，原 Meta FAIR 团队创立。",
    competitors: ["googl", "isomorphic"],
  },

  /* ============ 第二波·中国大模型 / 芯片 / 机器人 ============ */
  minimax: {
    id: "minimax", name: "MiniMax", nameEn: "MiniMax", kind: "private", aliases: ["MiniMax", "海螺", "Hailuo"],
    oneLiner: "中国大模型独角兽，海螺 AI 与视频生成出圈。", hq: "中国·上海", website: "minimaxi.com",
    business: "自研大模型与海螺 AI 助手、Hailuo 视频生成，出海表现亮眼。",
    competitors: ["deepseek", "moonshot2", "zhipu"],
  },
  zhipu: {
    id: "zhipu", name: "智谱 AI", nameEn: "Zhipu AI", kind: "private", aliases: ["智谱", "智谱 AI", "Zhipu", "GLM"],
    oneLiner: "清华系大模型公司，GLM 系列。", hq: "中国·北京", website: "zhipuai.cn",
    business: "GLM 系列大模型与企业应用，中国「AI 六小龙」之一。",
    competitors: ["deepseek", "moonshot2", "baba"],
  },
  stepfun: {
    id: "stepfun", name: "阶跃星辰", nameEn: "StepFun", kind: "private", aliases: ["阶跃星辰", "StepFun", "Step"],
    oneLiner: "中国多模态大模型公司。", hq: "中国·上海", website: "stepfun.com",
    business: "Step 系列多模态大模型，主打万亿参数与多模态能力。",
    competitors: ["zhipu", "minimax", "deepseek"],
  },
  sensetime: {
    id: "sensetime", name: "商汤科技", nameEn: "SenseTime", kind: "public", aliases: ["商汤", "商汤科技", "SenseTime", "日日新"],
    oneLiner: "中国 AI 视觉与大模型老牌公司。", hq: "中国·上海", website: "sensetime.com",
    stock: { exchange: "HKEX", ticker: "0020", marketCapB: 12 },
    business: "计算机视觉起家，日日新(SenseNova)大模型与 AI 算力基础设施。",
    competitors: ["baba", "zhipu", "iflytek"],
  },
  iflytek: {
    id: "iflytek", name: "科大讯飞", nameEn: "iFlytek", kind: "public", aliases: ["科大讯飞", "iFlytek", "讯飞", "星火"],
    oneLiner: "中国智能语音龙头，星火大模型。", hq: "中国·合肥", website: "iflytek.com",
    stock: { exchange: "SZSE", ticker: "002230", marketCapB: 18 },
    business: "智能语音、翻译与教育硬件，讯飞星火大模型自研自主可控。",
    competitors: ["baba", "baidu", "sensetime"],
  },
  cambricon: {
    id: "cambricon", name: "寒武纪", nameEn: "Cambricon", kind: "public", aliases: ["寒武纪", "Cambricon", "思元"],
    oneLiner: "中国 AI 芯片第一股，思元系列。", hq: "中国·北京", website: "cambricon.com",
    stock: { exchange: "SSE", ticker: "688256", marketCapB: 40 },
    business: "思元(MLU)系列 AI 训练/推理芯片，国产算力替代核心标的。",
    competitors: ["nvda", "huawei", "hygon"],
  },
  moorethreads: {
    id: "moorethreads", name: "摩尔线程", nameEn: "Moore Threads", kind: "private", aliases: ["摩尔线程", "Moore Threads", "MTT"],
    oneLiner: "国产全功能 GPU 新锐。", hq: "中国·北京", website: "mthreads.com",
    business: "自研全功能 GPU(MTT 系列)，覆盖 AI 计算与图形，冲刺国产替代。",
    competitors: ["nvda", "biren", "huawei"],
  },
  biren: {
    id: "biren", name: "壁仞科技", nameEn: "Biren", kind: "private", aliases: ["壁仞", "壁仞科技", "Biren"],
    oneLiner: "国产高端 GPGPU 新锐。", hq: "中国·上海", website: "birentech.com",
    business: "壁砺(BR)系列通用 GPU，面向 AI 训练与通用计算。",
    competitors: ["nvda", "moorethreads", "huawei"],
  },
  hygon: {
    id: "hygon", name: "海光信息", nameEn: "Hygon", kind: "public", aliases: ["海光", "海光信息", "Hygon"],
    oneLiner: "国产 CPU + DCU 加速卡厂商。", hq: "中国·天津", website: "hygon.cn",
    stock: { exchange: "SSE", ticker: "688041", marketCapB: 60 },
    business: "x86 CPU 与 DCU(深度计算单元)加速卡，国产算力重要一极。",
    competitors: ["cambricon", "nvda", "intc"],
  },
  ubtech: {
    id: "ubtech", name: "优必选", nameEn: "UBTech", kind: "public", aliases: ["优必选", "UBTech", "Walker"],
    oneLiner: "中国人形机器人第一股。", hq: "中国·深圳", website: "ubtrobot.com",
    stock: { exchange: "HKEX", ticker: "9880", marketCapB: 10 },
    business: "Walker 系列人形机器人，率先进入工厂实训，教育机器人起家。",
    competitors: ["unitree", "tsla", "fourier"],
  },
  agibot: {
    id: "agibot", name: "智元机器人", nameEn: "AgiBot", kind: "private", aliases: ["智元", "智元机器人", "AgiBot", "远征"],
    oneLiner: "中国明星人形机器人公司，量产落地快。", hq: "中国·上海", website: "zhiyuan-robot.com",
    business: "远征/灵犀系列人形机器人，主打量产与具身数据，稚晖君联合创立。",
    competitors: ["unitree", "ubtech", "fourier"],
  },
  galbot: {
    id: "galbot", name: "银河通用", nameEn: "Galbot", kind: "private", aliases: ["银河通用", "Galbot"],
    oneLiner: "中国具身智能机器人公司。", hq: "中国·北京", website: "galbot.com",
    business: "轮式人形机器人与具身大模型，主打真实场景通用操作。",
    competitors: ["agibot", "unitree", "figure"],
  },

  /* ============ 第二波·代码 / 医疗 / 设计 / 基础设施 ============ */
  magicdev: {
    id: "magicdev", name: "Magic.dev", nameEn: "Magic", kind: "private", aliases: ["Magic.dev", "Magic"],
    oneLiner: "主攻超长上下文的 AI 编程模型。", hq: "美国·旧金山", website: "magic.dev",
    business: "自研超长上下文代码模型，目标打造自动化软件工程师。",
    competitors: ["cognition", "anysphere", "poolside"],
  },
  poolside: {
    id: "poolside", name: "Poolside", nameEn: "Poolside", kind: "private", aliases: ["Poolside"],
    oneLiner: "自研代码大模型的 AI 编程公司。", hq: "美国·旧金山", website: "poolside.ai",
    business: "从零训练代码基座模型，面向企业私有部署的 AI 软件开发。",
    competitors: ["cognition", "magicdev", "anysphere"],
  },
  stackblitz: {
    id: "stackblitz", name: "StackBlitz", nameEn: "StackBlitz", kind: "private", aliases: ["StackBlitz", "Bolt", "Bolt.new"],
    oneLiner: "Bolt.new——浏览器里说话建全栈应用。", hq: "美国·旧金山", website: "stackblitz.com",
    business: "Bolt.new 用 AI 在浏览器内生成并运行全栈应用，增长迅猛。",
    competitors: ["replit", "vercel", "lovable"],
  },
  lovable: {
    id: "lovable", name: "Lovable", nameEn: "Lovable", kind: "private", aliases: ["Lovable"],
    oneLiner: "欧洲爆红的「说话做应用」平台。", hq: "瑞典·斯德哥尔摩", website: "lovable.dev",
    business: "用自然语言生成可部署的 Web 应用，增长速度创纪录。",
    competitors: ["stackblitz", "vercel", "replit"],
  },
  abridge: {
    id: "abridge", name: "Abridge", nameEn: "Abridge", kind: "private", aliases: ["Abridge"],
    oneLiner: "AI 临床问诊记录龙头。", hq: "美国·匹兹堡", website: "abridge.com",
    business: "实时把医患对话转成结构化病历，深度接入大型医院系统。",
    competitors: ["openevidence", "msft"],
  },
  openevidence: {
    id: "openevidence", name: "OpenEvidence", nameEn: "OpenEvidence", kind: "private", aliases: ["OpenEvidence"],
    oneLiner: "医生用的 AI 医学证据搜索。", hq: "美国·剑桥(麻省)", website: "openevidence.com",
    business: "面向临床医生的循证医学问答，被大量美国医生日常使用。",
    competitors: ["abridge", "openai"],
  },
  tempus: {
    id: "tempus", name: "Tempus AI", nameEn: "Tempus AI", kind: "public", aliases: ["Tempus", "Tempus AI"],
    oneLiner: "精准医疗数据与 AI 诊断公司。", hq: "美国·芝加哥", website: "tempus.com",
    stock: { exchange: "NASDAQ", ticker: "TEM", marketCapB: 12 },
    business: "汇聚基因组与临床数据，用 AI 做精准医疗与药物研发辅助。",
    competitors: ["rxrx", "googl"],
  },
  hippocratic: {
    id: "hippocratic", name: "Hippocratic AI", nameEn: "Hippocratic AI", kind: "private", aliases: ["Hippocratic", "Hippocratic AI"],
    oneLiner: "医疗语音智能体，做「AI 护士」。", hq: "美国·帕洛阿尔托", website: "hippocraticai.com",
    business: "面向非诊断场景的医疗语音 AI 智能体，主打患者随访与健康关怀。",
    competitors: ["abridge", "openai"],
  },
  lightmatter: {
    id: "lightmatter", name: "Lightmatter", nameEn: "Lightmatter", kind: "private", aliases: ["Lightmatter"],
    oneLiner: "光子计算与光互联新锐。", hq: "美国·山景城", website: "lightmatter.co",
    business: "用光子技术做芯片间高带宽互联(Passage)与光计算，攻 AI 互联瓶颈。",
    competitors: ["nvda", "ayarlabs", "celestial"],
  },
  ayarlabs: {
    id: "ayarlabs", name: "Ayar Labs", nameEn: "Ayar Labs", kind: "private", aliases: ["Ayar Labs", "Ayar"],
    oneLiner: "硅光 I/O(光互连)领先者。", hq: "美国·圣克拉拉", website: "ayarlabs.com",
    business: "把光 I/O 直接集成进芯片封装(共封装光学 CPO)，英伟达等参与投资。",
    competitors: ["lightmatter", "celestial", "avgo"], investors: ["nvda"],
  },
  celestial: {
    id: "celestial", name: "Celestial AI", nameEn: "Celestial AI", kind: "private", aliases: ["Celestial AI", "Celestial"],
    oneLiner: "光子互联「光子结构」新锐。", hq: "美国·圣克拉拉", website: "celestial.ai",
    business: "Photonic Fabric 光互联技术，主攻 AI 内存与算力扩展的带宽瓶颈。",
    competitors: ["lightmatter", "ayarlabs"],
  },
  modal: {
    id: "modal", name: "Modal", nameEn: "Modal Labs", kind: "private", aliases: ["Modal", "Modal Labs"],
    oneLiner: "面向 AI 的无服务器计算平台。", hq: "美国·纽约", website: "modal.com",
    business: "让开发者秒级弹性调用 GPU 跑 AI 任务，主打开发体验。",
    competitors: ["baseten", "replicate", "together"],
  },
  baseten: {
    id: "baseten", name: "Baseten", nameEn: "Baseten", kind: "private", aliases: ["Baseten"],
    oneLiner: "模型部署与推理平台。", hq: "美国·旧金山", website: "baseten.co",
    business: "把机器学习模型一键部署为可扩展的推理服务。",
    competitors: ["modal", "replicate", "fireworks"],
  },
  replicate: {
    id: "replicate", name: "Replicate", nameEn: "Replicate", kind: "private", aliases: ["Replicate"],
    oneLiner: "一行代码调用开源模型的托管平台。", hq: "美国·旧金山", website: "replicate.com",
    business: "把开源模型打包成 API，开发者按用量调用，社区生态活跃。",
    competitors: ["modal", "baseten", "huggingface"],
  },
  anyscale: {
    id: "anyscale", name: "Anyscale", nameEn: "Anyscale", kind: "private", aliases: ["Anyscale", "Ray"],
    oneLiner: "Ray 分布式计算框架的商业公司。", hq: "美国·旧金山", website: "anyscale.com",
    business: "开源 Ray 框架与托管平台，支撑大规模分布式训练与推理。",
    competitors: ["databricks", "modal"],
  },
  wandb: {
    id: "wandb", name: "Weights & Biases", nameEn: "Weights & Biases", kind: "private", aliases: ["Weights & Biases", "W&B", "wandb"],
    oneLiner: "AI 实验跟踪与 MLOps 平台。", hq: "美国·旧金山", website: "wandb.ai",
    business: "模型训练实验管理、可视化与评测，2025 年被 CoreWeave 收购。",
    competitors: ["comet", "databricks"],
  },
  canva: {
    id: "canva", name: "Canva", nameEn: "Canva", kind: "private", aliases: ["Canva"],
    oneLiner: "全球最大在线设计平台，深度接入 AI。", hq: "澳大利亚·悉尼", website: "canva.com",
    business: "在线平面设计工具，Magic Studio 系列把生成式 AI 装进设计流程。",
    competitors: ["adbe", "figma"],
  },
  figma: {
    id: "figma", name: "Figma", nameEn: "Figma", kind: "public", aliases: ["Figma"],
    oneLiner: "协作式 UI 设计龙头，2025 年上市。", hq: "美国·旧金山", website: "figma.com",
    stock: { exchange: "NYSE", ticker: "FIG", marketCapB: 40 },
    business: "云端协作设计平台，Figma AI 辅助生成与自动化设计。",
    competitors: ["adbe", "canva"],
  },
};

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

export const KIND_LABEL: Record<Company["kind"], string> = {
  public: "上市公司",
  private: "未上市",
  oss: "开源 / 学术",
};

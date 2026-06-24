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
  stock?: { exchange: string; ticker: string; marketCapB?: number };
  business: string;
  financials?: Financial[];
  competitors?: string[];
}

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
    competitors: ["googl", "crm", "now"],
  },
  googl: {
    id: "googl", name: "谷歌母公司", nameEn: "Alphabet", kind: "public",
    aliases: ["Google", "Alphabet", "DeepMind", "谷歌", "Google DeepMind", "Google / Pinterest", "Google（原始论文）"],
    oneLiner: "搜索 + 安卓 + 云 + DeepMind，AI 研究与产品最全面的公司之一。",
    hq: "美国·山景城", website: "abc.xyz",
    stock: { exchange: "NASDAQ", ticker: "GOOGL", marketCapB: 2100 },
    business: "广告(搜索/YouTube)、谷歌云、安卓生态。旗下 DeepMind 产出 Gemini、AlphaFold、Waymo，自研 TPU 芯片。",
    financials: [{ year: 2023, revenue: 307.4, netIncome: 73.8 }, { year: 2024, revenue: 350.0, netIncome: 100.1 }],
    competitors: ["msft", "meta", "nvda"],
  },
  nvda: {
    id: "nvda", name: "英伟达", nameEn: "NVIDIA", kind: "public", aliases: ["NVIDIA", "英伟达"],
    oneLiner: "AI 算力的「卖铲人」，GPU 与 CUDA 生态的绝对龙头。",
    hq: "美国·圣克拉拉", website: "nvidia.com",
    stock: { exchange: "NASDAQ", ticker: "NVDA", marketCapB: 3000 },
    business: "数据中心 GPU(H100/Blackwell)、CUDA 软件栈、NVLink 互联、机器人(GR00T)与汽车平台。",
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
    competitors: ["googl", "msft"],
  },
  amd: {
    id: "amd", name: "超威半导体", nameEn: "AMD", kind: "public", aliases: ["AMD"],
    oneLiner: "英伟达在 GPU 与 CPU 上的主要挑战者。", hq: "美国·圣克拉拉", website: "amd.com",
    stock: { exchange: "NASDAQ", ticker: "AMD", marketCapB: 250 },
    business: "数据中心 GPU(Instinct MI300)、EPYC 服务器 CPU、消费级处理器与显卡。",
    financials: [{ year: 2024, revenue: 25.8, netIncome: 1.6 }], competitors: ["nvda", "intc"],
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
    financials: [{ year: 2024, revenue: 90.0, netIncome: 36.0 }], competitors: ["intc"],
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
    competitors: ["innolight", "eoptolink"],
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
    financials: [{ year: 2024, revenue: 638.0, netIncome: 59.2 }], competitors: ["msft", "googl"],
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
    business: "授权 CPU/GPU 架构(IP)，几乎所有手机与越来越多数据中心芯片基于 Arm 架构。",
    competitors: ["intc", "amd"],
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
    competitors: ["googl", "anthropic", "xai"],
  },
  anthropic: {
    id: "anthropic", name: "Anthropic", nameEn: "Anthropic", kind: "private", aliases: ["Anthropic"],
    oneLiner: "Claude 系列大模型的研发公司，主打安全与编程能力。",
    hq: "美国·旧金山", website: "anthropic.com",
    business: "Claude 大模型与 API，强调 AI 安全(Constitutional AI)，编程与智能体能力突出。亚马逊、谷歌为主要投资方。",
    competitors: ["openai", "googl"],
  },
  xai: {
    id: "xai", name: "xAI", nameEn: "xAI", kind: "private", aliases: ["xAI"],
    oneLiner: "马斯克创立的 AI 公司，产品为 Grok。", hq: "美国·旧金山", website: "x.ai",
    business: "Grok 大模型，深度绑定 X 平台数据，自建 Colossus 超大算力集群。", competitors: ["openai", "googl"],
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
    competitors: ["tsla", "bostondynamics", "onex"],
  },
  agility: {
    id: "agility", name: "Agility Robotics", nameEn: "Agility Robotics", kind: "private", aliases: ["Agility Robotics", "Agility"],
    oneLiner: "物流人形机器人 Digit 的开发商，已进仓库商用。", hq: "美国·科瓦利斯", website: "agilityrobotics.com",
    business: "Digit 双足人形机器人，主攻仓储搬运，已在亚马逊等场景试用。", competitors: ["figure", "apptronik", "bostondynamics"],
  },
  apptronik: {
    id: "apptronik", name: "Apptronik", nameEn: "Apptronik", kind: "private", aliases: ["Apptronik"],
    oneLiner: "人形机器人 Apollo 的开发商，与奔驰、GXO 合作。", hq: "美国·奥斯汀", website: "apptronik.com",
    business: "Apollo 通用人形机器人，瞄准制造与物流，获谷歌等投资。", competitors: ["figure", "agility", "tsla"],
  },
  unitree: {
    id: "unitree", name: "宇树科技", nameEn: "Unitree", kind: "private", aliases: ["Unitree", "宇树", "宇树科技"],
    oneLiner: "中国人形/四足机器人黑马，以高性价比著称。", hq: "中国·杭州", website: "unitree.com",
    business: "G1 人形与四足机器人，价格大幅低于同行，出货量领先。", competitors: ["tsla", "figure"],
  },
  onex: {
    id: "onex", name: "1X", nameEn: "1X Technologies", kind: "private", aliases: ["1X", "1X NEO"],
    oneLiner: "挪威人形机器人公司，主打家用机器人 NEO。", hq: "挪威·莫斯", website: "1x.tech",
    business: "NEO 家用人形机器人，OpenAI 为投资方之一。", competitors: ["figure", "tsla"],
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
    competitors: ["covariant", "googl"],
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

/** 该公司出现在产业链的哪些节点（由 nodes.ts 反查）。 */
export const nodesForCompany = (id: string): NodeData[] =>
  Object.values(NODES).filter((n) => n.companyIds.includes(id));

export const KIND_LABEL: Record<Company["kind"], string> = {
  public: "上市公司",
  private: "未上市",
  oss: "开源 / 学术",
};

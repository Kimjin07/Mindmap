/**
 * 产业链节点数据。整张全景图、侧滑面板的内容都由这里驱动（不再硬编码）。
 * 节点构成一棵树：layer（层）→ category（细分赛道）→（公司在 companies.ts）。
 */

export interface NodeData {
  id: string;
  parentId: string | null;
  type: "layer" | "category";
  name: string; // 中文名
  nameEn: string; // 英文名（全景图上显示）
  icon?: string; // 图标 key（见 Diagram 的图标注册表）
  levels: { l0: string; l1: string; l2?: string; l3?: string };
  companyIds: string[];
}

export const NODES: Record<string, NodeData> = {
  /* ---------------- 层 ---------------- */
  apps: {
    id: "apps",
    parentId: null,
    type: "layer",
    name: "应用层",
    nameEn: "APPLICATIONS",
    levels: {
      l0: "AI 产业链的最上层，是普通人真正用得到、能直接打交道的各种 AI 产品。",
      l1: "应用层就是把底层的模型和算力包装成「能用的东西」——聊天助手、自动驾驶、写代码工具等。你日常接触到的 AI，几乎都在这一层。",
      l2: "应用层按场景细分为对话、企业智能体、机器人、科学、制造、自动驾驶等方向。它直接面向用户与企业付费，是商业化最前沿，但严重依赖下层的模型与算力。",
    },
    companyIds: ["msft", "googl"],
  },
  models: {
    id: "models",
    parentId: null,
    type: "layer",
    name: "模型层",
    nameEn: "MODELS",
    levels: {
      l0: "应用背后的「大脑」，决定 AI 到底有多聪明。",
      l1: "模型层是各种 AI 模型——比如能聊天的大语言模型(LLM)、能看图的视觉模型。上层应用调用它们来完成具体任务。",
      l2: "按模态与结构可分为 LLM、VLM、VLA、MoE、扩散模型等。模型训练需要海量数据与算力，是连接「应用」与「基础设施」的中枢。",
    },
    companyIds: ["msft", "googl", "nvda", "meta"],
  },
  infra: {
    id: "infra",
    parentId: null,
    type: "layer",
    name: "基础设施层",
    nameEn: "INFRASTRUCTURE",
    levels: {
      l0: "让模型能被训练和运行的「数据中心与网络」。",
      l1: "基础设施层是支撑 AI 跑起来的底座：服务器、网络、存储、高速互联等，相当于 AI 工厂的厂房和管线。",
      l2: "它把成千上万张芯片通过高速互联(NVLink)、网络、光纤连成一个超级计算集群，也就是常说的「AI 工厂」。",
    },
    companyIds: ["avgo", "anet", "nvda"],
  },
  chips: {
    id: "chips",
    parentId: null,
    type: "layer",
    name: "芯片层",
    nameEn: "CHIPS",
    levels: {
      l0: "AI 的「发动机」，所有计算最终都在芯片上发生。",
      l1: "芯片层是真正做计算的硬件，比如 GPU。模型越大，对芯片的需求越疯狂，这也是当前最赚钱的环节之一。",
      l2: "包括 GPU、CPU、DPU 等。设计（英伟达/AMD）与制造（台积电）高度分工，是 AI 产业链中技术与利润最集中的环节。",
    },
    companyIds: ["nvda", "tsm", "amd", "avgo"],
  },
  energy: {
    id: "energy",
    parentId: null,
    type: "layer",
    name: "能源层",
    nameEn: "ENERGY",
    levels: {
      l0: "最底层的根基——没有电，一切都跑不起来。",
      l1: "AI 数据中心极其耗电，能源层就是供电、散热、电网等。算力的尽头，其实是能源。",
      l2: "随着 AI 算力爆发，稳定的大功率电力供应正成为制约 AI 发展的硬约束，相关电力设备与电网需求快速上升。",
    },
    companyIds: ["vrt", "etn", "nee"],
  },

  /* ---------------- 应用层 ---------------- */
  chatbots: {
    id: "chatbots", parentId: "apps", type: "category", name: "对话机器人", nameEn: "Chatbots", icon: "chatbots",
    levels: {
      l0: "能像人一样跟你聊天、回答问题的 AI 助手。",
      l1: "对话机器人就是 ChatGPT 这类产品——你用自然语言提问，它理解后回答、写作、总结。是目前最普及的 AI 应用。",
      l2: "底层通常是大语言模型(LLM)，结合检索增强(RAG)、工具调用等能力。商业模式包括订阅、API 调用、企业定制等。",
    },
    companyIds: ["msft", "googl"],
  },
  digital_biology: {
    id: "digital_biology", parentId: "apps", type: "category", name: "数字生物", nameEn: "Digital Biology", icon: "digital_biology",
    levels: {
      l0: "用 AI 来研究蛋白质、药物和生命的奥秘。",
      l1: "数字生物把 AI 用在生物医药上，比如预测蛋白质结构、加速新药研发，大幅缩短科研时间。",
    },
    companyIds: ["googl", "nvda"],
  },
  robotaxi: {
    id: "robotaxi", parentId: "apps", type: "category", name: "自动驾驶出租", nameEn: "Robotaxi", icon: "robotaxi",
    levels: {
      l0: "没有司机、自己开的出租车。",
      l1: "Robotaxi 用 AI 感知路况、做决策来无人驾驶载客，代表着出行方式的变革。",
    },
    companyIds: ["tsla", "googl"],
  },
  enterprise: {
    id: "enterprise", parentId: "apps", type: "category", name: "企业智能体", nameEn: "Enterprise AI Agents", icon: "enterprise",
    levels: {
      l0: "帮企业自动干活的「AI 员工」。",
      l1: "企业智能体能自动处理客服、流程、数据分析等工作，像一个不知疲倦的数字员工。",
    },
    companyIds: ["msft", "crm", "now", "pltr"],
  },
  science: {
    id: "science", parentId: "apps", type: "category", name: "科学计算", nameEn: "Science", icon: "science",
    levels: {
      l0: "用 AI 加速科学发现。",
      l1: "在物理、化学、气候等领域，AI 能模拟和预测复杂系统，帮科学家更快做研究。",
    },
    companyIds: ["nvda", "googl"],
  },
  robotics: {
    id: "robotics", parentId: "apps", type: "category", name: "机器人", nameEn: "Robotics", icon: "robotics",
    levels: {
      l0: "会看、会动、能干活的实体 AI。",
      l1: "机器人把 AI 装进实体，让它能在真实世界里行走、抓取、操作，是「具身智能」的方向。",
    },
    companyIds: ["tsla", "nvda"],
  },
  manufacturing: {
    id: "manufacturing", parentId: "apps", type: "category", name: "智能制造", nameEn: "Manufacturing", icon: "manufacturing",
    levels: {
      l0: "让工厂更聪明的 AI。",
      l1: "智能制造用 AI 做质检、预测性维护、优化生产，提升工厂效率和良率。",
    },
    companyIds: ["nvda"],
  },
  ai_coder: {
    id: "ai_coder", parentId: "apps", type: "category", name: "代码助手", nameEn: "AI Coder", icon: "ai_coder",
    levels: {
      l0: "帮程序员写代码的 AI。",
      l1: "AI Coder 像 GitHub Copilot，能补全、生成、解释代码，大幅提升开发效率。",
    },
    companyIds: ["msft", "googl"],
  },
  genmedia: {
    id: "genmedia", parentId: "apps", type: "category", name: "生成式媒体", nameEn: "Generative Media", icon: "chatbots",
    levels: {
      l0: "用 AI 生成语音、音乐、视频与数字人。",
      l1: "生成式媒体把文字变成配音、歌曲、视频和虚拟主播，正在重塑内容创作与营销。",
    },
    companyIds: ["elevenlabs", "runwayml"],
  },
  search_ai: {
    id: "search_ai", parentId: "apps", type: "category", name: "AI 搜索", nameEn: "AI Search", icon: "chatbots",
    levels: {
      l0: "用对话直接给答案的新一代搜索。",
      l1: "AI 搜索用大模型 + 实时检索，把「找链接」变成「给答案」，挑战传统搜索引擎。",
    },
    companyIds: ["perplexity", "googl"],
  },
  health_ai: {
    id: "health_ai", parentId: "apps", type: "category", name: "医疗 AI", nameEn: "Healthcare AI", icon: "digital_biology",
    levels: {
      l0: "帮医生看病、写病历、找证据的 AI。",
      l1: "医疗 AI 做临床问诊记录、医学检索、影像与诊断辅助，正快速渗透医院与药企。",
    },
    companyIds: ["tempus", "abridge"],
  },
  design_ai: {
    id: "design_ai", parentId: "apps", type: "category", name: "AI 设计", nameEn: "AI Design", icon: "manufacturing",
    levels: {
      l0: "帮人做图、排版、出设计稿的 AI。",
      l1: "把生成式 AI 装进设计与创意工具，从海报、UI 到品牌素材一键生成。",
    },
    companyIds: ["canva", "figma"],
  },

  /* ---------------- 模型层 ---------------- */
  llm: { id: "llm", parentId: "models", type: "category", name: "大语言模型", nameEn: "LLM",
    levels: { l0: "擅长理解和生成文字的模型。", l1: "LLM 是 ChatGPT 背后的核心，通过海量文本训练，能对话、写作、推理。" }, companyIds: ["msft", "googl", "nvda"] },
  vlm: { id: "vlm", parentId: "models", type: "category", name: "视觉语言模型", nameEn: "VLM",
    levels: { l0: "既能看图又能说话的模型。", l1: "VLM 能同时理解图像和文字，比如看图回答问题。" }, companyIds: ["googl", "meta"] },
  vla: { id: "vla", parentId: "models", type: "category", name: "视觉-语言-动作模型", nameEn: "VLA",
    levels: { l0: "能看、能理解、还能行动的模型。", l1: "VLA 把感知和动作连起来，是机器人智能的关键。" }, companyIds: ["nvda", "tsla"] },
  mmllm: { id: "mmllm", parentId: "models", type: "category", name: "多模态大模型", nameEn: "MMLLM",
    levels: { l0: "能同时处理文字、图片、声音的大模型。", l1: "多模态模型让 AI 像人一样综合多种信息来理解世界。" }, companyIds: ["googl", "meta"] },
  gpt: { id: "gpt", parentId: "models", type: "category", name: "生成式预训练模型", nameEn: "GPT",
    levels: { l0: "一类经典的生成式模型架构。", l1: "GPT 是 LLM 的代表架构，开创了「预训练 + 微调」的范式。" }, companyIds: ["msft"] },
  dm: { id: "dm", parentId: "models", type: "category", name: "扩散模型", nameEn: "DM",
    levels: { l0: "擅长生成图像/视频的模型。", l1: "扩散模型通过「去噪」生成高质量图片和视频，是 AI 绘画的核心。" }, companyIds: ["adbe", "googl"] },
  gnn: { id: "gnn", parentId: "models", type: "category", name: "图神经网络", nameEn: "GNN",
    levels: { l0: "处理「关系网络」数据的模型。", l1: "GNN 擅长社交网络、分子结构等图结构数据。" }, companyIds: ["googl"] },
  moe: { id: "moe", parentId: "models", type: "category", name: "混合专家", nameEn: "MOE",
    levels: { l0: "让大模型更高效的结构。", l1: "MoE 把模型拆成多个「专家」，按需调用，既省算力又强。" }, companyIds: ["googl", "msft"] },
  ssm: { id: "ssm", parentId: "models", type: "category", name: "状态空间模型", nameEn: "SSM",
    levels: { l0: "处理超长序列的高效模型。", l1: "SSM（如 Mamba）是 Transformer 的有力挑战者，处理长文本更省资源。" }, companyIds: ["nvda"] },
  lbm: { id: "lbm", parentId: "models", type: "category", name: "大行为模型", nameEn: "LBM",
    levels: { l0: "面向「动作 / 决策」的大模型。", l1: "LBM 把大模型的思路用于行为与控制，常见于机器人领域。" }, companyIds: ["nvda", "tsla"] },

  /* ---------------- 基础设施 / 芯片 / 能源 ---------------- */
  gpu: { id: "gpu", parentId: "chips", type: "category", name: "图形处理器", nameEn: "GPU", icon: "gpu",
    levels: { l0: "AI 计算的主力芯片。", l1: "GPU 能并行做海量计算，是训练 AI 模型的核心硬件，英伟达是绝对龙头。",
      l2: "GPU 设计由英伟达、AMD 主导，制造依赖台积电的先进制程；显存(HBM)与封装(CoWoS)是当前产能瓶颈。" }, companyIds: ["nvda", "amd"] },
  cpu: { id: "cpu", parentId: "chips", type: "category", name: "中央处理器", nameEn: "CPU", icon: "cpu",
    levels: { l0: "计算机的通用大脑。", l1: "CPU 负责通用计算与调度，在 AI 系统里与 GPU 协同工作。" }, companyIds: ["intc", "amd"] },
  dpu: { id: "dpu", parentId: "chips", type: "category", name: "数据处理器", nameEn: "DPU", icon: "dpu",
    levels: { l0: "专门处理数据搬运的芯片。", l1: "DPU 卸载网络、存储等任务，让 GPU/CPU 专注于计算。" }, companyIds: ["nvda", "mrvl"] },
  ai_accel: { id: "ai_accel", parentId: "chips", type: "category", name: "AI 加速芯片", nameEn: "AI Accelerators", icon: "gpu",
    levels: { l0: "挑战 GPU 的推理/训练新架构芯片。", l1: "Groq、Cerebras、SambaNova 等用全新架构(晶圆级、数据流、LPU)专攻 AI 推理与训练，主打更快更省。" }, companyIds: ["groq", "cerebras", "sambanova"] },
  nvlink: { id: "nvlink", parentId: "infra", type: "category", name: "高速互联", nameEn: "NVLink", icon: "nvlink",
    levels: { l0: "芯片之间的「高速公路」。", l1: "NVLink 让多张 GPU 高速互联，组成更大的算力集群。" }, companyIds: ["nvda"] },
  network: { id: "network", parentId: "infra", type: "category", name: "网络", nameEn: "Network", icon: "network",
    levels: { l0: "连接成千上万台服务器的网络。", l1: "高速网络把数据中心里的机器连成一台「超级计算机」。" }, companyIds: ["avgo", "anet", "nvda"] },
  storage: { id: "storage", parentId: "infra", type: "category", name: "存储", nameEn: "Storage", icon: "storage",
    levels: { l0: "存放海量训练数据的「仓库」。", l1: "AI 需要存储并快速读取 PB 级数据，存储是隐形刚需。" }, companyIds: ["wdc"] },
  neocloud: { id: "neocloud", parentId: "infra", type: "category", name: "AI 云算力", nameEn: "AI Cloud / Neoclouds", icon: "network",
    levels: { l0: "专门出租 GPU 算力的「AI 云」。", l1: "CoreWeave、Lambda、Crusoe 等新型云厂把成千上万张 GPU 打包成云服务出租，是 AI 训练/推理的算力二房东。" }, companyIds: ["crwv", "lambda", "crusoe"] },
  ai_infra_sw: { id: "ai_infra_sw", parentId: "infra", type: "category", name: "AI 开发框架", nameEn: "AI Dev Frameworks", icon: "storage",
    levels: { l0: "搭 AI 应用用的软件工具与数据底座。", l1: "向量数据库、编排框架、数据标注与实验管理等，是把大模型接进真实应用的「脚手架」。" }, companyIds: ["pinecone", "langchain", "scaleai"] },
  cooling: { id: "cooling", parentId: "energy", type: "category", name: "散热", nameEn: "Cooling", icon: "cooling",
    levels: { l0: "给发烫的芯片降温。", l1: "高密度算力发热惊人，液冷等散热技术正变得越来越关键。" }, companyIds: ["vrt"] },
  power: { id: "power", parentId: "energy", type: "category", name: "电力", nameEn: "Power", icon: "power",
    levels: { l0: "给数据中心供电。", l1: "AI 数据中心是「电老虎」，稳定的大功率供电是一切的前提。" }, companyIds: ["vrt", "etn"] },
  grid: { id: "grid", parentId: "energy", type: "category", name: "电网", nameEn: "Grid", icon: "grid",
    levels: { l0: "输送电力的「大网」。", l1: "AI 用电激增正在考验电网，相关基建需求随之上升。" }, companyIds: ["etn", "nee"] },
  generation: { id: "generation", parentId: "energy", type: "category", name: "发电", nameEn: "Power Generation",
    levels: { l0: "从源头造出电——AI 抢电时代最上游。", l1: "数据中心就近发电(燃气轮机/发电机组)与可再生能源，是 AI 用电的源头。" }, companyIds: ["gev", "cat", "cmi", "nee"] },
  nuclear: { id: "nuclear", parentId: "energy", type: "category", name: "核电 / SMR", nameEn: "Nuclear / SMR",
    levels: { l0: "给 AI 数据中心专属供电的核电与小型堆。", l1: "AI 用电激增让核电与小型模块化反应堆(SMR)重新走红，科技巨头纷纷签长约。" }, companyIds: ["ceg", "vst", "oklo", "smr"] },
  /* ---------------- 光通信层（上游→中游→下游） ---------------- */
  optical: { id: "optical", parentId: null, type: "layer", name: "光通信", nameEn: "OPTICAL",
    levels: {
      l0: "用「光」在 AI 数据中心内外高速搬运数据——AI 算力爆发最直接的受益链之一。",
      l1: "GPU 越多，机器之间要传的数据越爆炸，电信号扛不住，于是改用光。光通信按上游(光芯片)→中游(光模块)→下游(网络设备)分工明确。",
      l2: "上游是激光器/EML 与光 DSP 芯片(技术与利润最集中)，中游把光芯片封装成可插拔光模块(中国厂商出货领先)，下游是消费这些模块的交换机与电信/数据中心网络设备。",
    }, companyIds: ["lite", "cohr", "innolight", "aaoi", "cien"] },
  opt_chip: { id: "opt_chip", parentId: "optical", type: "category", name: "上游·光芯片 / 激光器", nameEn: "Optical Chips & Lasers",
    levels: { l0: "光模块里最核心、毛利最高的「光芯片与激光器」。", l1: "激光器(EML/DFB/VCSEL)、光探测器、驱动器/TIA 与光 DSP/CDR 芯片，是光模块的心脏，技术壁垒与利润最集中。" }, companyIds: ["lite", "cohr", "avgo", "mrvl", "mtsi", "smtc"] },
  opt_module: { id: "opt_module", parentId: "optical", type: "category", name: "中游·光模块厂商", nameEn: "Module Makers", icon: "fiber",
    levels: { l0: "把上游光芯片封装成可插拔的光收发模块。", l1: "800G/1.6T 光模块是 AI 集群组网的「血管接口」；模块厂向上采购光芯片，向下卖给设备商与云厂。" }, companyIds: ["innolight", "aaoi", "fn", "cohr"] },
  opt_network: { id: "opt_network", parentId: "optical", type: "category", name: "下游·通信设备商", nameEn: "Equipment Vendors", icon: "network",
    levels: { l0: "把光模块装进交换机/路由器/光传输设备的通信设备商。", l1: "相干光传输、路由与交换设备把数据中心和电信网连成一体，是光模块的下游买家；再往下是云厂等终端客户。" }, companyIds: ["cien", "nok", "csco", "anet", "jnpr", "eric"] },

  /* ---------------- 芯片层·半导体供应链（深结构） ---------------- */
  foundry: { id: "foundry", parentId: "chips", type: "category", name: "晶圆代工", nameEn: "Foundry",
    levels: { l0: "按设计图把芯片造出来的工厂。", l1: "芯片「设计」与「制造」高度分工，代工厂掌握最先进制程，是 AI 芯片产能的真正瓶颈。" }, companyIds: ["tsm", "samsung", "intc"] },
  packaging: { id: "packaging", parentId: "chips", type: "category", name: "先进封装", nameEn: "Packaging",
    levels: { l0: "把多颗芯片与显存拼装成一个整体。", l1: "CoWoS 等先进封装把 GPU 与 HBM 集成在一起，是当前 AI 芯片最紧的产能卡点。" }, companyIds: ["tsm", "ase", "amkr"] },
  equipment: { id: "equipment", parentId: "chips", type: "category", name: "半导体设备", nameEn: "Equipment",
    levels: { l0: "造芯片用的「母机」。", l1: "光刻、刻蚀、量测等设备决定能造多先进的芯片；ASML 的 EUV 光刻机是皇冠上的明珠。" }, companyIds: ["asml", "amat", "lrcx", "klac"] },
  eda: { id: "eda", parentId: "chips", type: "category", name: "EDA 设计软件", nameEn: "EDA",
    levels: { l0: "设计芯片用的软件工具。", l1: "没有 EDA 就画不出几百亿晶体管的芯片，新思与楷登两家主导。" }, companyIds: ["snps", "cdns"] },

  /* ---------------- 太空算力层 ---------------- */
  space: { id: "space", parentId: null, type: "layer", name: "太空算力", nameEn: "SPACE",
    levels: {
      l0: "把 AI 的「连接」与「算力」搬上天——卫星互联与轨道数据中心。",
      l1: "太空是新兴前沿：星链等卫星提供全球连接，可回收火箭把载荷送上轨道，未来甚至在太空建数据中心（不缺阳光、天然散热）。",
      l2: "包含卫星互联、火箭发射、轨道数据中心等方向，与能源(太空太阳能)、网络(星地连接)、芯片(太空 GPU)强相关。",
    }, companyIds: ["spacex", "rklb"] },
  satellite: { id: "satellite", parentId: "space", type: "category", name: "卫星互联", nameEn: "Satellite Internet",
    levels: { l0: "用低轨卫星把网络覆盖到全球每个角落。", l1: "星链等卫星星座提供高速低延迟上网，甚至能直连普通手机。" }, companyIds: ["spacex", "asts"] },
  launch: { id: "launch", parentId: "space", type: "category", name: "火箭发射", nameEn: "Launch",
    levels: { l0: "把卫星和算力送上天的运力。", l1: "可回收火箭大幅降低入轨成本，是太空一切的前提。" }, companyIds: ["spacex", "rklb"] },
  orbital_dc: { id: "orbital_dc", parentId: "space", type: "category", name: "轨道数据中心", nameEn: "Orbital DC",
    levels: { l0: "在太空里建 AI 数据中心。", l1: "太空有连续阳光和天然低温，适合放高耗能的 AI 算力，马斯克等正在推进。" }, companyIds: ["spacex", "nvda"] },
};

/* ---------------- 全景图布局（数据驱动渲染） ---------------- */
export interface MapGroup {
  boxes: { id: string; h: number; big?: boolean }[];
  content:
    | { kind: "icons"; cols: 4 | 5; ids: string[] }
    | { kind: "pills"; rows: string[][] };
}

export const MAP: MapGroup[] = [
  {
    boxes: [{ id: "apps", h: 120, big: true }],
    content: {
      kind: "icons",
      cols: 4,
      ids: ["chatbots", "digital_biology", "robotaxi", "enterprise", "science", "robotics", "manufacturing", "ai_coder"],
    },
  },
  {
    boxes: [{ id: "models", h: 64 }],
    content: {
      kind: "pills",
      rows: [
        ["llm", "vlm", "vla", "mmllm", "gpt"],
        ["dm", "gnn", "moe", "ssm", "lbm"],
      ],
    },
  },
  {
    boxes: [
      { id: "infra", h: 64 },
      { id: "chips", h: 64 },
      { id: "energy", h: 64 },
    ],
    content: {
      kind: "icons",
      cols: 5,
      ids: ["gpu", "cpu", "dpu", "nvlink", "network", "storage", "cooling", "power", "grid"],
    },
  },
];

/* ---------------- 工具函数 ---------------- */
export const getNode = (id: string): NodeData | undefined => NODES[id];

export const getChildren = (id: string): NodeData[] =>
  Object.values(NODES).filter((n) => n.parentId === id);

/** 从某节点一路向上到根，返回面包屑（含自身） */
export const getBreadcrumb = (id: string): NodeData[] => {
  const chain: NodeData[] = [];
  let cur: NodeData | undefined = NODES[id];
  while (cur) {
    chain.unshift(cur);
    cur = cur.parentId ? NODES[cur.parentId] : undefined;
  }
  return chain;
};

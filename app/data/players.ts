/**
 * 每个「城市」（细分赛道）里的「景点」——代表性产品 / 项目。
 * - id：产品稳定标识（用于跨产品关联）
 * - name / by / note：名称 / 出品方 / 特别之处
 * - companyId：当 by 难以自动解析时手动指定（一般不用填）
 *
 * 关联分两类：
 *   ① 同公司足迹：一家公司散落在各城市的所有产品。
 *   ② 跨产品「供应 / 驱动」关系：见下方 LINKS（如 Copilot 由 GPT 驱动、
 *      大模型靠 GPU 提供算力、GPU 靠光模块组网…）。
 */

import { companyIdByName } from "./companies";

export interface Player {
  id: string;
  name: string;
  by?: string;
  note?: string;
  companyId?: string;
}

export const PLAYERS: Record<string, Player[]> = {
  /* ---------- 应用层 ---------- */
  chatbots: [
    { id: "chatgpt", name: "ChatGPT", by: "OpenAI", note: "引爆全球的对话助手，定义了这个品类。" },
    { id: "claude_app", name: "Claude", by: "Anthropic", note: "以写作、编程与长文本见长，注重安全。" },
    { id: "gemini_app", name: "Gemini", by: "Google", note: "原生多模态，深度整合谷歌全家桶。" },
    { id: "copilot", name: "Copilot", by: "Microsoft", note: "嵌入 Windows 与 Office，办公场景无处不在。" },
    { id: "grok", name: "Grok", by: "xAI", note: "绑定 X 平台实时数据，个性张扬。" },
    { id: "perplexity", name: "Perplexity", by: "Perplexity", note: "对话式 AI 搜索的代表。" },
    { id: "meta_ai", name: "Meta AI", by: "Meta", note: "内置于 WhatsApp/Instagram 的助手。" },
  ],
  digital_biology: [
    { id: "alphafold", name: "AlphaFold", by: "DeepMind", note: "破解蛋白质折叠，拿下诺贝尔化学奖。" },
    { id: "isomorphic", name: "Isomorphic Labs", by: "Alphabet", note: "DeepMind 分拆，用 AI 做新药研发。" },
    { id: "recursion", name: "Recursion", by: "RXRX", note: "自动化湿实验室 × AI，规模化造药。" },
    { id: "insilico", name: "Insilico Medicine", note: "端到端生成式制药，多条管线进临床。" },
  ],
  robotaxi: [
    { id: "waymo", name: "Waymo", by: "Alphabet", note: "全无人商业运营最成熟的玩家。" },
    { id: "fsd", name: "Robotaxi / FSD", by: "Tesla", note: "纯视觉路线，押注端到端大模型。" },
    { id: "zoox", name: "Zoox", by: "Amazon", note: "亚马逊旗下，专造无方向盘车厢。" },
    { id: "cruise", name: "Cruise", by: "GM", note: "通用汽车旗下自动驾驶。" },
  ],
  enterprise: [
    { id: "m365_copilot", name: "Copilot for M365", by: "Microsoft", note: "让 Office 里的每个人配上 AI 助手。" },
    { id: "agentforce", name: "Agentforce", by: "Salesforce", note: "在 CRM 里部署能干活的 AI 智能体。" },
    { id: "now_assist", name: "Now Assist", by: "ServiceNow", note: "把 AI 嵌入 IT/HR 工作流。" },
    { id: "aip", name: "AIP", by: "Palantir", note: "把大模型接到真实业务数据做决策。" },
    { id: "glean", name: "Glean", note: "企业内部的 AI 搜索与工作助手。" },
  ],
  science: [
    { id: "earth2", name: "Earth-2 / BioNeMo", by: "NVIDIA", note: "气候模拟与生物计算平台。" },
    { id: "graphcast", name: "GraphCast", by: "DeepMind", note: "几秒出全球天气预报，超越传统数值法。" },
    { id: "ai4science", name: "AI for Science", by: "Microsoft Research", note: "把 AI 用于材料、化学等基础科研。" },
    { id: "alphafold_sci", name: "AlphaFold", by: "DeepMind", note: "把 AI 用于结构生物学的标杆。" },
  ],
  robotics: [
    { id: "optimus", name: "Optimus", by: "Tesla", note: "【本体】复用汽车 AI 技术栈的人形机器人。" },
    { id: "atlas_robot", name: "Atlas", by: "Boston Dynamics", note: "【本体】运动能力天花板，已转电驱。" },
    { id: "figure02", name: "Figure 02", by: "Figure", note: "【本体】明星初创，自研 Helix 大模型。" },
    { id: "neo", name: "1X NEO", by: "1X", note: "【本体】瞄准家用场景的人形机器人。" },
    { id: "agility_digit", name: "Digit", by: "Agility Robotics", note: "【本体】已商用的物流人形机器人。" },
    { id: "apptronik_apollo", name: "Apollo", by: "Apptronik", note: "【本体】与奔驰合作的人形机器人。" },
    { id: "groot", name: "GR00T", by: "NVIDIA", note: "【大脑】人形机器人通用基础模型与仿真。" },
    { id: "harmonic_drive", name: "谐波减速器", by: "Harmonic Drive", note: "【零部件】关节核心，日本全球龙头。" },
    { id: "teradyne_arm", name: "协作机械臂", by: "Teradyne", note: "【零部件】Universal Robots 母公司。" },
    { id: "jetson_robot", name: "Jetson / Thor 芯片", by: "NVIDIA", note: "【芯片】机器人计算平台。" },
  ],
  manufacturing: [
    { id: "omniverse", name: "Omniverse", by: "NVIDIA", note: "工厂数字孪生与仿真平台。" },
    { id: "siemens_iai", name: "Industrial AI", by: "Siemens", note: "工业自动化 + 数字孪生落地。" },
    { id: "cognex_vision", name: "机器视觉", by: "Cognex", note: "工厂质检与定位的「眼睛」。" },
  ],
  ai_coder: [
    { id: "github_copilot", name: "GitHub Copilot", by: "Microsoft", note: "把 AI 编程带向主流的开创者。" },
    { id: "cursor", name: "Cursor", by: "Anysphere", note: "整库理解 + 智能体，增长最快的 AI 编辑器。" },
    { id: "windsurf", name: "Windsurf", by: "Codeium", note: "主打智能体式编程体验。" },
    { id: "replit_agent", name: "Replit Agent", by: "Replit", note: "说句话就能生成并部署应用。" },
    { id: "amazon_q", name: "Amazon Q", by: "AWS", note: "面向企业开发与运维的 AI 助手。" },
  ],

  /* ---------- 模型层 ---------- */
  llm: [
    { id: "gpt4", name: "GPT-4o / o3", by: "OpenAI", note: "通用能力标杆，o 系列主打推理。" },
    { id: "claude35", name: "Claude 3.5", by: "Anthropic", note: "编程与长上下文口碑极佳。" },
    { id: "gemini_llm", name: "Gemini", by: "Google", note: "超长上下文 + 原生多模态。" },
    { id: "llama", name: "Llama", by: "Meta", note: "开源模型的扛旗者。" },
    { id: "grok_llm", name: "Grok", by: "xAI", note: "绑定实时数据的大模型。" },
    { id: "mistral_large", name: "Mistral Large", by: "Mistral", note: "欧洲开源大模型旗手。" },
  ],
  vlm: [
    { id: "gpt4v", name: "GPT-4V", by: "OpenAI", note: "把「看图说话」带入主流。" },
    { id: "gemini_vlm", name: "Gemini", by: "Google", note: "图文混合理解能力强。" },
    { id: "claude_vlm", name: "Claude", by: "Anthropic", note: "擅长读图表、截图与文档。" },
    { id: "llama_vlm", name: "Llama Vision", by: "Meta", note: "开源多模态版本。" },
    { id: "llava", name: "LLaVA", note: "开源 VLM 研究的常用基线。" },
  ],
  vla: [
    { id: "rt2", name: "RT-2", by: "DeepMind", note: "把网络知识迁移到机器人动作。" },
    { id: "openvla", name: "OpenVLA", note: "开源视觉-语言-动作模型。" },
    { id: "helix", name: "Helix", by: "Figure", note: "Figure 自研，驱动上半身精细操作。" },
    { id: "pi0", name: "π0", by: "Physical Intelligence", note: "跨本体通用机器人策略模型。" },
  ],
  mmllm: [
    { id: "gpt4o_mm", name: "GPT-4o", by: "OpenAI", note: "文本/语音/图像统一的端到端模型。" },
    { id: "gemini_mm", name: "Gemini", by: "Google", note: "从设计之初就是原生多模态。" },
  ],
  gpt: [
    { id: "gpt_series", name: "GPT 系列", by: "OpenAI", note: "把「预训练 + 微调」范式发扬光大。" },
    { id: "transformer", name: "Transformer", by: "Google（原始论文）", note: "2017《Attention Is All You Need》，一切的起点。" },
  ],
  dm: [
    { id: "sora", name: "Sora", by: "OpenAI", note: "文生视频的现象级产品。" },
    { id: "midjourney", name: "Midjourney", note: "画质口碑最佳的文生图。" },
    { id: "stable_diffusion", name: "Stable Diffusion", by: "Stability AI", note: "开源图像生成的基石。" },
    { id: "imagen", name: "Imagen / Veo", by: "Google", note: "谷歌的图像/视频生成模型。" },
    { id: "firefly", name: "Firefly", by: "Adobe", note: "强调版权合规的商用生成。" },
  ],
  gnn: [
    { id: "pyg_dgl", name: "PyG / DGL", by: "开源", note: "做图神经网络的主流工具库。" },
    { id: "rec_sys", name: "推荐系统", by: "Google / Pinterest", note: "图模型在工业推荐里的经典应用。" },
  ],
  moe: [
    { id: "mixtral", name: "Mixtral", by: "Mistral", note: "把 MoE 带火的开源模型。" },
    { id: "switch_tf", name: "Switch Transformer", by: "Google", note: "早期把 MoE 推到万亿参数。" },
    { id: "gpt_moe", name: "GPT (MoE)", by: "OpenAI", note: "前沿大模型普遍采用 MoE。" },
  ],
  ssm: [
    { id: "mamba", name: "Mamba", note: "线性复杂度处理超长序列。" },
    { id: "jamba", name: "Jamba", by: "AI21", note: "Mamba + Transformer 混合架构。" },
  ],
  lbm: [
    { id: "tesla_lbm", name: "行为大模型", by: "Tesla", note: "把端到端思路用于驾驶决策。" },
    { id: "pi_foundation", name: "Foundation Models", by: "Physical Intelligence", note: "面向机器人的通用动作模型。" },
    { id: "covariant", name: "Covariant", note: "仓储分拣的机器人基础模型。" },
  ],

  /* ---------- 芯片层 ---------- */
  gpu: [
    { id: "blackwell", name: "Blackwell / H100", by: "NVIDIA", note: "AI 训练的事实标准芯片。" },
    { id: "mi300", name: "Instinct MI300", by: "AMD", note: "性能逼近、价格更友好的挑战者。" },
    { id: "tpu", name: "TPU", by: "Google", note: "谷歌自研，自家模型专用算力。" },
    { id: "gaudi", name: "Gaudi", by: "Intel", note: "英特尔的 AI 加速器尝试。" },
    { id: "trainium", name: "Trainium", by: "Amazon", note: "AWS 自研 AI 训练芯片。" },
  ],
  cpu: [
    { id: "xeon", name: "Xeon", by: "Intel", note: "数据中心通用计算的老牌主力。" },
    { id: "epyc", name: "EPYC", by: "AMD", note: "近年大幅抢占服务器份额。" },
    { id: "arm_arch", name: "ARM 架构", by: "Arm", note: "低功耗架构，正攻入数据中心。" },
    { id: "grace", name: "Grace CPU", by: "NVIDIA", note: "英伟达自研 ARM 服务器 CPU。" },
  ],
  dpu: [
    { id: "bluefield", name: "BlueField", by: "NVIDIA", note: "卸载网络/存储，解放 GPU。" },
    { id: "nitro", name: "Nitro", by: "AWS", note: "亚马逊云的虚拟化基石。" },
    { id: "marvell_dpu", name: "DPU", by: "Marvell", note: "定制数据处理器方案。" },
  ],
  foundry: [
    { id: "tsmc_foundry", name: "3nm / 2nm 制程", by: "TSMC", note: "最先进制程，英伟达/苹果都靠它代工。" },
    { id: "samsung_foundry", name: "三星代工", by: "Samsung", note: "先进制程的另一选择。" },
    { id: "intel_foundry", name: "Intel Foundry", by: "Intel", note: "力图重回先进制程第一梯队。" },
  ],
  packaging: [
    { id: "cowos", name: "CoWoS 先进封装", by: "TSMC", note: "把 GPU 与 HBM 集成，AI 芯片最紧的产能卡点。" },
    { id: "ase_pkg", name: "封装测试", by: "ASE", note: "全球最大封测厂。" },
    { id: "amkr_pkg", name: "封装测试", by: "Amkor", note: "美系封测龙头。" },
  ],
  equipment: [
    { id: "asml_euv", name: "EUV 光刻机", by: "ASML", note: "全球唯一 EUV 供应商，先进制程咽喉。" },
    { id: "amat_eq", name: "沉积 / 刻蚀设备", by: "Applied Materials", note: "设备种类最全。" },
    { id: "lam_eq", name: "刻蚀设备", by: "Lam Research", note: "存储芯片制造关键设备。" },
    { id: "kla_eq", name: "量测 / 检测", by: "KLA", note: "保障先进制程良率。" },
  ],
  eda: [
    { id: "synopsys", name: "EDA 工具", by: "Synopsys", note: "芯片设计软件双雄之一。" },
    { id: "cadence", name: "EDA 工具", by: "Cadence", note: "芯片设计软件双雄之一。" },
  ],

  /* ---------- 基础设施层 ---------- */
  nvlink: [
    { id: "nvlink_p", name: "NVLink / NVSwitch", by: "NVIDIA", note: "GPU 之间的「高速公路」，护城河之一。" },
    { id: "ualink_p", name: "UALink 联盟", note: "AMD/谷歌等联手挑战 NVLink 的开放标准。" },
  ],
  network: [
    { id: "tomahawk", name: "Tomahawk 交换芯片", by: "Broadcom", note: "数据中心交换的核心芯片。" },
    { id: "arista_sw", name: "数据中心交换机", by: "Arista", note: "AI 集群组网的领导者。" },
    { id: "infiniband", name: "InfiniBand / Spectrum-X", by: "NVIDIA", note: "高性能 AI 网络方案。" },
  ],
  storage: [
    { id: "hbm", name: "HBM 显存", by: "SK Hynix / 三星", note: "AI GPU 的关键瓶颈部件。" },
    { id: "micron_hbm", name: "HBM / DRAM", by: "Micron", note: "美系唯一 HBM 供应商，AI 内存关键。" },
    { id: "wd_storage", name: "企业存储", by: "Western Digital", note: "海量训练数据的仓库。" },
    { id: "pure_flash", name: "全闪存", by: "Pure Storage", note: "高吞吐，喂饱 GPU 训练。" },
  ],
  /* ---------- 光通信层：上游·光芯片 ---------- */
  opt_chip: [
    { id: "lumentum_eml", name: "EML 激光芯片", by: "Lumentum", note: "【上游】1.6T 模块关键 EML，独家量产 200G/lane。" },
    { id: "coherent_optic", name: "光器件 / 激光", by: "Coherent", note: "【上游】激光与光电子器件，英伟达入股。" },
    { id: "avgo_optical_dsp", name: "光 DSP 芯片", by: "Broadcom", note: "【上游】800G/1.6T 模块的 DSP，市占领先。" },
    { id: "mrvl_optical", name: "光 DSP / 互联", by: "Marvell", note: "【上游·DSP】光 DSP 双雄之一，覆盖光互联全栈。" },
    { id: "macom_chip", name: "激光驱动 / TIA", by: "MACOM", note: "【上游·器件】激光驱动器与跨阻放大器(TIA)。" },
    { id: "semtech_cdr", name: "CDR / PMD 芯片", by: "Semtech", note: "【上游·信号】时钟恢复与信号调理芯片。" },
  ],
  /* ---------- 光通信层：中游·光模块 ---------- */
  opt_module: [
    { id: "innolight_optic", name: "光模块", by: "中际旭创 Innolight", note: "【中游】全球高速光模块出货龙头。" },
    { id: "aaoi_module", name: "800G/1.6T 收发模块", by: "Applied Optoelectronics", note: "【中游】2026 放量、拿下 1.6T 大单的大牛股。" },
    { id: "coherent_module", name: "光模块", by: "Coherent", note: "【中游】上游器件 + 中游模块一体化(原 II-VI)。" },
    { id: "fabrinet", name: "光模块代工", by: "Fabrinet", note: "【中游·代工】给 Lumentum/Cisco 等代工模块。" },
  ],
  /* ---------- 光通信层：下游·网络设备 ---------- */
  opt_network: [
    { id: "ciena_net", name: "相干光网络", by: "Ciena", note: "【下游】数据中心之间的高容量光传输。" },
    { id: "nokia_net", name: "网络设备 / 基建", by: "Nokia", note: "【下游】电信级网络基建，向 AI 互联延伸。" },
    { id: "cisco_net", name: "交换 / 路由设备", by: "Cisco", note: "【下游】企业与数据中心网络龙头(含 Acacia 相干模块)。" },
    { id: "arista_opt", name: "AI 集群交换机", by: "Arista", note: "【下游】消费海量光模块的 AI 组网设备。" },
    { id: "juniper_net", name: "路由 / 交换", by: "Juniper", note: "【下游】数据中心与电信网络设备(现属 HPE)。" },
    { id: "ericsson_net", name: "电信传输设备", by: "Ericsson", note: "【下游】5G/电信网络与光传输巨头。" },
  ],

  /* ---------- 能源层 ---------- */
  cooling: [
    { id: "vertiv_cooling", name: "液冷 / 热管理", by: "Vertiv", note: "AI 散热龙头，液冷大趋势受益者。" },
    { id: "schneider_cooling", name: "数据中心制冷", by: "Schneider", note: "全套配电 + 制冷解决方案。" },
  ],
  power: [
    { id: "vertiv_power", name: "电源 / 供配电", by: "Vertiv", note: "数据中心供电的核心供应商。" },
    { id: "eaton_power", name: "电力管理", by: "Eaton", note: "AI 扩张的「卖水人」。" },
    { id: "schneider_power", name: "施耐德电气", by: "Schneider", note: "能源管理与配电巨头。" },
  ],
  grid: [
    { id: "eaton_grid", name: "电网设备", by: "Eaton", note: "承接 AI 用电激增的电网需求。" },
    { id: "nextera_grid", name: "清洁电力", by: "NextEra", note: "全球最大风光发电商。" },
    { id: "gev_grid", name: "电力装备", by: "GE Vernova", note: "燃气/风电/电网装备巨头。" },
  ],
  generation: [
    { id: "gev_gas", name: "燃气轮机", by: "GE Vernova", note: "【发电】数据中心就近燃气发电主力。" },
    { id: "cat_genset", name: "燃气发电机组", by: "Caterpillar", note: "【发电】备用与就地发电设备。" },
    { id: "cmi_power", name: "发电机组", by: "Cummins", note: "【发电】发电与备电设备。" },
    { id: "nee_renew", name: "风光 + 储能", by: "NextEra", note: "【发电】最大可再生发电商。" },
  ],
  nuclear: [
    { id: "ceg_nuke", name: "核电运营", by: "Constellation", note: "【核电】美国最大核电运营商，直供数据中心。" },
    { id: "vst_nuke", name: "核电 + 燃气", by: "Vistra", note: "【核电】综合电力生产商。" },
    { id: "oklo_smr", name: "先进核裂变", by: "Oklo", note: "【SMR】小型微堆新锐，Altman 押注。" },
    { id: "nuscale_smr", name: "SMR 反应堆", by: "NuScale", note: "【SMR】小型模块化反应堆先行者。" },
  ],

  /* ---------- 太空算力层 ---------- */
  satellite: [
    { id: "starlink", name: "Starlink 星链", by: "SpaceX", note: "全球最大低轨卫星星座，高速低延迟上网。" },
    { id: "ast_sat", name: "直连手机卫星", by: "AST SpaceMobile", note: "卫星直连普通手机，无需地面基站。" },
    { id: "kuiper", name: "Kuiper", by: "Amazon", note: "亚马逊的低轨卫星互联网。" },
  ],
  launch: [
    { id: "starship", name: "Starship / Falcon", by: "SpaceX", note: "可回收火箭，大幅降低入轨成本。" },
    { id: "neutron", name: "Electron / Neutron", by: "Rocket Lab", note: "小型可回收火箭 + 卫星系统。" },
  ],
  orbital_dc: [
    { id: "starcloud", name: "轨道数据中心", by: "SpaceX", note: "利用太空连续阳光与天然散热放 AI 算力。" },
    { id: "space_gpu", name: "太空 GPU", by: "NVIDIA", note: "为轨道算力提供芯片。" },
  ],
};

export const getPlayers = (id: string): Player[] => PLAYERS[id] ?? [];

/** 解析一个产品背后的公司 id（优先手填，其次 by，最后 name）。 */
export const companyOfPlayer = (p: Player): string | undefined =>
  p.companyId ?? companyIdByName(p.by) ?? companyIdByName(p.name);

/* ---------------- 产品索引 ---------------- */
export interface ProductEntry {
  id: string;
  cityId: string;
  name: string;
  note?: string;
  by?: string;
  companyId?: string;
}

export const PRODUCTS: Record<string, ProductEntry> = (() => {
  const out: Record<string, ProductEntry> = {};
  for (const [cityId, list] of Object.entries(PLAYERS)) {
    for (const p of list) {
      out[p.id] = {
        id: p.id, cityId, name: p.name, note: p.note, by: p.by,
        companyId: companyOfPlayer(p),
      };
    }
  }
  return out;
})();

export const getProduct = (id: string): ProductEntry | undefined => PRODUCTS[id];

/* ---------------- 跨产品「供应 / 驱动」关系 ---------------- */
/** [产品A, 产品B, 关系标签]，无向。 */
export const LINKS: [string, string, string][] = [
  /* 应用 由 模型 驱动（跨公司的关键故事） */
  ["copilot", "gpt4", "由GPT驱动"],
  ["m365_copilot", "gpt4", "由GPT驱动"],
  ["github_copilot", "gpt4", "由GPT驱动"],
  ["cursor", "claude35", "由Claude驱动"],
  ["cursor", "gpt4", "可调用GPT"],
  ["windsurf", "claude35", "由Claude驱动"],
  ["replit_agent", "claude35", "由Claude驱动"],
  ["amazon_q", "claude35", "由Claude驱动"],
  ["chatgpt", "gpt4", "运行于GPT"],
  ["claude_app", "claude35", "运行于Claude"],
  ["gemini_app", "gemini_llm", "运行于Gemini"],
  ["deepseek_app", "deepseek_v3", "同系模型"],
  ["qianwen", "qwen", "同系模型"],
  /* 机器人 / 车 由 动作模型 驱动 */
  ["fsd", "tesla_lbm", "由行为大模型驱动"],
  ["optimus", "tesla_lbm", "由行为大模型驱动"],
  ["figure02", "helix", "由Helix驱动"],
  /* 模型 靠 GPU 算力 */
  ["gpt4", "blackwell", "算力"],
  ["claude35", "blackwell", "算力"],
  ["llama", "blackwell", "算力"],
  ["deepseek_v3", "blackwell", "算力"],
  ["qwen", "blackwell", "算力"],
  ["gemini_llm", "tpu", "算力"],
  ["waymo", "blackwell", "车端算力"],
  ["groot", "blackwell", "训练算力"],
  /* GPU 靠 互联 / 显存 / 组网 / 供电 / 散热 */
  ["blackwell", "nvlink_p", "高速互联"],
  ["blackwell", "hbm", "HBM显存"],
  ["blackwell", "infiniband", "集群组网"],
  ["blackwell", "vertiv_power", "供电"],
  ["blackwell", "vertiv_cooling", "液冷散热"],
  ["mi300", "hbm", "HBM显存"],
  /* 网络靠光模块 / 交换芯片 */
  ["infiniband", "innolight_optic", "光模块"],
  ["arista_sw", "innolight_optic", "光模块"],
  ["arista_sw", "tomahawk", "交换芯片"],
  ["coherent_optic", "infiniband", "光器件"],

  /* 让「孤岛」产品也连到其它城市的景点 */
  ["mamba", "jamba", "混合架构"],
  ["mamba", "transformer", "挑战Transformer"],
  ["jamba", "blackwell", "算力"],
  ["llava", "gpt4v", "开源对标"],
  ["openvla", "rt2", "开源对标"],
  ["covariant", "helix", "机器人操作"],
  ["glean", "gpt4", "由大模型驱动"],
  ["grok", "blackwell", "算力(Colossus)"],
  ["recursion", "blackwell", "算力合作"],
  ["insilico", "blackwell", "算力"],
  ["atlas_robot", "rt2", "VLA研究"],
  ["unitree_g1", "openvla", "开源VLA"],
  ["neo", "gpt4", "OpenAI 加持"],
  ["ponyai", "blackwell", "车端算力"],
  ["weride", "blackwell", "车端算力"],
  ["foxconn_lighthouse", "blackwell", "代工AI服务器"],
  ["cognex_vision", "blackwell", "视觉算力"],
  ["siemens_iai", "omniverse", "工业数字孪生"],
  ["arm_arch", "blackwell", "Grace基于ARM"],
  ["mixtral", "blackwell", "算力"],
  ["stable_diffusion", "blackwell", "算力"],
  ["midjourney", "blackwell", "算力"],
  ["sora", "blackwell", "算力"],
  ["pure_flash", "blackwell", "喂数据给GPU"],
  ["pyg_dgl", "alphafold", "图结构建模"],
  ["ualink_p", "mi300", "AMD 阵营"],
  ["gev_grid", "vertiv_power", "电力装备"],
  ["transformer", "gpt4", "架构源头"],

  /* 光模块供应链「深结构」：模块 ← EML激光芯片 / DSP ← 上游，模块 → 网络设备 → GPU */
  ["innolight_optic", "lumentum_eml", "EML激光芯片"],
  ["aaoi_module", "lumentum_eml", "EML激光芯片"],
  ["eoptolink_optic", "lumentum_eml", "EML激光芯片"],
  ["innolight_optic", "avgo_optical_dsp", "光DSP芯片"],
  ["aaoi_module", "avgo_optical_dsp", "光DSP芯片"],
  ["coherent_optic", "aaoi_module", "光器件供应"],
  ["aaoi_module", "innolight_optic", "模块同行"],
  ["aaoi_module", "infiniband", "接入AI组网"],
  ["aaoi_module", "ciena_net", "用于光网络"],
  ["ciena_net", "nokia_net", "网络设备同行"],
  ["ciena_net", "innolight_optic", "用光模块"],
  ["nokia_net", "innolight_optic", "用光模块"],
  ["micron_hbm", "blackwell", "HBM显存"],
  ["micron_hbm", "hbm", "HBM同行"],
  ["aaoi_module", "blackwell", "服务AI集群"],
  /* 光通信：上游光芯片 → 中游模块 → 下游网络设备 */
  ["innolight_optic", "mrvl_optical", "光DSP芯片"],
  ["innolight_optic", "yuanjie_laser", "国产激光芯片"],
  ["innolight_optic", "tianfu_comp", "光器件配套"],
  ["innolight_optic", "accelink_mod", "模块同行"],
  ["aaoi_module", "tianfu_comp", "光器件配套"],
  ["fabrinet", "lumentum_eml", "代工"],
  ["fabrinet", "aaoi_module", "代工"],
  ["fabrinet", "innolight_optic", "代工同行"],
  ["mrvl_optical", "avgo_optical_dsp", "DSP双雄"],
  ["yuanjie_laser", "lumentum_eml", "激光芯片同行"],
  ["accelink_mod", "tianfu_comp", "国产光链"],
  ["innolight_optic", "arista_opt", "供货给交换机"],
  ["aaoi_module", "cisco_net", "供货给网络设备"],
  ["ciena_net", "cisco_net", "网络设备同行"],
  ["ciena_net", "innolight_optic", "用光模块"],
  ["arista_opt", "infiniband", "AI组网"],
  /* 光通信再加深：上游器件细分 + 中游用上游 + 下游设备商 */
  ["innolight_optic", "macom_chip", "驱动/TIA"],
  ["aaoi_module", "macom_chip", "驱动/TIA"],
  ["innolight_optic", "semtech_cdr", "CDR/信号"],
  ["macom_chip", "semtech_cdr", "上游芯片同行"],
  ["macom_chip", "lumentum_eml", "上游器件同道"],
  ["coherent_module", "lumentum_eml", "EML激光芯片"],
  ["coherent_module", "innolight_optic", "模块同行"],
  ["coherent_module", "avgo_optical_dsp", "光DSP"],
  ["juniper_net", "innolight_optic", "用光模块"],
  ["juniper_net", "cisco_net", "网络设备同行"],
  ["ericsson_net", "ciena_net", "电信设备同行"],
  ["ericsson_net", "nokia_net", "电信设备同行"],
  ["aaoi_module", "juniper_net", "供货给设备商"],
  ["innolight_optic", "cisco_net", "供货给设备商"],

  /* 芯片半导体链「深结构」：GPU ← 代工 ← 设备/EDA/封装 */
  ["blackwell", "tsmc_foundry", "代工制造"],
  ["mi300", "tsmc_foundry", "代工制造"],
  ["tsmc_foundry", "cowos", "先进封装"],
  ["cowos", "hbm", "集成HBM"],
  ["cowos", "micron_hbm", "集成HBM"],
  ["tsmc_foundry", "asml_euv", "光刻设备"],
  ["tsmc_foundry", "amat_eq", "制造设备"],
  ["tsmc_foundry", "lam_eq", "制造设备"],
  ["tsmc_foundry", "kla_eq", "量测设备"],
  ["tsmc_foundry", "samsung_foundry", "代工同行"],
  ["blackwell", "synopsys", "EDA设计"],
  ["blackwell", "cadence", "EDA设计"],
  ["cowos", "ase_pkg", "封测外包"],
  ["cowos", "amkr_pkg", "封测外包"],
  /* 设备 / 代工 / EDA 互相加密，让每个节点信息更丰富 */
  ["asml_euv", "samsung_foundry", "光刻设备"],
  ["asml_euv", "intel_foundry", "光刻设备"],
  ["asml_euv", "amat_eq", "设备同行"],
  ["amat_eq", "lam_eq", "设备同行"],
  ["amat_eq", "kla_eq", "设备同行"],
  ["lam_eq", "kla_eq", "设备同行"],
  ["amat_eq", "samsung_foundry", "制造设备"],
  ["lam_eq", "samsung_foundry", "制造设备"],
  ["kla_eq", "samsung_foundry", "量测设备"],
  ["synopsys", "tsmc_foundry", "设计协同"],
  ["cadence", "tsmc_foundry", "设计协同"],
  ["synopsys", "cadence", "EDA双雄"],
  ["tsmc_foundry", "intel_foundry", "代工同行"],
  ["asml_euv", "tsmc_foundry", "光刻设备"],

  /* 太空算力链 */
  ["starlink", "starship", "靠火箭部署"],
  ["ast_sat", "starlink", "卫星互联同行"],
  ["neutron", "starship", "火箭同行"],
  ["starcloud", "space_gpu", "太空算力"],
  ["starcloud", "starship", "发射部署"],
  ["starcloud", "blackwell", "GPU算力"],
  ["starcloud", "nextera_grid", "太空太阳能"],

  /* 能源 / 电力链：发电 → 核电/燃气 → 数据中心供电 → 电网 */
  ["vertiv_power", "gev_gas", "就近发电"],
  ["vertiv_power", "ceg_nuke", "核电供电"],
  ["blackwell", "ceg_nuke", "AI耗电→核电"],
  ["ceg_nuke", "oklo_smr", "核电同道"],
  ["oklo_smr", "nuscale_smr", "SMR同行"],
  ["ceg_nuke", "vst_nuke", "核电运营同行"],
  ["gev_gas", "cat_genset", "燃气发电"],
  ["cat_genset", "cmi_power", "发电机组同行"],
  ["eaton_grid", "gev_gas", "并网"],

  /* 机器人 / 具身智能：本体 ← 大脑(VLA) / 零部件 / 芯片 */
  ["optimus", "harmonic_drive", "谐波减速器"],
  ["figure02", "harmonic_drive", "谐波减速器"],
  ["agility_digit", "harmonic_drive", "谐波减速器"],
  ["optimus", "jetson_robot", "计算芯片"],
  ["figure02", "jetson_robot", "计算芯片"],
  ["agility_digit", "openvla", "VLA大脑"],
  ["apptronik_apollo", "groot", "用GR00T"],
  ["neo", "groot", "用GR00T"],
  ["teradyne_arm", "harmonic_drive", "零部件同行"],
];

export interface Related extends ProductEntry {
  rel: string; // 与出发产品的关系：「同公司」或具体的供应/驱动标签
}

/**
 * 一个产品的相关产品 = ① 同公司的其它产品 ② 跨产品 LINKS 直接相连的产品。
 * 显式关系（驱动/算力…）优先于「同公司」。
 */
export function relatedProducts(pid: string): Related[] {
  const origin = PRODUCTS[pid];
  if (!origin) return [];
  const rel = new Map<string, string>();
  // ① 同公司足迹
  if (origin.companyId) {
    for (const e of Object.values(PRODUCTS)) {
      if (e.id !== pid && e.companyId === origin.companyId) rel.set(e.id, "同公司");
    }
  }
  // ② 跨产品供应/驱动（覆盖「同公司」标签）
  for (const [a, b, label] of LINKS) {
    if (a === pid) rel.set(b, label);
    else if (b === pid) rel.set(a, label);
  }
  return [...rel.entries()]
    .filter(([id]) => PRODUCTS[id])
    .map(([id, r]) => ({ ...PRODUCTS[id], rel: r }));
}

/** 上游(origin 依赖它) / 下游(它依赖 origin) / 同侧(同公司·同行·对标)。 */
export type RelDir = "up" | "down" | "side";

export interface TreeRelated extends Related {
  dir: RelDir;
  rank: number; // 供应链层级（越大越上游）
}

/**
 * 每座城市在产业链上的「层级」：越下游(贴近用户)越小、越上游(贴近原料/能源)越大。
 * 应用(0) → 模型(3) → 计算芯片(5) → 集群部件/互联/存储(6) → 光模块/光芯片(6.5–7.5)
 *         → 封装/代工(7–7.5) → 半导体设备/EDA(8.5) → 能源(9–10)
 */
const CITY_RANK: Record<string, number> = {
  // 应用层（终端产品，最下游）
  chatbots: 0, digital_biology: 0, robotaxi: 0, enterprise: 0,
  science: 0, robotics: 0, manufacturing: 0, ai_coder: 0,
  // 太空（前沿应用 / 轨道基建）
  orbital_dc: 1, satellite: 1, launch: 2,
  // 模型层
  llm: 3, vlm: 3, vla: 3, mmllm: 3, gpt: 3, dm: 3, gnn: 3, moe: 3, ssm: 3, lbm: 3,
  // 计算芯片
  gpu: 5, cpu: 5, dpu: 5,
  // 集群部件：互联 / 网络 / 显存存储
  nvlink: 6, network: 6, storage: 6,
  // 光通信：下游设备(6) → 中游模块(6.5) → 上游光芯片(7.5)
  opt_network: 6, opt_module: 6.5, opt_chip: 7.5,
  // 制造：封装 → 代工 → 设备 / EDA
  packaging: 7, foundry: 7.5, equipment: 8.5, eda: 8.5,
  // 能源（最上游）
  cooling: 9, power: 9, grid: 9.5, generation: 10, nuclear: 10,
};
/** 少数「混在应用城市里的部件/大脑」按真实层级修正。 */
const PRODUCT_RANK: Record<string, number> = {
  groot: 3, // 机器人大脑(模型)
  jetson_robot: 5, // 机器人计算芯片
  harmonic_drive: 7, // 谐波减速器(上游零部件)
  teradyne_arm: 7, // 机械臂部件
};
const rankOf = (p: ProductEntry): number =>
  PRODUCT_RANK[p.id] ?? CITY_RANK[p.cityId] ?? 3;

/**
 * 把相关产品按**产业链层级**归类，用于树状图上下拆分：
 *   · 对端层级 > origin → 「上游」(origin 依赖它，如算力/部件/代工/能源)
 *   · 对端层级 < origin → 「下游」(它依赖 origin)
 *   · 层级相同 / 仅「同公司」足迹 → 「同侧」(同行·对标·同一家公司)
 * 用层级而非 LINKS 的书写顺序，避免「供货 / 服务」等反向写法和重复连边造成的方向错乱。
 */
export function relatedTree(pid: string): TreeRelated[] {
  const origin = PRODUCTS[pid];
  if (!origin) return [];
  const ro = rankOf(origin);
  const map = new Map<string, { rel: string; dir: RelDir }>();
  // ① 同公司足迹 → 同侧
  if (origin.companyId) {
    for (const e of Object.values(PRODUCTS)) {
      if (e.id !== pid && e.companyId === origin.companyId) {
        map.set(e.id, { rel: "同公司", dir: "side" });
      }
    }
  }
  // ② 显式供应/驱动关系 → 按层级定方向（覆盖「同公司」）
  for (const [a, b, label] of LINKS) {
    let other: string;
    if (a === pid) other = b;
    else if (b === pid) other = a;
    else continue;
    const op = PRODUCTS[other];
    if (!op) continue;
    const rr = rankOf(op);
    const dir: RelDir = rr > ro ? "up" : rr < ro ? "down" : "side";
    map.set(other, { rel: label, dir });
  }
  return [...map.entries()]
    .filter(([id]) => PRODUCTS[id])
    .map(([id, v]) => ({ ...PRODUCTS[id], rel: v.rel, dir: v.dir, rank: rankOf(PRODUCTS[id]) }));
}

/* ---------------- 公司足迹（公司页用） ---------------- */
export interface Stop {
  cityId: string;
  name: string;
  note?: string;
  by?: string;
  companyId: string;
}

export function productsOfCompany(companyId: string): Stop[] {
  return Object.values(PRODUCTS)
    .filter((p) => p.companyId === companyId)
    .map((p) => ({ cityId: p.cityId, name: p.name, note: p.note, by: p.by, companyId }));
}

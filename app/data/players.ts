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

import { companyIdByName } from "./companiesClient";

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
    { id: "deepseek_app", name: "DeepSeek", by: "DeepSeek", note: "以极致性价比出圈的中国开源大模型助手。" },
    { id: "qianwen", name: "通义千问", by: "阿里云", note: "阿里的对话助手，背靠 Qwen 开源模型。" },
    { id: "character_chat", name: "Character.AI", by: "Character.AI", note: "AI 角色扮演聊天，用户黏性极高。" },
    { id: "inflection_pi", name: "Pi", by: "Inflection AI", note: "主打情感陪伴的个人 AI 助手。" },
    { id: "hailuo_chat", name: "海螺 AI", by: "MiniMax", note: "MiniMax 的对话助手，出海表现亮眼。" },
    { id: "spark_chat", name: "讯飞星火", by: "科大讯飞", note: "科大讯飞自研的对话大模型助手。" },
    { id: "zhipu_chat", name: "智谱清言", by: "智谱 AI", note: "清华系智谱的对话助手，背靠 GLM。" },
    { id: "poe_chat", name: "Poe", by: "Quora", note: "聚合各家大模型的对话平台。" },
  ],
  digital_biology: [
    { id: "alphafold", name: "AlphaFold", by: "DeepMind", note: "破解蛋白质折叠，拿下诺贝尔化学奖。" },
    { id: "isomorphic", name: "Isomorphic Labs", by: "Alphabet", note: "DeepMind 分拆，用 AI 做新药研发。" },
    { id: "recursion", name: "Recursion", by: "RXRX", note: "自动化湿实验室 × AI，规模化造药。" },
    { id: "insilico", name: "Insilico Medicine", note: "端到端生成式制药，多条管线进临床。", companyId: "insilico" },
    { id: "xaira_dd", name: "Xaira", by: "Xaira", note: "重金起步的 AI 药物发现公司。" },
    { id: "esm3", name: "ESM3", by: "EvolutionaryScale", note: "蛋白质大语言模型，能生成全新蛋白。" },
  ],
  robotaxi: [
    { id: "waymo", name: "Waymo", by: "Alphabet", note: "全无人商业运营最成熟的玩家。" },
    { id: "fsd", name: "Robotaxi / FSD", by: "Tesla", note: "纯视觉路线，押注端到端大模型。" },
    { id: "zoox", name: "Zoox", by: "Amazon", note: "亚马逊旗下，专造无方向盘车厢。" },
    { id: "cruise", name: "Cruise", by: "GM", note: "通用汽车旗下自动驾驶。" },
    { id: "ponyai", name: "小马智行 Pony", by: "Pony.ai", note: "中国头部 Robotaxi，多城商业运营。" },
    { id: "weride", name: "WeRide 文远知行", by: "WeRide", note: "中国 L4 自动驾驶，多车型量产落地。" },
    { id: "apollo_go", name: "Apollo Go 萝卜快跑", by: "Baidu", note: "百度自动驾驶，中国订单量领先的 Robotaxi。" },
    { id: "mobileye_adas", name: "Mobileye", by: "Mobileye", note: "自动驾驶视觉与 EyeQ 芯片老牌龙头。" },
    { id: "aurora_driver", name: "Aurora Driver", by: "Aurora", note: "自动驾驶卡车领先者，已开无人商运。" },
    { id: "wayve_ad", name: "Wayve", by: "Wayve", note: "端到端学习、无高精地图的自动驾驶。" },
    { id: "nuro_driver", name: "Nuro Driver", by: "Nuro", note: "从无人配送转向授权 L4 方案。" },
    { id: "momenta_ad", name: "Momenta", by: "Momenta", note: "中国头部高阶智能驾驶方案商。" },
    { id: "waabi_ad", name: "Waabi", by: "Waabi", note: "仿真优先的自动驾驶卡车。" },
    { id: "applied_sim", name: "Applied Intuition", by: "Applied Intuition", note: "自动驾驶仿真与工具链龙头。" },
  ],
  enterprise: [
    { id: "m365_copilot", name: "Copilot for M365", by: "Microsoft", note: "让 Office 里的每个人配上 AI 助手。" },
    { id: "agentforce", name: "Agentforce", by: "Salesforce", note: "在 CRM 里部署能干活的 AI 智能体。" },
    { id: "now_assist", name: "Now Assist", by: "ServiceNow", note: "把 AI 嵌入 IT/HR 工作流。" },
    { id: "aip", name: "AIP", by: "Palantir", note: "把大模型接到真实业务数据做决策。" },
    { id: "glean", name: "Glean", note: "企业内部的 AI 搜索与工作助手。", companyId: "glean" },
    { id: "writer_ai", name: "Writer", by: "Writer", note: "面向大企业的全栈生成式 AI 平台。" },
    { id: "sierra_agent", name: "Sierra", by: "Sierra", note: "Bret Taylor 创立的企业 AI 客服智能体。" },
    { id: "decagon_agent", name: "Decagon", by: "Decagon", note: "自动化大规模客户支持的 AI 智能体。" },
    { id: "harvey_ai", name: "Harvey", by: "Harvey", note: "法律行业专用 AI 智能体。" },
    { id: "hebbia_ai", name: "Hebbia", by: "Hebbia", note: "面向金融/专业服务的知识智能体。" },
    { id: "ibm_watson", name: "watsonx", by: "IBM", note: "IBM 企业级 AI 平台，主打自有数据与治理。" },
    { id: "robin_legal", name: "Robin AI", by: "Robin AI", note: "合同审查与法律 AI 智能体。" },
  ],
  ai_agent: [
    { id: "manus_agent", name: "Manus", by: "Manus", note: "爆红的通用自主智能体，能操作电脑办事。" },
    { id: "operator", name: "OpenAI Operator", by: "OpenAI", note: "会自己操作浏览器的智能体。" },
    { id: "genspark_agent", name: "Genspark Super Agent", by: "Genspark", note: "自动做任务、生成报告的智能体。" },
    { id: "adept_agent", name: "Adept", by: "Adept", note: "操作企业软件界面的 Agent 模型。" },
    { id: "lindy_agent", name: "Lindy", by: "Lindy", note: "无代码搭建自动化 AI 智能体。" },
    { id: "multion_agent", name: "MultiOn", by: "MultiOn", note: "自主操作网页的 AI 智能体。" },
  ],
  robot_parts: [
    { id: "leader_harmonic", name: "谐波减速器", by: "绿的谐波", note: "国产谐波减速器龙头，关节核心。" },
    { id: "sanhua_actuator", name: "机电执行器", by: "三花智控", note: "机器人执行器/丝杠，特斯拉链。" },
    { id: "topu_screw", name: "直线执行器 / 丝杠", by: "拓普集团", note: "人形机器人直线执行器与关节。" },
    { id: "inovance_motor", name: "无框电机 / 伺服", by: "汇川技术", note: "机器人无框电机与伺服系统。" },
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
    { id: "unitree_g1", name: "Unitree G1", by: "Unitree", note: "【本体】高性价比人形机器人，出货量领先。" },
    { id: "phoenix_robot", name: "Phoenix", by: "Sanctuary AI", note: "【本体】主打类人灵巧手操作的人形机器人。" },
    { id: "fourier_gr", name: "Fourier GR", by: "傅利叶", note: "【本体】中国通用人形与康复机器人。" },
    { id: "walker_robot", name: "Walker S", by: "优必选", note: "【本体】率先进厂实训的人形机器人。" },
    { id: "agibot_robot", name: "远征 A2", by: "智元机器人", note: "【本体】量产落地快的人形机器人。" },
    { id: "galbot_robot", name: "Galbot G1", by: "银河通用", note: "【本体】轮式人形 + 具身大模型。" },
    { id: "robotera_star", name: "小星", by: "星动纪元", note: "【本体】清华系人形机器人。" },
    { id: "engineai_robot", name: "众擎 SE", by: "众擎机器人", note: "【本体】主打自然步态与高动态运动。" },
    { id: "skild_brain", name: "Skild 通用大脑", by: "Skild AI", note: "【大脑】可迁移到各种机器人的基础模型。" },
    { id: "dexterity_robot", name: "Dexterity", by: "Dexterity", note: "【本体】仓储物流搬运/拣选机器人。" },
    { id: "cobot_robot", name: "Cobot", by: "Collaborative Robotics", note: "【本体】协作型移动机器人。" },
    { id: "groot", name: "GR00T", by: "NVIDIA", note: "【大脑】人形机器人通用基础模型与仿真。" },
    { id: "harmonic_drive", name: "谐波减速器", by: "Harmonic Drive", note: "【零部件】关节核心，日本全球龙头。" },
    { id: "teradyne_arm", name: "协作机械臂", by: "Teradyne", note: "【零部件】Universal Robots 母公司。" },
    { id: "jetson_robot", name: "Jetson / Thor 芯片", by: "NVIDIA", note: "【芯片】机器人计算平台。" },
  ],
  manufacturing: [
    { id: "omniverse", name: "Omniverse", by: "NVIDIA", note: "工厂数字孪生与仿真平台。" },
    { id: "siemens_iai", name: "Industrial AI", by: "Siemens", note: "工业自动化 + 数字孪生落地。" },
    { id: "cognex_vision", name: "机器视觉", by: "Cognex", note: "工厂质检与定位的「眼睛」。" },
    { id: "foxconn_lighthouse", name: "灯塔工厂", by: "富士康", note: "AI 服务器代工主力，推进智能制造。" },
  ],
  ai_coder: [
    { id: "github_copilot", name: "GitHub Copilot", by: "Microsoft", note: "把 AI 编程带向主流的开创者。" },
    { id: "cursor", name: "Cursor", by: "Anysphere", note: "整库理解 + 智能体，增长最快的 AI 编辑器。" },
    { id: "windsurf", name: "Windsurf", by: "Codeium", note: "主打智能体式编程体验。" },
    { id: "replit_agent", name: "Replit Agent", by: "Replit", note: "说句话就能生成并部署应用。" },
    { id: "amazon_q", name: "Amazon Q", by: "AWS", note: "面向企业开发与运维的 AI 助手。" },
    { id: "devin", name: "Devin", by: "Cognition", note: "首个「AI 软件工程师」，自主完成编程任务。" },
    { id: "tabnine_ai", name: "Tabnine", by: "Tabnine", note: "注重隐私与私有部署的代码助手。" },
    { id: "v0", name: "v0", by: "Vercel", note: "从提示词生成可用前端界面代码。" },
    { id: "magic_code", name: "Magic", by: "Magic.dev", note: "超长上下文 AI 编程模型。" },
    { id: "poolside_code", name: "Poolside", by: "Poolside", note: "自研代码基座模型，企业私有部署。" },
    { id: "bolt", name: "Bolt.new", by: "StackBlitz", note: "浏览器里说话建全栈应用。" },
    { id: "lovable_code", name: "Lovable", by: "Lovable", note: "自然语言生成可部署 Web 应用。" },
    { id: "augment_code", name: "Augment", by: "Augment Code", note: "面向大型代码库的 AI 编程。" },
    { id: "cody_code", name: "Cody", by: "Sourcegraph", note: "代码搜索起家的 AI 编程助手。" },
  ],
  genmedia: [
    { id: "elevenlabs_v", name: "ElevenLabs", by: "ElevenLabs", note: "最逼真的 AI 语音合成与配音。" },
    { id: "runway_gen", name: "Runway Gen-4.5", by: "Runway", note: "AI 视频生成先驱，影视级创作与运镜控制。" },
    { id: "pika_v", name: "Pika", by: "Pika Labs", note: "易用、特效丰富的 AI 视频生成。" },
    { id: "luma_dream", name: "Dream Machine", by: "Luma AI", note: "视频生成 + 3D 重建。" },
    { id: "suno_m", name: "Suno", by: "Suno", note: "一句话生成整首带人声的歌。" },
    { id: "udio_m", name: "Udio", by: "Udio", note: "高音质 AI 音乐生成。" },
    { id: "heygen_v", name: "HeyGen", by: "HeyGen", note: "AI 数字人口播视频生成。" },
    { id: "synthesia_v", name: "Synthesia", by: "Synthesia", note: "企业级 AI 虚拟主播视频。" },
    { id: "hailuo_video", name: "海螺视频 Hailuo", by: "MiniMax", note: "MiniMax 的 AI 视频生成，出海爆火。" },
    { id: "kling_video", name: "可灵 Kling", by: "快手", note: "快手 AI 视频生成，效果对标 Sora。" },
    { id: "cartesia_voice", name: "Cartesia 语音", by: "Cartesia", note: "超低延迟实时语音生成。" },
    { id: "genmo_video", name: "Mochi", by: "Genmo", note: "开源文生视频模型。" },
    { id: "higgsfield_video", name: "Higgsfield", by: "Higgsfield", note: "移动端 AI 视频，主打运镜特效。" },
    { id: "playht_voice", name: "PlayAI", by: "PlayAI", note: "语音克隆与语音智能体平台。" },
  ],
  search_ai: [
    { id: "pplx_search", name: "Perplexity", by: "Perplexity", note: "对话式答案引擎，AI 搜索代表。" },
    { id: "searchgpt", name: "ChatGPT Search", by: "OpenAI", note: "把实时网页检索接入 ChatGPT。" },
    { id: "ai_overviews", name: "AI Overviews", by: "Google", note: "谷歌搜索里的 AI 摘要答案。" },
    { id: "grok_search", name: "Grok 搜索", by: "xAI", note: "结合 X 实时数据的 AI 搜索。" },
  ],
  health_ai: [
    { id: "abridge_scribe", name: "Abridge", by: "Abridge", note: "把医患对话实时转成结构化病历。" },
    { id: "openevidence_search", name: "OpenEvidence", by: "OpenEvidence", note: "医生用的循证医学 AI 搜索。" },
    { id: "tempus_ai", name: "Tempus", by: "Tempus AI", note: "精准医疗数据与 AI 诊断。" },
    { id: "hippocratic_agent", name: "Hippocratic", by: "Hippocratic AI", note: "医疗语音智能体（AI 护士）。" },
    { id: "nabla_scribe", name: "Nabla", by: "Nabla", note: "医生用的 AI 环境问诊记录。" },
    { id: "suki_voice", name: "Suki", by: "Suki", note: "临床医生的 AI 语音助手。" },
  ],
  design_ai: [
    { id: "canva_ai", name: "Canva Magic Studio", by: "Canva", note: "在线设计 + 生成式 AI。" },
    { id: "figma_ai", name: "Figma AI", by: "Figma", note: "协作 UI 设计 + AI 辅助。" },
    { id: "firefly_design", name: "Adobe Firefly", by: "Adobe", note: "版权合规的商用生成式创作。" },
  ],
  edge_ai: [
    { id: "apple_intelligence", name: "Apple Intelligence", by: "Apple", note: "装进 iPhone/Mac 的端侧 AI，接入 ChatGPT。" },
    { id: "snapdragon_ai", name: "骁龙 AI", by: "Qualcomm", note: "手机与 AI PC 的端侧算力(NPU)。" },
    { id: "dimensity_ai", name: "天玑 AI", by: "MediaTek", note: "联发科手机 SoC 的端侧 AI。" },
    { id: "copilot_pc", name: "Copilot+ PC", by: "Microsoft", note: "内建 NPU 的 AI 电脑新品类。" },
  ],
  ai_ad: [
    { id: "applovin_ax", name: "AXON 广告引擎", by: "AppLovin", note: "AI 推荐驱动的移动广告，业绩暴涨。" },
    { id: "tradedesk_ad", name: "Kokai 程序化广告", by: "The Trade Desk", note: "最大独立程序化广告平台。" },
    { id: "meta_ads", name: "Meta 广告 AI", by: "Meta", note: "Advantage+ 用 AI 自动优化投放。" },
  ],
  fin_ai: [
    { id: "bloomberg_gpt", name: "BloombergGPT", by: "Bloomberg", note: "面向金融的专用大模型。" },
    { id: "aladdin_ai", name: "Aladdin AI", by: "BlackRock", note: "贝莱德风控/投研平台接入 AI。" },
  ],
  edu_ai: [
    { id: "duolingo_max", name: "Duolingo Max", by: "Duolingo", note: "AI 对话与讲解私教。" },
    { id: "khanmigo", name: "Khanmigo", by: "可汗学院", note: "可汗学院的一对一 AI 辅导。" },
    { id: "speak_tutor", name: "Speak", by: "Speak", note: "AI 口语陪练。" },
  ],
  voice_agent: [
    { id: "cresta_cx", name: "Cresta", by: "Cresta", note: "呼叫中心实时 AI 辅助与智能体。" },
    { id: "retell_voice", name: "Retell AI", by: "Retell AI", note: "快速搭建语音智能体的平台。" },
    { id: "vapi_voice", name: "Vapi", by: "Vapi", note: "语音 AI 智能体开发平台。" },
    { id: "deepgram_stt", name: "Deepgram", by: "Deepgram", note: "企业级语音识别(STT)龙头。" },
    { id: "assemblyai_stt", name: "AssemblyAI", by: "AssemblyAI", note: "语音识别与理解 API。" },
  ],
  ai_security: [
    { id: "crowdstrike_ai", name: "Charlotte AI", by: "CrowdStrike", note: "端点安全 + AI 威胁狩猎智能体。" },
    { id: "paloalto_ai", name: "Cortex AI", by: "Palo Alto", note: "安全运营平台的 AI 检测响应。" },
    { id: "sentinelone_ai", name: "SentinelOne", by: "SentinelOne", note: "AI 驱动的自主端点安全。" },
    { id: "zscaler_ai", name: "Zscaler", by: "Zscaler", note: "零信任云安全 + AI 流量分析。" },
    { id: "wiz_sec", name: "Wiz", by: "Wiz", note: "云安全新星，谷歌天价收购。" },
  ],
  defense_ai: [
    { id: "anduril_lattice", name: "Anduril Lattice", by: "Anduril", note: "自主武器 + 战场 AI 操作系统。" },
    { id: "palantir_gotham", name: "Palantir Gotham", by: "Palantir", note: "政府/国防情报分析平台。" },
    { id: "helsing_ai", name: "Helsing", by: "Helsing", note: "欧洲最大 AI 国防独角兽。" },
    { id: "shield_hivemind", name: "Hivemind", by: "Shield AI", note: "无人机自主飞行 AI 飞行员。" },
    { id: "saronic_usv", name: "Saronic 无人舰", by: "Saronic", note: "AI 自主无人水面舰艇。" },
  ],
  bci: [
    { id: "neuralink_bci", name: "Neuralink N1", by: "Neuralink", note: "高带宽植入式脑机接口，已入人体。" },
    { id: "synchron_bci", name: "Synchron Stentrode", by: "Synchron", note: "经血管微创脑机接口。" },
    { id: "precision_bci", name: "Precision 皮层电极", by: "Precision Neuroscience", note: "超薄柔性电极阵列。" },
    { id: "paradromics_bci", name: "Paradromics", by: "Paradromics", note: "高通道数植入式脑机接口。" },
  ],
  productivity_ai: [
    { id: "notion_ai", name: "Notion AI", by: "Notion", note: "文档/知识库里的写作与问答智能体。" },
    { id: "grammarly_ai", name: "Grammarly", by: "Grammarly", note: "AI 写作语法与改写辅助。" },
    { id: "deepl_tr", name: "DeepL", by: "DeepL", note: "以质量著称的 AI 翻译。" },
    { id: "moveworks_ai", name: "Moveworks", by: "Moveworks", note: "企业 IT/HR 支持 AI 智能体。" },
  ],
  game_ai: [
    { id: "inworld_npc", name: "Inworld", by: "Inworld AI", note: "游戏 NPC 的对话/行为 AI 引擎。" },
    { id: "scenario_assets", name: "Scenario", by: "Scenario", note: "游戏美术 AI 生成平台。" },
  ],

  /* ---------- 模型层 ---------- */
  llm: [
    { id: "gpt4", name: "GPT-5.6（Sol/Terra/Luna）", by: "OpenAI", note: "2026.7 发布的旗舰家族；Sol 主打前沿推理与智能体。" },
    { id: "claude35", name: "Claude Fable 5 · Opus 4.8", by: "Anthropic", note: "编程与长上下文标杆；Fable 5 为 Opus 之上的最强档。" },
    { id: "gemini_llm", name: "Gemini 3.1 Pro", by: "Google", note: "Gemini 3 系列，百万级上下文、原生多模态、推理领先。" },
    { id: "llama", name: "Llama 4", by: "Meta", note: "开源扛旗者，主打智能体能力。" },
    { id: "grok_llm", name: "Grok 4.5", by: "xAI", note: "绑定 X 实时数据，Opus 级推理。" },
    { id: "mistral_large", name: "Mistral Large", by: "Mistral", note: "欧洲开源大模型旗手。" },
    { id: "deepseek_v3", name: "DeepSeek-V3 / R1", by: "DeepSeek", note: "低成本高性能开源模型，撼动行业定价。" },
    { id: "qwen", name: "通义千问 Qwen", by: "阿里云", note: "开源生态最广的中文大模型之一。" },
    { id: "ernie", name: "文心一言 ERNIE", by: "百度", note: "百度自研大模型，中国最早商用之一。" },
    { id: "command_r", name: "Command", by: "Cohere", note: "面向企业、主打检索与私有部署的大模型。" },
    { id: "dbrx", name: "DBRX", by: "Databricks", note: "Databricks 开源 MoE 大模型。" },
    { id: "reka_core", name: "Reka Core", by: "Reka AI", note: "原生多模态大模型新锐。" },
    { id: "yi_model", name: "Yi", by: "零一万物", note: "李开复团队的开源中英双语大模型。" },
    { id: "nova_model", name: "Amazon Nova", by: "Amazon", note: "亚马逊自研大模型系列，主打性价比。" },
    { id: "phi_model", name: "Phi", by: "Microsoft", note: "微软小而强的开源模型系列。" },
    { id: "glm", name: "GLM", by: "智谱 AI", note: "清华系开源/商用大模型系列。" },
    { id: "step_model", name: "Step", by: "阶跃星辰", note: "万亿参数多模态大模型。" },
    { id: "sensenova", name: "日日新 SenseNova", by: "商汤科技", note: "商汤自研大模型体系。" },
    { id: "minimax_m", name: "MiniMax 大模型", by: "MiniMax", note: "自研大模型，支撑海螺与视频生成。" },
    { id: "falcon", name: "Falcon", by: "TII", note: "阿联酋 TII 的开源大模型。" },
    { id: "nemotron", name: "Nemotron", by: "NVIDIA", note: "英伟达开源大模型系列。" },
    { id: "granite", name: "Granite", by: "IBM", note: "IBM 企业级开源模型。" },
    { id: "aleph_model", name: "Aleph Alpha", by: "Aleph Alpha", note: "德国主权大模型，主打可解释合规。" },
    { id: "ssi_model", name: "SSI（研发中）", by: "SSI", note: "Ilya 创立，只做安全超级智能。" },
    { id: "tml_model", name: "Thinking Machines", by: "Thinking Machines Lab", note: "Mira Murati 领衔的前沿实验室。" },
  ],
  vlm: [
    { id: "gpt4v", name: "GPT-5.6（视觉）", by: "OpenAI", note: "原生多模态，看图说话已并入 GPT-5.6。" },
    { id: "gemini_vlm", name: "Gemini 3.1（视觉）", by: "Google", note: "图文混合理解能力强。" },
    { id: "claude_vlm", name: "Claude", by: "Anthropic", note: "擅长读图表、截图与文档。" },
    { id: "llama_vlm", name: "Llama Vision", by: "Meta", note: "开源多模态版本。" },
    { id: "llava", name: "LLaVA", note: "开源 VLM 研究的常用基线。", companyId: "llava" },
  ],
  vla: [
    { id: "rt2", name: "RT-2", by: "DeepMind", note: "把网络知识迁移到机器人动作。" },
    { id: "openvla", name: "OpenVLA", note: "开源视觉-语言-动作模型。", companyId: "openvla" },
    { id: "helix", name: "Helix", by: "Figure", note: "Figure 自研，驱动上半身精细操作。" },
    { id: "pi0", name: "π0", by: "Physical Intelligence", note: "跨本体通用机器人策略模型。" },
  ],
  mmllm: [
    { id: "gpt4o_mm", name: "GPT-5.6（多模态）", by: "OpenAI", note: "文本/语音/图像统一的端到端模型。" },
    { id: "gemini_mm", name: "Gemini 3.1（多模态）", by: "Google", note: "从设计之初就是原生多模态。" },
  ],
  gpt: [
    { id: "gpt_series", name: "GPT 系列（至 GPT-5.6）", by: "OpenAI", note: "把「预训练 + 微调」范式发扬光大，现已迭代到 GPT-5.6。" },
    { id: "transformer", name: "Transformer", by: "Google（原始论文）", note: "2017《Attention Is All You Need》，一切的起点。" },
  ],
  dm: [
    { id: "sora", name: "Sora（已停用）", by: "OpenAI", note: "曾引爆文生视频；OpenAI 于 2026 停用独立产品，能力并入 ChatGPT。" },
    { id: "midjourney", name: "Midjourney V8.1", note: "画质口碑最佳的文生图。", companyId: "midjourney" },
    { id: "stable_diffusion", name: "Stable Diffusion 3.5", by: "Stability AI", note: "开源图像生成的基石。" },
    { id: "imagen", name: "Imagen / Veo 3.1", by: "Google", note: "谷歌的图像/视频生成模型，Veo 3.1 音画俱佳。" },
    { id: "firefly", name: "Firefly", by: "Adobe", note: "强调版权合规的商用生成。" },
    { id: "ideogram_img", name: "Ideogram", by: "Ideogram", note: "擅长在图中生成文字与海报。" },
    { id: "flux_img", name: "FLUX.2", by: "Black Forest Labs", note: "原 SD 核心团队的高质量开源图像模型（含 Klein/Kontext）。" },
    { id: "recraft_img", name: "Recraft", by: "Recraft", note: "面向设计师的可控/矢量图像生成。" },
    { id: "leonardo_img", name: "Leonardo.Ai", by: "Leonardo.Ai", note: "游戏/创意图像生成平台。" },
    { id: "krea_img", name: "Krea", by: "Krea", note: "实时生成的创意工作台。" },
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
    { id: "mamba", name: "Mamba", note: "线性复杂度处理超长序列。", companyId: "mamba" },
    { id: "jamba", name: "Jamba", by: "AI21", note: "Mamba + Transformer 混合架构。" },
  ],
  lbm: [
    { id: "tesla_lbm", name: "行为大模型", by: "Tesla", note: "把端到端思路用于驾驶决策。" },
    { id: "pi_foundation", name: "Foundation Models", by: "Physical Intelligence", note: "面向机器人的通用动作模型。" },
    { id: "covariant", name: "Covariant", note: "仓储分拣的机器人基础模型。", companyId: "covariant" },
  ],
  world_model: [
    { id: "worldlabs_wm", name: "Large World Model", by: "World Labs", note: "李飞飞：生成可交互 3D 世界。" },
    { id: "genie_wm", name: "Genie", by: "Google", note: "从图像/文本生成可玩的 2D/3D 世界。" },
    { id: "sakana_wm", name: "Sakana 进化模型", by: "Sakana AI", note: "进化式方法做高效模型。" },
  ],
  data_fuel: [
    { id: "scale_platform", name: "Scale 数据引擎", by: "Scale AI", note: "前沿实验室的数据标注与评测平台,被 Meta 重金入股。" },
    { id: "surge_rlhf", name: "Surge RLHF", by: "Surge AI", note: "高质量人类反馈数据,精简盈利、营收居前。" },
    { id: "mercor_experts", name: "Mercor 专家数据", by: "Mercor", note: "请律师/医生/银行家给模型造专业数据。" },
    { id: "turing_agi", name: "Turing AGI 数据", by: "Turing", note: "为 OpenAI/谷歌供代码与推理训练数据。" },
  ],

  /* ---------- 芯片层 ---------- */
  gpu: [
    { id: "blackwell", name: "Blackwell Ultra B300 · Rubin", by: "NVIDIA", note: "当前量产 B300(288GB HBM3e)，Rubin 2026 下半年上量；H100 已两代前。" },
    { id: "mi300", name: "Instinct MI350 / MI400", by: "AMD", note: "性能逼近、价格更友好的挑战者（MI300 已迭代到 MI350/MI400）。" },
    { id: "tpu", name: "TPU", by: "Google", note: "谷歌自研，自家模型专用算力。" },
    { id: "gaudi", name: "Gaudi", by: "Intel", note: "英特尔的 AI 加速器尝试。" },
    { id: "trainium", name: "Trainium", by: "Amazon", note: "AWS 自研 AI 训练芯片。" },
    { id: "mtt_gpu", name: "MTT GPU", by: "摩尔线程", note: "国产全功能 GPU。" },
    { id: "biren_gpu", name: "壁砺 GPU", by: "壁仞科技", note: "国产高端 GPGPU。" },
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
  ai_accel: [
    { id: "groq_lpu", name: "Groq LPU", by: "Groq", note: "超低延迟大模型推理芯片。" },
    { id: "cerebras_wse", name: "Cerebras WSE", by: "Cerebras", note: "晶圆级引擎，世界最大 AI 芯片。" },
    { id: "sambanova_rdu", name: "SambaNova RDU", by: "SambaNova", note: "数据流架构 AI 芯片与一体机。" },
    { id: "graphcore_ipu", name: "Graphcore IPU", by: "Graphcore", note: "智能处理单元，软银旗下。" },
    { id: "tenstorrent_chip", name: "Tenstorrent", by: "Tenstorrent", note: "RISC-V + AI 芯片，Jim Keller 掌舵。" },
    { id: "etched_sohu", name: "Etched Sohu", by: "Etched", note: "把 Transformer 刻进芯片的 ASIC。" },
    { id: "cambricon_chip", name: "思元 MLU", by: "寒武纪", note: "国产 AI 训练/推理芯片龙头。" },
    { id: "hygon_dcu", name: "海光 DCU", by: "海光信息", note: "国产深度计算加速卡。" },
    { id: "ascend", name: "昇腾 Ascend", by: "华为", note: "华为自研 AI 芯片，国产算力核心。" },
    { id: "dojo", name: "Dojo", by: "Tesla", note: "特斯拉自研 AI 训练超算芯片。" },
    { id: "maia", name: "Maia 100", by: "Microsoft", note: "微软自研 AI 加速芯片。" },
    { id: "mtia", name: "MTIA", by: "Meta", note: "Meta 自研推理加速芯片。" },
    { id: "dmatrix_chip", name: "d-Matrix", by: "d-Matrix", note: "存算一体推理芯片。" },
    { id: "positron_chip", name: "Positron", by: "Positron AI", note: "专攻 Transformer 推理的能效芯片。" },
    { id: "rain_chip", name: "Rain AI", by: "Rain AI", note: "类脑神经形态低功耗芯片。" },
  ],
  quantum: [
    { id: "willow_q", name: "Willow 量子芯片", by: "Google", note: "谷歌量子处理器，纠错里程碑。" },
    { id: "ibm_q", name: "IBM Quantum", by: "IBM", note: "超导量子计算机与路线图领跑。" },
    { id: "ionq_q", name: "IonQ 离子阱", by: "IonQ", note: "离子阱量子计算领跑上市公司。" },
    { id: "rigetti_q", name: "Rigetti 超导", by: "Rigetti", note: "超导量子处理器与量子云。" },
    { id: "dwave_q", name: "D-Wave 退火", by: "D-Wave", note: "量子退火，主攻优化问题。" },
    { id: "quantinuum_q", name: "Quantinuum", by: "Quantinuum", note: "霍尼韦尔系离子阱，综合实力强。" },
    { id: "psiquantum_q", name: "PsiQuantum 光子", by: "PsiQuantum", note: "硅光子容错量子，冲百万量子比特。" },
  ],
  av_chip: [
    { id: "nvidia_drive", name: "NVIDIA DRIVE Thor", by: "NVIDIA", note: "车规智能驾驶 AI 芯片。" },
    { id: "horizon_journey", name: "征程芯片", by: "地平线", note: "中国车规智驾芯片龙头。" },
    { id: "mobileye_eyeq", name: "EyeQ 芯片", by: "Mobileye", note: "老牌自动驾驶视觉芯片。" },
    { id: "hesai_lidar", name: "禾赛激光雷达", by: "禾赛科技", note: "全球车载激光雷达出货龙头。" },
    { id: "luminar_lidar", name: "Luminar 激光雷达", by: "Luminar", note: "美国高性能车载激光雷达。" },
    { id: "ouster_lidar", name: "Ouster 激光雷达", by: "Ouster", note: "数字激光雷达。" },
  ],
  foundry: [
    { id: "tsmc_foundry", name: "3nm / 2nm 制程", by: "TSMC", note: "最先进制程，英伟达/苹果都靠它代工。" },
    { id: "samsung_foundry", name: "三星代工", by: "Samsung", note: "先进制程的另一选择。" },
    { id: "intel_foundry", name: "Intel Foundry", by: "Intel", note: "力图重回先进制程第一梯队。" },
    { id: "umc_foundry", name: "成熟制程代工", by: "联电", note: "全球第三大晶圆代工厂。" },
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
  asic_design: [
    { id: "alchip_asic", name: "AI ASIC 设计", by: "世芯电子", note: "高端 AI ASIC 设计服务龙头。" },
    { id: "guc_asic", name: "ASIC 设计服务", by: "创意电子", note: "台积电体系 ASIC 设计。" },
    { id: "faraday_asic", name: "ASIC / IP", by: "智原科技", note: "联电体系设计服务与 IP。" },
    { id: "andes_ip", name: "RISC-V CPU IP", by: "晶心科技", note: "全球领先 RISC-V 处理器 IP。" },
    { id: "ememory_ip", name: "嵌入式存储 IP", by: "力旺电子", note: "嵌入式 NVM/安全 IP 龙头。" },
  ],

  /* ---------- 材料层（最上游原料） ---------- */
  silicon_wafer: [
    { id: "shinetsu_wafer", name: "半导体硅片", by: "信越化学", note: "全球最大硅片厂，芯片的地基。" },
    { id: "sumco_wafer", name: "300mm 硅片", by: "SUMCO", note: "全球第二大硅片厂。" },
    { id: "gwafers_wafer", name: "半导体硅片", by: "环球晶圆", note: "台湾硅片龙头，全球第三。" },
  ],
  photoresist: [
    { id: "jsr_pr", name: "EUV 光刻胶", by: "JSR", note: "先进制程光刻胶龙头。" },
    { id: "tok_pr", name: "光刻胶", by: "Tokyo Ohka", note: "EUV 光刻胶市占领先。" },
    { id: "shinetsu_pr", name: "光刻胶材料", by: "信越化学", note: "光刻胶与掩膜材料。" },
  ],
  e_gases: [
    { id: "linde_gas", name: "电子特气", by: "Linde", note: "全球最大电子特气供应商。" },
    { id: "airliquide_gas", name: "电子特气", by: "Air Liquide", note: "法国工业气体巨头。" },
  ],
  substrate: [
    { id: "ibiden_sub", name: "ABF 封装载板", by: "Ibiden", note: "高端载板龙头，供英伟达/英特尔。" },
    { id: "unimicron_sub", name: "IC 载板", by: "Unimicron", note: "台湾封装载板与 PCB 龙头。" },
  ],
  cmp_mat: [
    { id: "entegris_cmp", name: "CMP / 纯净材料", by: "Entegris", note: "抛光液、过滤与流体输送耗材。" },
    { id: "cabot_cmp", name: "CMP 抛光材料", by: "Cabot", note: "抛光液与抛光垫龙头。" },
  ],
  rare_earth: [
    { id: "mp_re", name: "稀土 + 永磁", by: "MP Materials", note: "美国唯一稀土矿，永磁国产化关键。" },
    { id: "lynas_re", name: "稀土分离", by: "Lynas", note: "中国以外最大稀土生产商。" },
    { id: "jlmag_magnet", name: "钕铁硼永磁", by: "金力永磁", note: "机器人伺服电机的磁芯。" },
  ],
  copper: [
    { id: "fcx_cu", name: "铜矿", by: "Freeport-McMoRan", note: "全球最大上市铜矿商之一。" },
    { id: "scco_cu", name: "铜矿冶炼", by: "Southern Copper", note: "储量最大的铜矿公司之一。" },
  ],
  sic_gan: [
    { id: "wolfspeed_sic", name: "碳化硅 SiC", by: "Wolfspeed", note: "SiC 功率半导体龙头。" },
    { id: "ifx_power", name: "功率器件 SiC/GaN", by: "Infineon", note: "全球功率半导体龙头。" },
  ],

  /* ---------- 基础设施层 ---------- */
  nvlink: [
    { id: "nvlink_p", name: "NVLink / NVSwitch", by: "NVIDIA", note: "GPU 之间的「高速公路」，护城河之一。" },
    { id: "ualink_p", name: "UALink 联盟", note: "AMD/谷歌等联手挑战 NVLink 的开放标准。", companyId: "ualink" },
  ],
  network: [
    { id: "tomahawk", name: "Tomahawk 交换芯片", by: "Broadcom", note: "数据中心交换的核心芯片。" },
    { id: "arista_sw", name: "数据中心交换机", by: "Arista", note: "AI 集群组网的领导者。" },
    { id: "infiniband", name: "InfiniBand / Spectrum-X", by: "NVIDIA", note: "高性能 AI 网络方案。" },
    { id: "accton_switch", name: "白牌交换机", by: "智邦科技", note: "为云厂代工 800G 白牌交换机。" },
  ],
  /* ---------- 存储层（独立大类，按类型细分） ---------- */
  hbm_mem: [
    { id: "hbm", name: "HBM（SK 海力士）", by: "SK Hynix", note: "HBM 份额领先，英伟达核心供应商。" },
    { id: "samsung_hbm", name: "HBM（三星）", by: "三星电子", note: "三星的 HBM，全力追赶份额。" },
    { id: "micron_hbm", name: "HBM（美光）", by: "Micron", note: "美系唯一 HBM 供应商，导入英伟达。" },
  ],
  dram_mem: [
    { id: "server_dram", name: "服务器 DRAM / DDR5", by: "SK Hynix", note: "AI 服务器的大容量主内存。" },
    { id: "samsung_dram", name: "DRAM（三星）", by: "三星电子", note: "全球 DRAM 龙头。" },
    { id: "micron_dram", name: "DRAM（美光）", by: "Micron", note: "美系存储大厂的主内存。" },
    { id: "nanya_dram", name: "DRAM（南亚科）", by: "南亚科技", note: "台湾 DRAM 内存厂。" },
  ],
  nand_ssd: [
    { id: "ent_ssd", name: "企业级 SSD", by: "三星电子", note: "高吞吐固态盘，喂数据给 GPU。" },
    { id: "kioxia_nand", name: "NAND 闪存", by: "铠侠", note: "NAND 闪存发明者，原东芝存储。" },
    { id: "micron_nand", name: "NAND / SSD", by: "Micron", note: "美光的闪存与企业级 SSD。" },
    { id: "pure_flash", name: "全闪存阵列", by: "Pure Storage", note: "高吞吐，喂饱 GPU 训练。" },
  ],
  hdd_stor: [
    { id: "wd_storage", name: "机械硬盘 HDD", by: "Western Digital", note: "海量冷数据的低成本仓库。" },
    { id: "seagate_hdd", name: "大容量 HDD", by: "Seagate", note: "HAMR 新技术，AI 数据湖底座。" },
  ],
  cxl_mem: [
    { id: "cxl_module", name: "CXL 内存扩展", by: "Micron", note: "给服务器扩内存池，缓解内存墙。" },
    { id: "samsung_cxl", name: "CXL 内存", by: "三星电子", note: "CXL 内存模组先行者。" },
  ],
  ent_storage: [
    { id: "vast_data", name: "VAST Data 平台", by: "VAST Data", note: "为 AI 打造的高性能数据平台。" },
    { id: "pure_sys", name: "全闪存存储系统", by: "Pure Storage", note: "面向 AI 的高吞吐存储系统。" },
    { id: "wd_ent", name: "企业存储", by: "Western Digital", note: "海量训练数据的仓库。" },
  ],
  neocloud: [
    { id: "coreweave_cloud", name: "CoreWeave", by: "CoreWeave", note: "最大的 AI 专属 GPU 云。" },
    { id: "lambda_cloud", name: "Lambda", by: "Lambda", note: "面向研究者的 GPU 云与工作站。" },
    { id: "crusoe_cloud", name: "Crusoe", by: "Crusoe", note: "低碳能源驱动的 AI 数据中心。" },
    { id: "nebius_cloud", name: "Nebius", by: "Nebius", note: "源自 Yandex 的欧洲 AI 云。" },
    { id: "together_cloud", name: "Together AI", by: "Together AI", note: "开源模型推理/训练云。" },
    { id: "fireworks_cloud", name: "Fireworks", by: "Fireworks AI", note: "极速开源模型推理平台。" },
    { id: "oracle_oci", name: "Oracle OCI", by: "Oracle", note: "甲骨文 AI 云，拿下 OpenAI 超大算力订单。" },
  ],
  depin: [
    { id: "ionet_gpu", name: "io.net", by: "io.net", note: "去中心化 GPU 算力网络。" },
    { id: "render_net", name: "Render Network", by: "Render Network", note: "去中心化 GPU 渲染/算力。" },
    { id: "akash_net", name: "Akash", by: "Akash", note: "去中心化云算力市场。" },
    { id: "bittensor_net", name: "Bittensor", by: "Bittensor", note: "去中心化机器学习网络。" },
  ],
  ai_datacenter: [
    { id: "equinix_dc", name: "Equinix 数据中心", by: "Equinix", note: "全球最大互联数据中心 REIT。" },
    { id: "dlr_dc", name: "Digital Realty", by: "Digital Realty", note: "全球最大数据中心 REIT 之一。" },
    { id: "gds_dc", name: "万国数据中心", by: "万国数据", note: "中国头部第三方数据中心。" },
    { id: "irm_dc", name: "Iron Mountain DC", by: "Iron Mountain", note: "信息管理巨头转型数据中心。" },
    { id: "stargate_dc", name: "星际之门 Stargate", by: "Oracle", note: "OpenAI/甲骨文/软银的超级数据中心。" },
  ],
  ai_server: [
    { id: "smci_server", name: "超微 AI 服务器", by: "Supermicro", note: "GPU 整机与液冷机柜，出货最激进。" },
    { id: "dell_server", name: "戴尔 PowerEdge", by: "Dell", note: "为 xAI 等供大规模 AI 集群整机。" },
    { id: "hpe_server", name: "HPE AI 服务器", by: "HPE", note: "企业 AI 整机与超算。" },
    { id: "fii_server", name: "工业富联 GB200 机柜", by: "工业富联", note: "GB200 机柜主力组装方。" },
    { id: "quanta_server", name: "广达 AI 服务器", by: "广达", note: "英伟达 AI 服务器核心组装厂。" },
    { id: "wiwynn_server", name: "纬颖云服务器", by: "纬颖", note: "为超大规模云厂定制 AI 服务器。" },
    { id: "wistron_server", name: "纬创 AI 服务器", by: "纬创", note: "GB200 供应链核心之一。" },
    { id: "inventec_server", name: "英业达 AI 服务器", by: "英业达", note: "AI 服务器与笔电代工大厂。" },
    { id: "gigabyte_server", name: "技嘉 GPU 服务器", by: "技嘉", note: "GPU 服务器与主板品牌厂。" },
    { id: "pegatron_server", name: "和硕 AI 服务器", by: "和硕", note: "扩大 AI 服务器与网通布局。" },
    { id: "asus_server", name: "华硕 AI 服务器", by: "华硕", note: "GB200 整机柜 + 自建 AI 云。" },
  ],
  connector: [
    { id: "amphenol_conn", name: "高速连接器 / 铜缆", by: "Amphenol", note: "GB200 机柜铜缆互联最大受益者。" },
    { id: "te_conn", name: "连接器 / 互连", by: "TE Connectivity", note: "全球连接器与传感器巨头。" },
    { id: "astera_conn", name: "重定时器 / CXL", by: "Astera Labs", note: "GPU 集群高速互联芯片新贵。" },
    { id: "credo_aec", name: "有源电缆 AEC", by: "Credo", note: "有源电缆与 SerDes 连接方案。" },
  ],
  pcb: [
    { id: "wus_pcb", name: "高多层 PCB", by: "沪电股份", note: "英伟达链核心 PCB 供应商。" },
    { id: "victory_pcb", name: "GPU 板卡 PCB", by: "胜宏科技", note: "深度绑定英伟达 GPU 板卡。" },
    { id: "ttm_pcb", name: "高端 PCB", by: "TTM", note: "北美最大 PCB 制造商。" },
    { id: "zhending_pcb", name: "高阶 PCB / 软板", by: "臻鼎科技", note: "全球最大 PCB 厂（鸿海系）。" },
  ],
  ai_infra_sw: [
    { id: "hf_hub", name: "Hugging Face", by: "Hugging Face", note: "开源模型社区，AI 界的 GitHub。" },
    { id: "databricks_pl", name: "Databricks", by: "Databricks", note: "数据 + AI 一体化湖仓平台。" },
    { id: "snowflake_ai", name: "Snowflake Cortex", by: "Snowflake", note: "在数据云上直接跑 AI。" },
    { id: "pinecone_vdb", name: "Pinecone", by: "Pinecone", note: "最流行的向量数据库，RAG 标配。" },
    { id: "weaviate_vdb", name: "Weaviate", by: "Weaviate", note: "开源向量数据库。" },
    { id: "chroma_vdb", name: "Chroma", by: "Chroma", note: "开发者友好的开源向量库。" },
    { id: "langchain_fw", name: "LangChain", by: "LangChain", note: "大模型应用编排框架。" },
    { id: "llamaindex_fw", name: "LlamaIndex", by: "LlamaIndex", note: "面向 RAG 的数据编排框架。" },
    { id: "scale_data", name: "Scale AI", by: "Scale AI", note: "AI 训练数据标注与评测龙头。" },
    { id: "surge_data", name: "Surge AI", by: "Surge AI", note: "高质量 RLHF 数据标注。" },
    { id: "mercor_data", name: "Mercor", by: "Mercor", note: "用 AI 匹配专家供高质量数据。" },
    { id: "turing_data", name: "Turing", by: "Turing", note: "代码/推理训练数据与工程人才。" },
    { id: "qdrant_vdb", name: "Qdrant", by: "Qdrant", note: "高性能开源向量数据库。" },
    { id: "milvus_vdb", name: "Milvus / Zilliz", by: "Zilliz", note: "开源向量库 Milvus 的商业化。" },
    { id: "modal_infra", name: "Modal", by: "Modal", note: "面向 AI 的无服务器计算平台。" },
    { id: "baseten_deploy", name: "Baseten", by: "Baseten", note: "模型部署与推理平台。" },
    { id: "replicate_host", name: "Replicate", by: "Replicate", note: "一行代码调用开源模型。" },
    { id: "anyscale_ray", name: "Anyscale / Ray", by: "Anyscale", note: "大规模分布式训练/推理框架。" },
    { id: "wandb_mlops", name: "Weights & Biases", by: "Weights & Biases", note: "AI 实验跟踪与 MLOps。" },
  ],
  /* ---------- 光通信层：上游·光芯片 ---------- */
  opt_chip: [
    { id: "lumentum_eml", name: "EML 激光芯片", by: "Lumentum", note: "【上游】1.6T 模块关键 EML，独家量产 200G/lane。" },
    { id: "coherent_optic", name: "光器件 / 激光", by: "Coherent", note: "【上游】激光与光电子器件，英伟达入股。" },
    { id: "avgo_optical_dsp", name: "光 DSP 芯片", by: "Broadcom", note: "【上游】800G/1.6T 模块的 DSP，市占领先。" },
    { id: "mrvl_optical", name: "光 DSP / 互联", by: "Marvell", note: "【上游·DSP】光 DSP 双雄之一，覆盖光互联全栈。" },
    { id: "macom_chip", name: "激光驱动 / TIA", by: "MACOM", note: "【上游·器件】激光驱动器与跨阻放大器(TIA)。" },
    { id: "semtech_cdr", name: "CDR / PMD 芯片", by: "Semtech", note: "【上游·信号】时钟恢复与信号调理芯片。" },
    { id: "yuanjie_laser", name: "DFB / EML 激光芯片", by: "源杰科技", note: "【上游】国产高速激光器芯片代表。" },
    { id: "tianfu_comp", name: "光器件配套", by: "天孚通信", note: "【上游】陶瓷套管/光引擎等配套，光模块卖铲人。" },
    { id: "lightmatter_photonic", name: "Passage 光互联", by: "Lightmatter", note: "【上游】光子芯片间高带宽互联。" },
    { id: "ayar_io", name: "光 I/O (CPO)", by: "Ayar Labs", note: "【上游】共封装光学，光 I/O 集成进封装。" },
    { id: "celestial_fabric", name: "Photonic Fabric", by: "Celestial AI", note: "【上游】光互联扩展内存与算力带宽。" },
  ],
  /* ---------- 光通信层：中游·光模块 ---------- */
  opt_module: [
    { id: "innolight_optic", name: "光模块", by: "中际旭创 Innolight", note: "【中游】全球高速光模块出货龙头。" },
    { id: "aaoi_module", name: "800G/1.6T 收发模块", by: "Applied Optoelectronics", note: "【中游】2026 放量、拿下 1.6T 大单的大牛股。" },
    { id: "coherent_module", name: "光模块", by: "Coherent", note: "【中游】上游器件 + 中游模块一体化(原 II-VI)。" },
    { id: "fabrinet", name: "光模块代工", by: "Fabrinet", note: "【中游·代工】给 Lumentum/Cisco 等代工模块。" },
    { id: "eoptolink_optic", name: "800G/1.6T 光模块", by: "新易盛", note: "【中游】高速光模块黑马，毛利率行业领先。" },
    { id: "accelink_mod", name: "光模块 / 光器件", by: "光迅科技", note: "【中游】国产光通信全产业链骨干。" },
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
    { id: "nvent_cool", name: "液冷 / 电气连接", by: "nVent", note: "数据中心液冷与电气连接方案。" },
    { id: "avc_cool", name: "散热模组 / 液冷", by: "奇鋐科技", note: "GB200 液冷供应链核心。" },
    { id: "auras_cool", name: "液冷冷板 / 歧管", by: "双鸿科技", note: "AI 服务器散热模组。" },
  ],
  power: [
    { id: "vertiv_power", name: "电源 / 供配电", by: "Vertiv", note: "数据中心供电的核心供应商。" },
    { id: "eaton_power", name: "电力管理", by: "Eaton", note: "AI 扩张的「卖水人」。" },
    { id: "schneider_power", name: "施耐德电气", by: "Schneider", note: "能源管理与配电巨头。" },
  ],
  power_supply: [
    { id: "delta_psu", name: "服务器电源", by: "台达电子", note: "AI 服务器高功率电源龙头。" },
    { id: "mpwr_pmic", name: "电源管理芯片", by: "Monolithic Power", note: "为 GPU 供电的 PMIC 关键芯片。" },
    { id: "vicor_psu", name: "高密度电源模块", by: "Vicor", note: "靠近 GPU 的末端供电模块。" },
    { id: "liteon_psu", name: "服务器电源", by: "光宝科技", note: "云端服务器电源大厂。" },
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
    { id: "talen_nuke", name: "核电直供数据中心", by: "Talen Energy", note: "【核电】Susquehanna 核电直供亚马逊。" },
    { id: "terrapower_smr", name: "Natrium 快堆", by: "TerraPower", note: "【SMR】盖茨押注的钠冷快堆。" },
    { id: "xenergy_smr", name: "Xe-100 气冷堆", by: "X-energy", note: "【SMR】亚马逊押注的高温气冷小堆。" },
    { id: "kairos_smr", name: "熔盐堆 KP-FHR", by: "Kairos Power", note: "【SMR】谷歌签约的氟盐冷却堆。" },
  ],
  fusion: [
    { id: "helion_fusion", name: "Helion 聚变", by: "Helion", note: "微软已签全球首份聚变购电协议。" },
    { id: "cfs_fusion", name: "SPARC 托卡马克", by: "Commonwealth Fusion", note: "MIT 分拆，高温超导磁体路线领跑。" },
    { id: "tae_fusion", name: "TAE 场反位形", by: "TAE", note: "老牌聚变公司，融资规模居前。" },
  ],
  uranium: [
    { id: "cameco_u", name: "铀矿 / 核燃料", by: "Cameco", note: "全球最大铀矿商之一。" },
    { id: "centrus_leu", name: "HALEU 铀浓缩", by: "Centrus Energy", note: "美国唯一 HALEU 高丰度铀供应。" },
    { id: "nano_u", name: "微堆 + 燃料运输", by: "Nano Nuclear", note: "微型反应堆与核燃料运输新锐。" },
  ],
  fuelcell: [
    { id: "bloom_fc", name: "Bloom 燃料电池", by: "Bloom Energy", note: "就地发电直供数据中心，绕开电网。" },
    { id: "plug_fc", name: "氢燃料电池", by: "Plug Power", note: "氢能燃料电池与绿氢。" },
  ],
  transformer: [
    { id: "hitachi_transformer", name: "变压器 / HVDC", by: "Hitachi Energy", note: "全球变压器龙头，AI 用电下一柜难求。" },
    { id: "siemens_grid", name: "电网 / 输配电设备", by: "Siemens Energy", note: "燃气轮机 + 输配电，订单大增。" },
    { id: "powell_switchgear", name: "配电 / 开关柜", by: "Powell", note: "数据中心供配电直接受益股。" },
    { id: "quanta_grid", name: "电网工程建设", by: "Quanta Services", note: "北美最大电网建设商。" },
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
  sat_ai: [
    { id: "planet_ai", name: "Planet 遥感 AI", by: "Planet Labs", note: "每日全球成像 + AI 影像解译。" },
    { id: "blacksky_ai", name: "BlackSky", by: "BlackSky", note: "高频成像 + AI 地理情报。" },
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

/** 把一组「互为竞品」的产品展开成两两相连的竞品关系边。 */
function rivalGroup(ids: string[], label = "竞品"): [string, string, string][] {
  const out: [string, string, string][] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) out.push([ids[i], ids[j], label]);
  }
  return out;
}

/** 各细分赛道里「同台竞争」的产品分组（同城/同环节 → 价值链里落在「同行」一侧）。 */
const RIVALS: [string, string, string][] = [
  // 应用层
  ...rivalGroup(["chatgpt", "claude_app", "gemini_app", "copilot", "grok", "perplexity", "meta_ai", "deepseek_app", "qianwen", "character_chat", "inflection_pi", "hailuo_chat", "spark_chat", "zhipu_chat", "poe_chat"]),
  ...rivalGroup(["github_copilot", "cursor", "windsurf", "replit_agent", "amazon_q", "devin", "tabnine_ai", "v0", "magic_code", "poolside_code", "bolt", "lovable_code", "augment_code", "cody_code"]),
  ...rivalGroup(["anduril_lattice", "palantir_gotham", "helsing_ai", "shield_hivemind", "saronic_usv"]),
  ...rivalGroup(["neuralink_bci", "synchron_bci", "precision_bci", "paradromics_bci"]),
  ...rivalGroup(["inworld_npc", "scenario_assets"]),
  ...rivalGroup(["notion_ai", "grammarly_ai", "deepl_tr", "moveworks_ai"]),
  ...rivalGroup(["worldlabs_wm", "genie_wm", "sakana_wm"]),
  ...rivalGroup(["lindy_agent", "multion_agent", "manus_agent", "operator", "genspark_agent", "adept_agent"]),
  ...rivalGroup(["ionet_gpu", "render_net", "akash_net", "bittensor_net"]),
  ...rivalGroup(["m365_copilot", "agentforce", "now_assist", "aip", "glean", "writer_ai", "sierra_agent", "decagon_agent", "harvey_ai", "hebbia_ai", "ibm_watson"]),
  ...rivalGroup(["waymo", "fsd", "zoox", "cruise", "ponyai", "weride", "apollo_go", "mobileye_adas", "aurora_driver", "wayve_ad", "nuro_driver", "momenta_ad", "waabi_ad", "applied_sim"]),
  ...rivalGroup(["optimus", "atlas_robot", "figure02", "neo", "agility_digit", "apptronik_apollo", "unitree_g1", "phoenix_robot", "fourier_gr", "walker_robot", "agibot_robot", "galbot_robot", "robotera_star", "engineai_robot", "dexterity_robot", "cobot_robot"]),
  ...rivalGroup(["alphafold", "isomorphic", "recursion", "insilico", "xaira_dd", "esm3"]),
  ...rivalGroup(["abridge_scribe", "openevidence_search", "tempus_ai", "hippocratic_agent"]),
  ...rivalGroup(["canva_ai", "figma_ai", "firefly_design"]),
  ...rivalGroup(["apple_intelligence", "snapdragon_ai", "dimensity_ai", "copilot_pc"]),
  ...rivalGroup(["applovin_ax", "tradedesk_ad", "meta_ads"]),
  ...rivalGroup(["willow_q", "ibm_q", "ionq_q", "rigetti_q", "dwave_q", "quantinuum_q", "psiquantum_q"]),
  ...rivalGroup(["bloomberg_gpt", "aladdin_ai"]),
  ...rivalGroup(["duolingo_max", "khanmigo", "speak_tutor"]),
  ...rivalGroup(["cresta_cx", "retell_voice", "vapi_voice"]),
  ...rivalGroup(["deepgram_stt", "assemblyai_stt"]),
  ...rivalGroup(["abridge_scribe", "nabla_scribe", "suki_voice"]),
  ...rivalGroup(["crowdstrike_ai", "paloalto_ai", "sentinelone_ai", "zscaler_ai", "wiz_sec"]),
  ...rivalGroup(["planet_ai", "blacksky_ai"]),
  ...rivalGroup(["nvidia_drive", "horizon_journey", "mobileye_eyeq"]),
  ...rivalGroup(["hesai_lidar", "luminar_lidar", "ouster_lidar"]),
  ...rivalGroup(["equinix_dc", "dlr_dc", "gds_dc", "irm_dc"]),
  ...rivalGroup(["smci_server", "dell_server", "hpe_server", "fii_server", "quanta_server", "wiwynn_server"]),
  ...rivalGroup(["amphenol_conn", "te_conn", "astera_conn", "credo_aec"]),
  ...rivalGroup(["wus_pcb", "victory_pcb", "ttm_pcb", "zhending_pcb"]),
  ...rivalGroup(["delta_psu", "mpwr_pmic", "vicor_psu", "liteon_psu"]),
  ...rivalGroup(["manus_agent", "operator", "genspark_agent", "adept_agent"]),
  ...rivalGroup(["leader_harmonic", "sanhua_actuator", "topu_screw", "inovance_motor"]),
  // 生成式媒体 / AI 搜索
  ...rivalGroup(["runway_gen", "pika_v", "luma_dream", "hailuo_video", "kling_video"]),
  ...rivalGroup(["suno_m", "udio_m"]),
  ...rivalGroup(["heygen_v", "synthesia_v"]),
  ...rivalGroup(["pplx_search", "searchgpt", "ai_overviews", "grok_search"]),
  // 模型层
  ...rivalGroup(["gpt4", "claude35", "gemini_llm", "llama", "grok_llm", "mistral_large", "deepseek_v3", "qwen", "ernie", "command_r", "dbrx", "reka_core", "yi_model", "nova_model", "phi_model", "glm", "step_model", "sensenova", "minimax_m", "falcon", "nemotron", "granite", "aleph_model", "ssi_model", "tml_model"]),
  ...rivalGroup(["gpt4v", "gemini_vlm", "claude_vlm", "llama_vlm", "llava"]),
  ...rivalGroup(["sora", "midjourney", "stable_diffusion", "imagen", "firefly", "ideogram_img", "flux_img", "recraft_img", "leonardo_img", "krea_img"]),
  ...rivalGroup(["runway_gen", "genmo_video", "higgsfield_video"]),
  ...rivalGroup(["elevenlabs_v", "playht_voice", "cartesia_voice"]),
  ...rivalGroup(["rt2", "openvla", "helix", "pi0"]),
  // AI 加速芯片 / GPU / AI 云 / 开发框架
  ...rivalGroup(["groq_lpu", "cerebras_wse", "sambanova_rdu", "graphcore_ipu", "tenstorrent_chip", "etched_sohu", "cambricon_chip", "hygon_dcu", "ascend", "dojo", "maia", "mtia", "dmatrix_chip", "positron_chip", "rain_chip"]),
  ...rivalGroup(["blackwell", "mi300", "tpu", "gaudi", "trainium", "mtt_gpu", "biren_gpu"]),
  ...rivalGroup(["coreweave_cloud", "lambda_cloud", "crusoe_cloud", "nebius_cloud", "together_cloud", "fireworks_cloud", "oracle_oci"]),
  ...rivalGroup(["pinecone_vdb", "weaviate_vdb", "chroma_vdb", "qdrant_vdb", "milvus_vdb"]),
  ...rivalGroup(["scale_data", "surge_data", "mercor_data", "turing_data"]),
  ...rivalGroup(["langchain_fw", "llamaindex_fw"]),
  ...rivalGroup(["scale_data", "surge_data"]),
  ...rivalGroup(["hf_hub", "databricks_pl", "snowflake_ai"]),
  ...rivalGroup(["modal_infra", "baseten_deploy", "replicate_host", "anyscale_ray"]),
  ...rivalGroup(["lightmatter_photonic", "ayar_io", "celestial_fabric"]),
  // 存储层
  ...rivalGroup(["hbm", "samsung_hbm", "micron_hbm"]),
  ...rivalGroup(["server_dram", "samsung_dram", "micron_dram", "nanya_dram"]),
  ...rivalGroup(["ent_ssd", "kioxia_nand", "micron_nand", "pure_flash"]),
  ...rivalGroup(["wd_storage", "seagate_hdd"]),
  ...rivalGroup(["cxl_module", "samsung_cxl"]),
  ...rivalGroup(["vast_data", "pure_sys", "wd_ent"]),
  // 芯片层
  ...rivalGroup(["blackwell", "mi300", "tpu", "gaudi", "trainium"]),
  ...rivalGroup(["xeon", "epyc", "grace"]),
  ...rivalGroup(["tsmc_foundry", "samsung_foundry", "intel_foundry", "umc_foundry"]),
  ...rivalGroup(["alchip_asic", "guc_asic", "faraday_asic"]),
  ...rivalGroup(["wistron_server", "inventec_server", "gigabyte_server", "pegatron_server", "asus_server"]),
  ...rivalGroup(["avc_cool", "auras_cool"]),
  ...rivalGroup(["amat_eq", "lam_eq", "kla_eq"]),
  ...rivalGroup(["synopsys", "cadence"]),
  ...rivalGroup(["ase_pkg", "amkr_pkg"]),
  // 基础设施 / 存储 / 光通信
  ...rivalGroup(["hbm", "micron_hbm"]),
  ...rivalGroup(["innolight_optic", "aaoi_module", "coherent_module", "fabrinet", "eoptolink_optic", "accelink_mod"]),
  ...rivalGroup(["lumentum_eml", "yuanjie_laser"]),
  ...rivalGroup(["avgo_optical_dsp", "mrvl_optical"]),
  ...rivalGroup(["ciena_net", "nokia_net", "cisco_net", "juniper_net", "ericsson_net", "arista_opt"]),
  // 能源层
  ...rivalGroup(["oklo_smr", "nuscale_smr", "terrapower_smr", "xenergy_smr", "kairos_smr"]),
  ...rivalGroup(["ceg_nuke", "vst_nuke", "talen_nuke"]),
  ...rivalGroup(["helion_fusion", "cfs_fusion", "tae_fusion"]),
  ...rivalGroup(["cameco_u", "centrus_leu", "nano_u"]),
  ...rivalGroup(["bloom_fc", "plug_fc"]),
  ...rivalGroup(["hitachi_transformer", "siemens_grid", "powell_switchgear", "quanta_grid"]),
  ...rivalGroup(["vertiv_power", "eaton_power", "schneider_power"]),
  ...rivalGroup(["vertiv_cooling", "schneider_cooling", "nvent_cool"]),
  ...rivalGroup(["gev_gas", "cat_genset", "cmi_power", "nee_renew"]),
  // 太空层
  ...rivalGroup(["starlink", "ast_sat", "kuiper"]),
  ...rivalGroup(["starship", "neutron"]),
  // 材料层
  ...rivalGroup(["shinetsu_wafer", "sumco_wafer", "gwafers_wafer"]),
  ...rivalGroup(["jsr_pr", "tok_pr", "shinetsu_pr"]),
  ...rivalGroup(["linde_gas", "airliquide_gas"]),
  ...rivalGroup(["ibiden_sub", "unimicron_sub"]),
  ...rivalGroup(["entegris_cmp", "cabot_cmp"]),
  ...rivalGroup(["mp_re", "lynas_re", "jlmag_magnet"]),
  ...rivalGroup(["fcx_cu", "scco_cu"]),
  ...rivalGroup(["wolfspeed_sic", "ifx_power"]),
];

/** [产品A, 产品B, 关系标签]，无向。 */
export const LINKS: [string, string, string][] = [
  ...RIVALS,
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

  /* ============================================================
   * 上下游「加厚」：让每个产品都连到它的上游(依赖)与下游(使用者)
   * ============================================================ */

  /* 应用 → 所用大模型（下游应用依赖上游模型） */
  ["perplexity", "gpt4", "由大模型驱动"],
  ["perplexity", "claude35", "可调用Claude"],
  ["meta_ai", "llama", "由Llama驱动"],
  ["grok", "grok_llm", "运行于Grok"],
  ["agentforce", "gpt4", "接入GPT"],
  ["agentforce", "claude35", "接入Claude"],
  ["now_assist", "gpt4", "由大模型驱动"],
  ["aip", "gpt4", "接入大模型"],
  ["aip", "claude35", "接入Claude"],
  ["copilot", "gpt4v", "多模态能力"],
  ["m365_copilot", "gpt4v", "读图能力"],

  /* 机器人本体 → 大脑(VLA) */
  ["optimus", "groot", "仿真训练"],
  ["figure02", "helix", "自研VLA"],
  ["neo", "openvla", "开源VLA参考"],
  ["unitree_g1", "openvla", "开源VLA大脑"],
  ["unitree_g1", "jetson_robot", "计算芯片"],
  ["unitree_g1", "harmonic_drive", "谐波减速器"],
  ["apptronik_apollo", "harmonic_drive", "谐波减速器"],
  ["neo", "harmonic_drive", "谐波减速器"],

  /* 自动驾驶 → 车端算力 / 动作模型 */
  ["zoox", "blackwell", "车端算力"],
  ["cruise", "blackwell", "车端算力"],
  ["apollo_go", "blackwell", "车端算力"],
  ["waymo", "rt2", "VLA研究"],

  /* 科研 / 生物 应用 → 算力 */
  ["alphafold", "tpu", "TPU算力"],
  ["isomorphic", "tpu", "TPU算力"],
  ["graphcast", "tpu", "TPU算力"],
  ["earth2", "blackwell", "GPU算力"],
  ["ai4science", "blackwell", "GPU算力"],
  ["alphafold_sci", "tpu", "TPU算力"],
  ["omniverse", "blackwell", "GPU算力"],

  /* 模型 → GPU 算力（补齐所有模型） */
  ["grok_llm", "blackwell", "算力(Colossus)"],
  ["mistral_large", "blackwell", "算力"],
  ["ernie", "blackwell", "算力"],
  ["gpt4v", "blackwell", "算力"],
  ["gemini_vlm", "tpu", "算力"],
  ["claude_vlm", "blackwell", "算力"],
  ["llama_vlm", "blackwell", "算力"],
  ["gpt4o_mm", "blackwell", "算力"],
  ["gemini_mm", "tpu", "算力"],
  ["imagen", "tpu", "算力"],
  ["firefly", "blackwell", "算力"],
  ["rt2", "tpu", "算力"],
  ["openvla", "blackwell", "算力"],
  ["helix", "blackwell", "算力"],
  ["pi0", "blackwell", "算力"],
  ["switch_tf", "tpu", "算力"],
  ["gpt_moe", "blackwell", "算力"],
  ["gpt_series", "blackwell", "算力"],
  ["transformer", "tpu", "谷歌原创"],

  /* GPU / 加速器 → 代工 / 显存 / 互联（补齐所有芯片） */
  ["tpu", "tsmc_foundry", "代工制造"],
  ["tpu", "hbm", "HBM显存"],
  ["tpu", "avgo_optical_dsp", "博通协同设计"],
  ["gaudi", "tsmc_foundry", "代工制造"],
  ["gaudi", "hbm", "HBM显存"],
  ["trainium", "tsmc_foundry", "代工制造"],
  ["trainium", "hbm", "HBM显存"],
  ["trainium", "micron_hbm", "HBM显存"],
  ["mi300", "nvlink_p", "对标NVLink"],
  ["mi300", "ualink_p", "主推UALink"],
  ["mi300", "infiniband", "集群组网"],
  ["mi300", "vertiv_cooling", "液冷散热"],
  ["mi300", "vertiv_power", "供电"],

  /* CPU → 代工 */
  ["xeon", "intel_foundry", "自家制造"],
  ["epyc", "tsmc_foundry", "代工制造"],
  ["grace", "tsmc_foundry", "代工制造"],
  ["epyc", "hbm", "服务器内存"],

  /* ARM 架构（IP 授权）：下游被授权的芯片 ← ARM；上游用 EDA 设计 */
  ["grace", "arm_arch", "基于ARM架构"],
  ["bluefield", "arm_arch", "内置Arm核"],
  ["nitro", "arm_arch", "基于Arm核"],
  ["marvell_dpu", "arm_arch", "Arm定制核"],
  ["trainium", "arm_arch", "Arm生态"],
  ["jetson_robot", "arm_arch", "Arm CPU核"],
  ["arm_arch", "synopsys", "EDA设计IP"],
  ["arm_arch", "cadence", "IP/EDA工具"],

  /* DPU → 代工 / 网络 */
  ["bluefield", "tsmc_foundry", "代工制造"],
  ["bluefield", "infiniband", "卸载网络"],
  ["nitro", "tsmc_foundry", "代工制造"],
  ["marvell_dpu", "tsmc_foundry", "代工制造"],

  /* 网络 / 交换 → 光模块 / 代工 / 光芯片 */
  ["tomahawk", "tsmc_foundry", "代工制造"],
  ["tomahawk", "innolight_optic", "配套光模块"],
  ["arista_sw", "tomahawk", "交换芯片"],
  ["arista_sw", "aaoi_module", "光模块"],
  ["infiniband", "aaoi_module", "光模块"],
  ["infiniband", "eoptolink_optic", "光模块"],
  ["nvlink_p", "tsmc_foundry", "代工制造"],

  /* 存储 → 供应链 */
  ["hbm", "tsmc_foundry", "先进封装代工"],
  ["wd_storage", "blackwell", "喂数据给GPU"],
  ["micron_hbm", "asml_euv", "先进制程设备"],

  /* 光模块 → 上游光芯片 / DSP / 驱动（补齐国内外） */
  ["eoptolink_optic", "lumentum_eml", "EML激光芯片"],
  ["eoptolink_optic", "avgo_optical_dsp", "光DSP芯片"],
  ["eoptolink_optic", "yuanjie_laser", "国产激光芯片"],
  ["eoptolink_optic", "tianfu_comp", "光器件配套"],
  ["eoptolink_optic", "macom_chip", "驱动/TIA"],
  ["accelink_mod", "yuanjie_laser", "国产激光芯片"],
  ["accelink_mod", "avgo_optical_dsp", "光DSP芯片"],
  ["coherent_module", "macom_chip", "驱动/TIA"],
  ["innolight_optic", "eoptolink_optic", "模块同行"],
  ["eoptolink_optic", "infiniband", "接入AI组网"],
  ["eoptolink_optic", "arista_opt", "供货给交换机"],
  ["accelink_mod", "cisco_net", "供货给网络设备"],

  /* 光模块 / 网络 → 下游 AI 集群（服务对象） */
  ["innolight_optic", "blackwell", "服务AI集群"],
  ["coherent_module", "blackwell", "服务AI集群"],
  ["eoptolink_optic", "blackwell", "服务AI集群"],

  /* 光芯片上游 → 代工（光芯片也要流片） */
  ["lumentum_eml", "tsmc_foundry", "化合物代工"],
  ["avgo_optical_dsp", "tsmc_foundry", "代工制造"],
  ["mrvl_optical", "tsmc_foundry", "代工制造"],

  /* 数据中心 → 供电 / 散热 / 电网（把能源接到更多算力节点） */
  ["tpu", "vertiv_power", "供电"],
  ["tpu", "vertiv_cooling", "液冷散热"],
  ["trainium", "vertiv_cooling", "液冷散热"],
  ["infiniband", "vertiv_cooling", "散热"],
  ["vertiv_power", "eaton_grid", "接入电网"],
  ["vertiv_power", "schneider_power", "配电同行"],
  ["vertiv_cooling", "schneider_cooling", "制冷同行"],
  ["ceg_nuke", "gev_grid", "并网装备"],
  ["nextera_grid", "gev_grid", "电网装备"],
  ["oklo_smr", "vertiv_power", "专供数据中心"],
  ["nuscale_smr", "vertiv_power", "专供数据中心"],
  ["vst_nuke", "vertiv_power", "核电供电"],
  ["cmi_power", "eaton_grid", "并网"],

  /* 半导体设备 → 服务代工（把设备接到三星/英特尔线） */
  ["lam_eq", "intel_foundry", "制造设备"],
  ["kla_eq", "intel_foundry", "量测设备"],
  ["amat_eq", "intel_foundry", "制造设备"],
  ["synopsys", "samsung_foundry", "设计协同"],
  ["cadence", "samsung_foundry", "设计协同"],
  ["cowos", "samsung_foundry", "先进封装竞逐"],

  /* 太空 → 芯片 / 火箭（补齐） */
  ["kuiper", "starship", "靠火箭部署"],
  ["kuiper", "tomahawk", "地面组网"],
  ["ast_sat", "neutron", "小火箭部署"],
  ["space_gpu", "tsmc_foundry", "代工制造"],
  ["space_gpu", "starcloud", "太空算力"],

  /* ============================================================
   * 空链节点补全：给没有天然上下游的节点补「上游/下游/相关」关系
   * ============================================================ */
  // 机器人零部件 / 集成
  ["foxconn_lighthouse", "teradyne_arm", "协作机械臂"],
  ["cognex_vision", "teradyne_arm", "机械臂+视觉"],
  // 工业 AI → 算力
  ["siemens_iai", "blackwell", "工业AI算力"],
  ["cognex_vision", "omniverse", "仿真配套"],
  // 开源 / 研究模型 → 算力（相关）
  ["llava", "blackwell", "算力"],
  ["mamba", "blackwell", "算力"],
  ["rec_sys", "blackwell", "算力"],
  ["covariant", "blackwell", "算力"],
  ["pi_foundation", "blackwell", "算力"],
  // 图 / 推荐 / 具身 相关
  ["meta_ai", "rec_sys", "推荐图模型"],
  ["rec_sys", "pyg_dgl", "图模型库"],
  ["pi_foundation", "covariant", "机器人基础模型"],
  ["agility_digit", "pi_foundation", "通用动作模型"],
  ["insilico", "pyg_dgl", "分子图建模"],
  // 先进封装 上下游
  ["ase_pkg", "amat_eq", "封装设备"],
  ["amkr_pkg", "amat_eq", "封装设备"],
  ["ase_pkg", "blackwell", "封测"],
  ["amkr_pkg", "blackwell", "封测"],
  // 电信光网络
  ["ericsson_net", "innolight_optic", "用光模块"],
  ["ericsson_net", "blackwell", "电信/AI组网"],
  // 能源：制冷 / 供电 上下游
  ["schneider_cooling", "gev_grid", "接入电网"],
  ["schneider_cooling", "blackwell", "数据中心制冷"],
  ["eaton_power", "gev_grid", "接入电网"],
  ["schneider_power", "gev_grid", "接入电网"],
  ["eaton_power", "blackwell", "供电"],
  ["schneider_power", "blackwell", "供电"],
  // 发电机组 / 可再生 相关
  ["cat_genset", "vertiv_power", "就地发电"],
  ["nee_renew", "nextera_grid", "风光并网"],
  ["nee_renew", "vertiv_power", "可再生供电"],
  // 让更多 GPU 有下游模型（相关）
  ["claude35", "trainium", "训练算力"],
  ["llama", "mi300", "算力(部分)"],
  ["mistral_large", "mi300", "算力"],

  /* ============================================================
   * 扩充产品的上下游 / 相关关系
   * ============================================================ */
  // 生成式媒体 → 算力 / 语音
  ["runway_gen", "blackwell", "算力"],
  ["pika_v", "blackwell", "算力"],
  ["luma_dream", "blackwell", "算力"],
  ["suno_m", "blackwell", "算力"],
  ["udio_m", "blackwell", "算力"],
  ["elevenlabs_v", "blackwell", "算力"],
  ["runway_gen", "sora", "视频模型对标"],
  ["heygen_v", "elevenlabs_v", "用AI配音"],
  ["synthesia_v", "elevenlabs_v", "语音合成"],
  // AI 搜索 → 大模型
  ["searchgpt", "gpt4", "运行于GPT"],
  ["pplx_search", "claude35", "可调用Claude"],
  ["pplx_search", "gpt4", "可调用GPT"],
  ["ai_overviews", "gemini_llm", "由Gemini驱动"],
  ["grok_search", "grok_llm", "由Grok驱动"],
  // AI 加速芯片 → 代工；模型在其上推理；对标 GPU
  ["groq_lpu", "tsmc_foundry", "代工制造"],
  ["cerebras_wse", "tsmc_foundry", "代工制造"],
  ["sambanova_rdu", "tsmc_foundry", "代工制造"],
  ["graphcore_ipu", "tsmc_foundry", "代工制造"],
  ["tenstorrent_chip", "tsmc_foundry", "代工制造"],
  ["etched_sohu", "tsmc_foundry", "代工制造"],
  ["llama", "groq_lpu", "极速推理"],
  ["mistral_large", "groq_lpu", "极速推理"],
  ["llama", "cerebras_wse", "高速推理"],
  ["deepseek_v3", "sambanova_rdu", "私有部署"],
  ["groq_lpu", "blackwell", "挑战GPU"],
  ["cerebras_wse", "blackwell", "挑战GPU"],
  ["etched_sohu", "blackwell", "挑战GPU"],
  ["tenstorrent_chip", "arm_arch", "RISC-V替代"],
  // AI 云算力 → 上游 GPU / 供电；下游模型与实验室
  ["coreweave_cloud", "blackwell", "租GPU算力"],
  ["lambda_cloud", "blackwell", "GPU云"],
  ["crusoe_cloud", "blackwell", "GPU云"],
  ["nebius_cloud", "blackwell", "GPU云"],
  ["together_cloud", "blackwell", "GPU云"],
  ["fireworks_cloud", "blackwell", "GPU云"],
  ["crusoe_cloud", "vertiv_power", "自建供电"],
  ["gpt4", "coreweave_cloud", "云算力"],
  ["llama", "together_cloud", "开源托管"],
  ["mistral_large", "fireworks_cloud", "推理托管"],
  ["claude35", "coreweave_cloud", "云算力"],
  // AI 开发框架 → 大模型 / 数据（相关）
  ["langchain_fw", "gpt4", "编排大模型"],
  ["llamaindex_fw", "gpt4", "接入大模型"],
  ["pinecone_vdb", "langchain_fw", "RAG记忆"],
  ["weaviate_vdb", "llamaindex_fw", "向量检索"],
  ["scale_data", "gpt4", "训练数据"],
  ["surge_data", "claude35", "RLHF数据"],
  ["hf_hub", "llama", "托管开源模型"],
  ["databricks_pl", "dbrx", "自研模型"],
  ["snowflake_ai", "gpt4", "数据上跑AI"],
  ["cursor", "pinecone_vdb", "代码检索"],
  // 企业智能体 / 聊天 / 代码 → 大模型
  ["writer_ai", "blackwell", "自研模型算力"],
  ["sierra_agent", "gpt4", "由大模型驱动"],
  ["decagon_agent", "claude35", "由Claude驱动"],
  ["harvey_ai", "gpt4", "由GPT驱动"],
  ["hebbia_ai", "gpt4", "由大模型驱动"],
  ["character_chat", "blackwell", "算力"],
  ["inflection_pi", "blackwell", "算力"],
  ["devin", "claude35", "由Claude驱动"],
  ["tabnine_ai", "gpt4", "接入大模型"],
  ["v0", "claude35", "由Claude驱动"],
  // 新增大模型 → 算力
  ["command_r", "blackwell", "算力"],
  ["dbrx", "blackwell", "算力"],
  ["reka_core", "blackwell", "算力"],
  ["yi_model", "blackwell", "算力"],
  ["nova_model", "trainium", "AWS自研芯片"],
  ["phi_model", "blackwell", "算力"],
  ["ideogram_img", "blackwell", "算力"],
  ["flux_img", "blackwell", "算力"],
  // 机器人新增 → 零部件 / 大脑
  ["phoenix_robot", "harmonic_drive", "谐波减速器"],
  ["phoenix_robot", "jetson_robot", "计算芯片"],
  ["fourier_gr", "harmonic_drive", "谐波减速器"],
  ["fourier_gr", "openvla", "VLA大脑"],
  // 自动驾驶新增 → 芯片 / 算力
  ["mobileye_adas", "tsmc_foundry", "EyeQ芯片代工"],
  ["aurora_driver", "blackwell", "车端算力"],
  ["wayve_ad", "blackwell", "端到端算力"],
  ["nuro_driver", "blackwell", "车端算力"],
  // 数字生物新增 → 算力
  ["xaira_dd", "blackwell", "算力"],
  ["esm3", "blackwell", "算力"],
  ["esm3", "alphafold", "蛋白模型对标"],
  // 补：数字人 / 向量库的上游
  ["heygen_v", "blackwell", "算力"],
  ["synthesia_v", "blackwell", "算力"],
  ["weaviate_vdb", "gpt4", "为RAG供检索"],
  ["chroma_vdb", "gpt4", "为RAG供检索"],

  /* ============================================================
   * 第二波：中国 / 医疗 / 设计 / 光子 / 部署 + 存储层 的上下游
   * ============================================================ */
  // 中国对话助手 → 大模型
  ["hailuo_chat", "minimax_m", "同系模型"],
  ["zhipu_chat", "glm", "同系模型"],
  ["spark_chat", "blackwell", "算力"],
  // 中国 / 自研大模型 → 算力（含国产算力）
  ["glm", "blackwell", "算力"],
  ["step_model", "blackwell", "算力"],
  ["sensenova", "blackwell", "算力"],
  ["minimax_m", "blackwell", "算力"],
  ["ernie", "ascend", "国产算力"],
  ["glm", "ascend", "国产算力"],
  ["hailuo_video", "minimax_m", "自研模型"],
  ["hailuo_video", "blackwell", "算力"],
  // 国产 / 自研芯片 → 代工 / 显存
  ["cambricon_chip", "tsmc_foundry", "代工制造"],
  ["cambricon_chip", "hbm", "HBM显存"],
  ["ascend", "hbm", "HBM显存"],
  ["mtt_gpu", "tsmc_foundry", "代工制造"],
  ["biren_gpu", "tsmc_foundry", "代工制造"],
  ["hygon_dcu", "tsmc_foundry", "代工制造"],
  ["dojo", "tsmc_foundry", "代工制造"],
  ["maia", "tsmc_foundry", "代工制造"],
  ["mtia", "tsmc_foundry", "代工制造"],
  ["maia", "hbm", "HBM显存"],
  ["mtia", "hbm", "HBM显存"],
  ["dojo", "hbm", "HBM显存"],
  // 编程新增 → 模型
  ["magic_code", "blackwell", "自研模型算力"],
  ["poolside_code", "blackwell", "自研模型算力"],
  ["bolt", "claude35", "由Claude驱动"],
  ["lovable_code", "claude35", "由Claude驱动"],
  // 医疗 AI → 大模型 / 算力
  ["abridge_scribe", "gpt4", "由大模型驱动"],
  ["openevidence_search", "gpt4", "由大模型驱动"],
  ["tempus_ai", "blackwell", "算力"],
  ["hippocratic_agent", "llama", "医疗模型"],
  // 设计 AI → 模型 / 生成
  ["canva_ai", "blackwell", "算力"],
  ["figma_ai", "gpt4", "AI辅助设计"],
  ["firefly_design", "blackwell", "算力"],
  ["canva_ai", "firefly_design", "集成生成"],
  // 光子互联 → 服务算力 / 对标铜互联
  ["lightmatter_photonic", "blackwell", "芯片间光互联"],
  ["ayar_io", "blackwell", "光I/O"],
  ["celestial_fabric", "hbm", "扩展显存带宽"],
  ["lightmatter_photonic", "nvlink_p", "对标铜互联"],
  ["ayar_io", "tsmc_foundry", "共封装光学"],
  // AI 部署 / MLOps → 调用 GPU / 托管模型
  ["modal_infra", "blackwell", "调GPU"],
  ["baseten_deploy", "blackwell", "推理部署"],
  ["replicate_host", "llama", "托管开源模型"],
  ["anyscale_ray", "blackwell", "分布式算力"],
  ["wandb_mlops", "llama", "实验跟踪"],

  /* 存储层：HBM/DRAM/闪存/硬盘 → 上游封装/制程；下游服务 GPU/服务器 */
  ["samsung_hbm", "cowos", "集成到GPU封装"],
  ["hbm", "cowos", "集成HBM"],
  ["samsung_hbm", "blackwell", "HBM显存"],
  ["hbm", "asml_euv", "先进制程设备"],
  ["samsung_hbm", "asml_euv", "先进制程设备"],
  ["server_dram", "epyc", "服务器内存"],
  ["samsung_dram", "xeon", "服务器内存"],
  ["micron_dram", "blackwell", "系统内存"],
  ["ent_ssd", "blackwell", "喂数据给GPU"],
  ["kioxia_nand", "blackwell", "喂数据给GPU"],
  ["micron_nand", "blackwell", "喂数据给GPU"],
  ["seagate_hdd", "blackwell", "冷数据仓库"],
  ["cxl_module", "epyc", "扩展内存"],
  ["samsung_cxl", "blackwell", "扩显存池"],
  ["vast_data", "blackwell", "AI数据平台"],
  ["pure_sys", "blackwell", "高吞吐存储"],
  ["wd_ent", "blackwell", "存训练数据"],
  ["vast_data", "coreweave_cloud", "服务AI云"],
  // 中国机器人新增 → 零部件 / 大脑
  ["walker_robot", "harmonic_drive", "谐波减速器"],
  ["walker_robot", "jetson_robot", "计算芯片"],
  ["agibot_robot", "openvla", "具身大模型"],
  ["agibot_robot", "harmonic_drive", "谐波减速器"],
  ["galbot_robot", "openvla", "具身大模型"],
  ["galbot_robot", "jetson_robot", "计算芯片"],

  /* ============================================================
   * 电力链加厚：核电/核聚变/铀/燃料电池/输配电 → AI 的尽头是电力
   * ============================================================ */
  // 反应堆 → 铀燃料（上游）
  ["ceg_nuke", "cameco_u", "铀燃料"],
  ["vst_nuke", "cameco_u", "铀燃料"],
  ["nuscale_smr", "cameco_u", "核燃料"],
  ["oklo_smr", "centrus_leu", "HALEU燃料"],
  ["terrapower_smr", "centrus_leu", "HALEU燃料"],
  ["xenergy_smr", "centrus_leu", "HALEU燃料"],
  ["kairos_smr", "centrus_leu", "HALEU燃料"],
  ["nano_u", "centrus_leu", "核燃料"],
  // 核电 / 核聚变 / 燃料电池 → 供数据中心算力（下游）
  ["talen_nuke", "blackwell", "核电供数据中心"],
  ["talen_nuke", "vertiv_power", "核电上网"],
  ["helion_fusion", "blackwell", "未来AI供电"],
  ["cfs_fusion", "blackwell", "未来AI供电"],
  ["tae_fusion", "blackwell", "未来AI供电"],
  ["bloom_fc", "blackwell", "就地供电"],
  ["plug_fc", "vertiv_power", "备用供电"],
  ["bloom_fc", "gev_gas", "用天然气"],
  // 输配电设备 → 数据中心供配电（下游）
  ["hitachi_transformer", "vertiv_power", "变压供电"],
  ["siemens_grid", "vertiv_power", "输配电设备"],
  ["powell_switchgear", "vertiv_power", "配电开关"],
  ["quanta_grid", "eaton_grid", "建电网"],
  ["hitachi_transformer", "eaton_grid", "电网设备"],
  // 散热新增
  ["nvent_cool", "blackwell", "液冷散热"],
  // 补：微堆供电 / 电网工程
  ["nano_u", "vertiv_power", "微堆就地供电"],
  ["quanta_grid", "vertiv_power", "数据中心电网工程"],

  /* ============================================================
   * 上游材料 → 下游制造/机器人/电力（整条链的源头）
   * ============================================================ */
  // 代工 / 制造 ← 硅片 / 光刻胶 / 特气 / CMP
  ["tsmc_foundry", "shinetsu_wafer", "硅片"],
  ["samsung_foundry", "sumco_wafer", "硅片"],
  ["intel_foundry", "gwafers_wafer", "硅片"],
  ["tsmc_foundry", "jsr_pr", "光刻胶"],
  ["tsmc_foundry", "tok_pr", "EUV光刻胶"],
  ["tsmc_foundry", "linde_gas", "电子特气"],
  ["samsung_foundry", "airliquide_gas", "电子特气"],
  ["tsmc_foundry", "entegris_cmp", "CMP耗材"],
  ["tsmc_foundry", "cabot_cmp", "CMP抛光"],
  ["asml_euv", "tok_pr", "EUV光刻胶配套"],
  // 先进封装 ← 封装载板
  ["cowos", "ibiden_sub", "ABF载板"],
  ["cowos", "unimicron_sub", "IC载板"],
  ["blackwell", "ibiden_sub", "封装载板"],
  // 机器人 / 电机 ← 稀土永磁
  ["harmonic_drive", "jlmag_magnet", "钕铁硼磁材"],
  ["optimus", "mp_re", "永磁电机"],
  ["figure02", "jlmag_magnet", "永磁电机"],
  ["teradyne_arm", "jlmag_magnet", "伺服电机磁材"],
  // 电力 / 输配电 ← 铜 / SiC 功率器件
  ["hitachi_transformer", "fcx_cu", "铜材"],
  ["siemens_grid", "scco_cu", "铜材"],
  ["vertiv_power", "fcx_cu", "铜"],
  ["nvlink_p", "fcx_cu", "铜互联"],
  ["vertiv_power", "wolfspeed_sic", "SiC功率器件"],
  ["eaton_power", "ifx_power", "功率半导体"],
  ["bloom_fc", "ifx_power", "功率器件"],
  ["shinetsu_pr", "tsmc_foundry", "光刻胶"],
  ["lynas_re", "harmonic_drive", "稀土磁材"],

  /* ============================================================
   * 端侧 AI / AI 广告 / 量子计算
   * ============================================================ */
  // 端侧 AI → 模型 / 芯片
  ["apple_intelligence", "gpt4", "集成ChatGPT"],
  ["apple_intelligence", "tsmc_foundry", "自研芯片代工"],
  ["copilot_pc", "gpt4", "由GPT驱动"],
  ["snapdragon_ai", "tsmc_foundry", "代工制造"],
  ["snapdragon_ai", "arm_arch", "基于ARM架构"],
  ["dimensity_ai", "tsmc_foundry", "代工制造"],
  ["dimensity_ai", "arm_arch", "基于ARM架构"],
  // AI 广告 → 算力 / 模型
  ["applovin_ax", "blackwell", "AI推荐算力"],
  ["tradedesk_ad", "blackwell", "投放优化算力"],
  ["meta_ads", "llama", "AI广告模型"],
  // 量子计算 → 代工 / 与经典算力互补
  ["willow_q", "tsmc_foundry", "芯片制造"],
  ["ibm_q", "blackwell", "量子经典混合"],
  ["ionq_q", "blackwell", "量子经典混合"],
  ["willow_q", "ai4science", "量子模拟科研"],
  ["ionq_q", "ai4science", "量子化学模拟"],
  // Oracle 云 / IBM watsonx
  ["oracle_oci", "blackwell", "GPU云"],
  ["gpt4", "oracle_oci", "云算力"],
  ["ibm_watson", "blackwell", "企业AI算力"],
  // 量子计算补：科研模拟 / 芯片制造
  ["ibm_q", "ai4science", "量子模拟"],
  ["rigetti_q", "ai4science", "量子模拟"],
  ["rigetti_q", "tsmc_foundry", "超导芯片制造"],
  ["dwave_q", "ai4science", "优化问题"],
  ["quantinuum_q", "ai4science", "量子化学"],
  ["psiquantum_q", "tsmc_foundry", "硅光子制造"],

  /* ============================================================
   * 自驾芯片/激光雷达 · 数据中心 · 垂直 · 语音 · 安全 · 遥感
   * ============================================================ */
  // 自驾芯片 → 代工；激光雷达 / 芯片 → 服务自动驾驶
  ["nvidia_drive", "tsmc_foundry", "代工制造"],
  ["horizon_journey", "tsmc_foundry", "代工制造"],
  ["mobileye_eyeq", "tsmc_foundry", "代工制造"],
  ["nvidia_drive", "arm_arch", "含Arm核"],
  ["waymo", "hesai_lidar", "激光雷达感知"],
  ["zoox", "luminar_lidar", "激光雷达感知"],
  ["ponyai", "hesai_lidar", "激光雷达"],
  ["apollo_go", "hesai_lidar", "激光雷达"],
  ["waymo", "nvidia_drive", "车端算力"],
  ["fsd", "hesai_lidar", "纯视觉不用雷达"],
  // AI 数据中心 → 承载 GPU（下游）/ 供电散热（上游）/ 云托管
  ["equinix_dc", "blackwell", "承载GPU集群"],
  ["dlr_dc", "blackwell", "承载GPU集群"],
  ["gds_dc", "blackwell", "承载GPU集群"],
  ["irm_dc", "blackwell", "承载算力"],
  ["stargate_dc", "blackwell", "超级AI数据中心"],
  ["equinix_dc", "vertiv_power", "供电散热"],
  ["dlr_dc", "vertiv_cooling", "液冷散热"],
  ["stargate_dc", "oklo_smr", "专属核电供电"],
  ["stargate_dc", "oracle_oci", "OCI承载"],
  ["coreweave_cloud", "dlr_dc", "托管机房"],
  ["gds_dc", "ascend", "国产算力集群"],
  // 金融 / 教育 / 语音 / 安全 / 遥感 → 大模型 / 算力
  ["bloomberg_gpt", "blackwell", "金融模型算力"],
  ["aladdin_ai", "gpt4", "接入大模型"],
  ["duolingo_max", "gpt4", "由GPT驱动"],
  ["khanmigo", "gpt4", "由GPT驱动"],
  ["speak_tutor", "gpt4", "语音+大模型"],
  ["cresta_cx", "gpt4", "由大模型驱动"],
  ["retell_voice", "elevenlabs_v", "用语音合成"],
  ["retell_voice", "gpt4", "对话大模型"],
  ["vapi_voice", "elevenlabs_v", "用语音合成"],
  ["crowdstrike_ai", "blackwell", "AI检测算力"],
  ["paloalto_ai", "blackwell", "AI安全算力"],
  ["wiz_sec", "gpt4", "云安全AI"],
  ["planet_ai", "blackwell", "AI影像解译"],
  ["blacksky_ai", "blackwell", "AI地理情报"],
  ["planet_ai", "neutron", "小卫星发射"],
  ["planet_ai", "aip", "情报分析平台"],
  // 补：语音/安全/激光雷达的关联
  ["vapi_voice", "gpt4", "对话大模型"],
  ["sentinelone_ai", "blackwell", "AI检测算力"],
  ["zscaler_ai", "blackwell", "AI流量分析"],
  ["ouster_lidar", "tsmc_foundry", "芯片代工"],
  ["cruise", "ouster_lidar", "激光雷达感知"],

  /* ============================================================
   * AI 服务器 · 连接铜缆 · PCB · 电源 · 智能体 · 机器人零部件
   * ============================================================ */
  // AI 服务器 ← GPU/连接/PCB/电源；服务器 → 云/数据中心
  ["smci_server", "blackwell", "搭载GPU"],
  ["dell_server", "blackwell", "搭载GPU"],
  ["hpe_server", "blackwell", "搭载GPU"],
  ["fii_server", "blackwell", "搭载GPU"],
  ["quanta_server", "blackwell", "搭载GPU"],
  ["wiwynn_server", "blackwell", "搭载GPU"],
  ["smci_server", "amphenol_conn", "高速铜缆"],
  ["smci_server", "wus_pcb", "PCB基板"],
  ["smci_server", "delta_psu", "服务器电源"],
  ["fii_server", "amphenol_conn", "高速铜缆"],
  ["fii_server", "victory_pcb", "PCB基板"],
  ["fii_server", "delta_psu", "服务器电源"],
  ["smci_server", "vertiv_cooling", "液冷"],
  ["coreweave_cloud", "smci_server", "整机采购"],
  ["oracle_oci", "fii_server", "整机采购"],
  ["stargate_dc", "fii_server", "GB200机柜"],
  // 连接器 / PCB / 电源 ← 材料（铜/功率器件）；→ 服务AI集群
  ["amphenol_conn", "fcx_cu", "铜材"],
  ["amphenol_conn", "blackwell", "GB200铜缆互联"],
  ["te_conn", "fcx_cu", "铜材"],
  ["wus_pcb", "fcx_cu", "铜箔"],
  ["victory_pcb", "blackwell", "承载GPU芯片"],
  ["delta_psu", "ifx_power", "功率器件"],
  ["delta_psu", "blackwell", "GPU供电"],
  ["mpwr_pmic", "blackwell", "GPU供电"],
  ["mpwr_pmic", "tsmc_foundry", "芯片代工"],
  ["vicor_psu", "blackwell", "末端供电"],
  // AI 智能体 → 大模型
  ["manus_agent", "claude35", "由Claude驱动"],
  ["operator", "gpt4", "运行于GPT"],
  ["genspark_agent", "gpt4", "由大模型驱动"],
  ["adept_agent", "gpt4", "操作软件Agent"],
  // 机器人零部件 ← 材料；→ 装进机器人本体
  ["inovance_motor", "jlmag_magnet", "永磁"],
  ["optimus", "topu_screw", "直线执行器"],
  ["optimus", "inovance_motor", "无框电机"],
  ["figure02", "leader_harmonic", "谐波减速器"],
  ["phoenix_robot", "leader_harmonic", "谐波减速器"],
  ["unitree_g1", "inovance_motor", "关节电机"],
  ["agibot_robot", "sanhua_actuator", "执行器"],
  ["walker_robot", "topu_screw", "丝杠执行器"],
  ["ttm_pcb", "blackwell", "承载芯片"],
  ["ttm_pcb", "fcx_cu", "铜箔"],

  /* ============================================================
   * 第八波：国防 / 脑机 / DePIN / 游戏 + 更多玩家
   * ============================================================ */
  // 国防 AI → 大模型 / 算力 / 无人机
  ["anduril_lattice", "blackwell", "AI算力"],
  ["palantir_gotham", "gpt4", "接入大模型"],
  ["helsing_ai", "blackwell", "AI算力"],
  ["shield_hivemind", "nvidia_drive", "边缘算力"],
  ["anduril_lattice", "planet_ai", "卫星情报"],
  // 脑机接口 → 芯片 / 手术机器人
  ["neuralink_bci", "tsmc_foundry", "植入芯片代工"],
  ["synchron_bci", "blackwell", "神经信号AI"],
  ["neuralink_bci", "blackwell", "神经解码AI"],
  // DePIN → 聚合 GPU；服务模型/渲染
  ["ionet_gpu", "blackwell", "聚合GPU算力"],
  ["render_net", "blackwell", "聚合GPU"],
  ["akash_net", "blackwell", "去中心化算力"],
  ["bittensor_net", "blackwell", "去中心化训练"],
  ["llama", "ionet_gpu", "低价算力"],
  ["render_net", "runway_gen", "渲染/生成"],
  // 游戏 AI → 大模型 / 生成
  ["inworld_npc", "gpt4", "NPC对话模型"],
  ["inworld_npc", "blackwell", "算力"],
  ["scenario_assets", "stable_diffusion", "美术生成"],
  // 新增大模型 → 算力
  ["falcon", "blackwell", "算力"],
  ["nemotron", "blackwell", "算力"],
  ["granite", "blackwell", "算力"],
  ["nemotron", "nvidia_drive", "英伟达生态"],
  // 新增应用 → 模型
  ["poe_chat", "gpt4", "聚合大模型"],
  ["poe_chat", "claude35", "聚合大模型"],
  ["augment_code", "claude35", "由Claude驱动"],
  // 新增视频/语音 → 模型/算力
  ["kling_video", "blackwell", "算力"],
  ["cartesia_voice", "blackwell", "语音模型算力"],
  ["retell_voice", "cartesia_voice", "实时语音"],
  // 新增机器人本体 → 零部件
  ["robotera_star", "leader_harmonic", "谐波减速器"],
  ["robotera_star", "openvla", "具身大模型"],
  ["engineai_robot", "inovance_motor", "关节电机"],
  ["engineai_robot", "jetson_robot", "计算芯片"],
  // 新增自动驾驶 → 芯片
  ["momenta_ad", "nvidia_drive", "车端算力"],
  ["momenta_ad", "hesai_lidar", "激光雷达"],
  ["precision_bci", "tsmc_foundry", "电极芯片代工"],

  /* ============================================================
   * 第九波：海外高科技补充
   * ============================================================ */
  // 办公生产力 → 大模型
  ["notion_ai", "gpt4", "由大模型驱动"],
  ["grammarly_ai", "gpt4", "由大模型驱动"],
  ["deepl_tr", "blackwell", "翻译模型算力"],
  ["moveworks_ai", "gpt4", "企业智能体"],
  // 世界模型 → 算力；服务机器人/自动驾驶/游戏
  ["worldlabs_wm", "blackwell", "算力"],
  ["genie_wm", "tpu", "算力"],
  ["sakana_wm", "blackwell", "算力"],
  ["optimus", "worldlabs_wm", "空间智能"],
  ["inworld_npc", "genie_wm", "生成世界"],
  // 图像/视频/语音新增 → 算力/上游
  ["recraft_img", "blackwell", "算力"],
  ["leonardo_img", "blackwell", "算力"],
  ["krea_img", "flux_img", "聚合模型"],
  ["genmo_video", "blackwell", "算力"],
  ["higgsfield_video", "blackwell", "算力"],
  ["playht_voice", "blackwell", "语音模型算力"],
  ["retell_voice", "playht_voice", "语音接口"],
  // 智能体新增 → 大模型
  ["lindy_agent", "gpt4", "由大模型驱动"],
  ["multion_agent", "gpt4", "操作网页Agent"],
  // 编程新增 → 模型
  ["cody_code", "claude35", "由Claude驱动"],
  // 连接芯片新增 → 代工 / 服务集群
  ["astera_conn", "tsmc_foundry", "代工制造"],
  ["astera_conn", "blackwell", "GPU互联"],
  ["credo_aec", "blackwell", "机柜互联"],
  ["astera_conn", "cxl_module", "CXL控制"],
  // 向量库 / 数据 → 服务大模型
  ["qdrant_vdb", "gpt4", "为RAG供检索"],
  ["milvus_vdb", "gpt4", "为RAG供检索"],
  ["mercor_data", "gpt4", "训练数据"],
  ["turing_data", "gpt4", "训练数据"],
  // 机器人新增 → 大脑/零部件
  ["skild_brain", "blackwell", "训练算力"],
  ["dexterity_robot", "skild_brain", "机器人大脑"],
  ["cobot_robot", "openvla", "具身大模型"],
  ["figure02", "skild_brain", "通用大脑参考"],
  // 自动驾驶新增 → 算力
  ["waabi_ad", "blackwell", "仿真+车端算力"],
  ["applied_sim", "blackwell", "仿真算力"],
  ["applied_sim", "waymo", "仿真工具链"],
  // 国防/脑机新增 → 算力/芯片
  ["saronic_usv", "nvidia_drive", "边缘算力"],
  ["paradromics_bci", "tsmc_foundry", "电极芯片代工"],
  // 新增大模型 → 算力
  ["aleph_model", "blackwell", "算力"],
  // 补：机器人/图像的关联
  ["dexterity_robot", "inovance_motor", "关节电机"],
  ["krea_img", "blackwell", "算力"],

  /* ============================================================
   * 第十波：海外前沿实验室 / 语音 / 推理芯片 / 垂直
   * ============================================================ */
  ["ssi_model", "blackwell", "算力"],
  ["tml_model", "blackwell", "算力"],
  ["deepgram_stt", "blackwell", "语音识别算力"],
  ["assemblyai_stt", "blackwell", "语音识别算力"],
  ["retell_voice", "deepgram_stt", "语音识别"],
  ["dmatrix_chip", "tsmc_foundry", "代工制造"],
  ["positron_chip", "tsmc_foundry", "代工制造"],
  ["rain_chip", "tsmc_foundry", "代工制造"],
  ["dmatrix_chip", "hbm", "HBM显存"],
  ["llama", "dmatrix_chip", "推理芯片"],
  ["nabla_scribe", "gpt4", "由大模型驱动"],
  ["suki_voice", "gpt4", "由大模型驱动"],
  ["nabla_scribe", "deepgram_stt", "语音识别"],
  ["robin_legal", "gpt4", "由大模型驱动"],

  /* ============================================================
   * 第十一波：台湾 AI 供应链 + IC 设计服务
   * ============================================================ */
  // IC 设计服务 → 代工；服务自研 AI 芯片
  ["alchip_asic", "tsmc_foundry", "先进制程代工"],
  ["guc_asic", "tsmc_foundry", "台积电体系"],
  ["faraday_asic", "umc_foundry", "联电体系"],
  ["trainium", "alchip_asic", "ASIC设计服务"],
  ["maia", "guc_asic", "ASIC设计服务"],
  ["andes_ip", "blackwell", "RISC-V IP"],
  ["ememory_ip", "tsmc_foundry", "嵌入式存储IP"],
  ["alchip_asic", "cowos", "先进封装"],
  // 代工新增
  ["mtt_gpu", "umc_foundry", "成熟制程"],
  // AI 服务器代工 → GPU / 连接 / 电源
  ["wistron_server", "blackwell", "搭载GPU"],
  ["inventec_server", "blackwell", "搭载GPU"],
  ["gigabyte_server", "blackwell", "搭载GPU"],
  ["pegatron_server", "blackwell", "搭载GPU"],
  ["asus_server", "blackwell", "搭载GPU"],
  ["wistron_server", "avc_cool", "液冷散热"],
  ["gigabyte_server", "liteon_psu", "服务器电源"],
  // 交换机 → 交换芯片 / 服务集群
  ["accton_switch", "tomahawk", "交换芯片"],
  ["accton_switch", "blackwell", "AI组网"],
  // 散热 / PCB / 电源 / 内存 → 服务 GPU 集群
  ["avc_cool", "blackwell", "液冷散热"],
  ["auras_cool", "blackwell", "液冷散热"],
  ["zhending_pcb", "blackwell", "承载芯片"],
  ["zhending_pcb", "fcx_cu", "铜箔"],
  ["liteon_psu", "blackwell", "服务器供电"],
  ["nanya_dram", "blackwell", "系统内存"],
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
  genmedia: 0, search_ai: 0, health_ai: 0, design_ai: 0, edge_ai: 0, ai_ad: 0,
  fin_ai: 0, edu_ai: 0, voice_agent: 0, ai_security: 0, sat_ai: 1, ai_agent: 0,
  defense_ai: 0, bci: 0, game_ai: 0, depin: 4.5, productivity_ai: 0,
  // 世界模型（模型层）
  world_model: 3,
  // 量子计算 / 自驾芯片（与芯片同层级）；AI 数据中心（基础设施）
  quantum: 5, av_chip: 5, ai_datacenter: 6,
  // AI 服务器/连接/PCB/电源 · 机器人零部件
  ai_server: 4.8, connector: 6.2, pcb: 6.8, power_supply: 9, robot_parts: 7.3,
  // AI 开发框架（介于模型与芯片之间的软件底座）
  ai_infra_sw: 4,
  // AI 加速芯片 / AI 云算力（云在模型与芯片之间：向下服务模型，向上依赖 GPU）
  ai_accel: 5, neocloud: 4.5,
  // 太空（前沿应用 / 轨道基建）
  orbital_dc: 1, satellite: 1, launch: 2,
  // 模型层
  llm: 3, vlm: 3, vla: 3, mmllm: 3, gpt: 3, dm: 3, gnn: 3, moe: 3, ssm: 3, lbm: 3,
  // 计算芯片
  gpu: 5, cpu: 5, dpu: 5,
  // 集群部件：互联 / 网络
  nvlink: 6, network: 6,
  // 存储层（HBM/DRAM/闪存/硬盘等，供应给算力集群）
  hbm_mem: 6, dram_mem: 6, cxl_mem: 6, nand_ssd: 6, ent_storage: 6, hdd_stor: 6,
  // 光通信：下游设备(6) → 中游模块(6.5) → 上游光芯片(7.5)
  opt_network: 6, opt_module: 6.5, opt_chip: 7.5,
  // 制造：封装 → 代工 → 设备 / EDA / IC设计服务
  packaging: 7, foundry: 7.5, equipment: 8.5, eda: 8.5, asic_design: 8,
  // 材料层（最上游原料，位于设备/制造之上）
  silicon_wafer: 11, photoresist: 11, e_gases: 11, substrate: 11,
  cmp_mat: 11, rare_earth: 11, copper: 11, sic_gan: 11,
  // 能源（最上游）
  cooling: 9, power: 9, grid: 9.5, generation: 10, nuclear: 10,
  // 电力链扩充：输配电设备 / 燃料电池 / 核聚变；铀燃料最上游
  transformer: 9.5, fuelcell: 10, fusion: 10, uranium: 10.5,
};
/** 少数「混在应用城市里的部件/大脑」按真实层级修正。 */
const PRODUCT_RANK: Record<string, number> = {
  groot: 3, // 机器人大脑(模型)
  jetson_robot: 5, // 机器人计算芯片
  arm_arch: 8, // 芯片架构 / IP 授权——在计算芯片之上、EDA 之下
  harmonic_drive: 7.5, // 谐波减速器(比机械臂更上游的核心零部件)
  teradyne_arm: 7, // 机械臂 / 集成部件
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

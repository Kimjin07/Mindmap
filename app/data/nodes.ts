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
      l2: "核心是用 AI 预测蛋白质结构(如 AlphaFold)、生成分子、加速药物筛选,把「湿实验」变成「干实验+AI」。分基础模型(DeepMind、EvolutionaryScale)与 AI 制药(Recursion、英矽);终极考验是候选药能否通过临床。",
    },
    companyIds: ["googl", "nvda"],
  },
  robotaxi: {
    id: "robotaxi", parentId: "apps", type: "category", name: "自动驾驶出租", nameEn: "Robotaxi", icon: "robotaxi",
    levels: {
      l0: "没有司机、自己开的出租车。",
      l1: "Robotaxi 用 AI 感知路况、做决策来无人驾驶载客，代表着出行方式的变革。",
      l2: "靠车载传感器(激光雷达/摄像头)+ AI 驾驶模型实现 L4 级无人驾驶。商业模式是运营车队按里程收费,但研发烧钱、周期长、受监管制约,先在限定区域跑通再扩张。代表:Waymo、小马智行、文远知行。",
    },
    companyIds: ["tsla", "googl"],
  },
  enterprise: {
    id: "enterprise", parentId: "apps", type: "category", name: "企业智能体", nameEn: "Enterprise AI Agents", icon: "enterprise",
    levels: {
      l0: "帮企业自动干活的「AI 员工」。",
      l1: "企业智能体能自动处理客服、流程、数据分析等工作，像一个不知疲倦的数字员工。",
      l2: "把大模型接进企业真实系统与流程,自动完成客服、IT/HR、销售、法务等重复性知识工作。不同于聊天,它要能调用工具、按公司规则办事。商业化最快,但对准确性、安全合规要求极高。",
    },
    companyIds: ["msft", "crm", "now", "pltr"],
  },
  ai_agent: {
    id: "ai_agent", parentId: "apps", type: "category", name: "通用 AI 智能体", nameEn: "AI Agents", icon: "ai_coder",
    levels: {
      l0: "能自己上网、操作电脑帮你办事的通用智能体。",
      l1: "通用 Agent 能自主规划、调用工具、操作浏览器/电脑完成复杂任务，是「之后会爆」的方向。Manus、OpenAI Operator 等是代表。",
      l2: "能自主规划步骤、调用工具、跨应用完成复杂任务的通用智能体——给个目标就自己办完。2025 年最热方向,但可靠性、幻觉、长任务稳定性仍是难点。代表:OpenAI Agent、Manus、Genspark。",
    },
    companyIds: ["manus", "openai"],
  },
  robot_parts: {
    id: "robot_parts", parentId: "apps", type: "category", name: "机器人零部件", nameEn: "Robot Components", icon: "robotics",
    levels: {
      l0: "人形机器人的「关节、肌肉与神经」。",
      l1: "减速器、丝杠、无框电机、灵巧手与力/触觉传感器是人形机器人成本与技术的核心，中国供应链正快速崛起。",
      l2: "人形机器人的核心部件:执行器(电机+减速器+丝杠)、灵巧手、传感器、以及谐波/行星减速器等。这些精密机电件决定机器人的运动能力与成本,是量产的关键瓶颈,也是国产替代的重点。",
    },
    companyIds: ["harmonic", "sanhua", "inovance"],
  },
  science: {
    id: "science", parentId: "apps", type: "category", name: "科学计算", nameEn: "Science", icon: "science",
    levels: {
      l0: "用 AI 加速科学发现。",
      l1: "在物理、化学、气候等领域，AI 能模拟和预测复杂系统，帮科学家更快做研究。",
      l2: "用 AI 加速科研:模拟分子/材料/气候、求解偏微分方程、自动设计实验等,把需要超算数月的计算压缩到数小时。介于应用与前沿研究之间,是「AI for Science」的核心。",
    },
    companyIds: ["nvda", "googl"],
  },
  robotics: {
    id: "robotics", parentId: "apps", type: "category", name: "机器人", nameEn: "Robotics", icon: "robotics",
    levels: {
      l0: "会看、会动、能干活的实体 AI。",
      l1: "机器人把 AI 装进实体，让它能在真实世界里行走、抓取、操作，是「具身智能」的方向。",
      l2: "会感知、决策、行动的实体 AI,涵盖人形、四足、协作臂、移动机器人。关键是「具身智能」大脑(VLA 模型)+ 精密硬件本体。被视为继大模型后 AI 的下一个大风口,但量产与泛化仍难。",
    },
    companyIds: ["tsla", "nvda"],
  },
  manufacturing: {
    id: "manufacturing", parentId: "apps", type: "category", name: "智能制造", nameEn: "Manufacturing", icon: "manufacturing",
    levels: {
      l0: "让工厂更聪明的 AI。",
      l1: "智能制造用 AI 做质检、预测性维护、优化生产，提升工厂效率和良率。",
      l2: "把 AI 用进工厂:机器视觉质检、预测性维护、生产优化、以及自动驾驶的仿真工具链等,让制造更智能高效。依赖工业数据与自动化硬件,落地扎实但相对低调。",
    },
    companyIds: ["nvda"],
  },
  ai_coder: {
    id: "ai_coder", parentId: "apps", type: "category", name: "代码助手", nameEn: "AI Coder", icon: "ai_coder",
    levels: {
      l0: "帮程序员写代码的 AI。",
      l1: "AI Coder 像 GitHub Copilot，能补全、生成、解释代码，大幅提升开发效率。",
      l2: "帮程序员写、改、审代码的 AI,从补全升级到能自主完成多步任务的编程智能体。是大模型最快变现、增长最猛的场景之一。竞争核心是对整个代码库的上下文理解。代表:Cursor、Copilot、Windsurf。",
    },
    companyIds: ["msft", "googl"],
  },
  genmedia: {
    id: "genmedia", parentId: "apps", type: "category", name: "生成式媒体", nameEn: "Generative Media", icon: "chatbots",
    levels: {
      l0: "用 AI 生成语音、音乐、视频与数字人。",
      l1: "生成式媒体把文字变成配音、歌曲、视频和虚拟主播，正在重塑内容创作与营销。",
      l2: "用 AI 生成图像、视频、音乐、语音、数字人。技术底座多为扩散模型与自回归模型,竞争在质量、可控性与成本,并涉及版权与伦理争议。代表:Midjourney、Runway、可灵、ElevenLabs、Suno。",
    },
    companyIds: ["elevenlabs", "runwayml"],
  },
  search_ai: {
    id: "search_ai", parentId: "apps", type: "category", name: "AI 搜索", nameEn: "AI Search", icon: "chatbots",
    levels: {
      l0: "用对话直接给答案的新一代搜索。",
      l1: "AI 搜索用大模型 + 实时检索，把「找链接」变成「给答案」，挑战传统搜索引擎。",
      l2: "用对话直接给出带引用的答案,取代「一堆蓝链接」。底层是大模型+实时检索(RAG),挑战传统搜索的商业模式。代表:Perplexity;巨头谷歌也在用 AI 改造搜索。",
    },
    companyIds: ["perplexity", "googl"],
  },
  health_ai: {
    id: "health_ai", parentId: "apps", type: "category", name: "医疗 AI", nameEn: "Healthcare AI", icon: "digital_biology",
    levels: {
      l0: "帮医生看病、写病历、找证据的 AI。",
      l1: "医疗 AI 做临床问诊记录、医学检索、影像与诊断辅助，正快速渗透医院与药企。",
      l2: "帮医生减负与决策:环境问诊记录、医学证据检索、影像诊断、AI 护士随访等。最刚需、最快见效的是「减轻文书负担」,强调准确、可溯源、安全合规。代表:Abridge、OpenEvidence、Tempus。",
    },
    companyIds: ["tempus", "abridge"],
  },
  design_ai: {
    id: "design_ai", parentId: "apps", type: "category", name: "AI 设计", nameEn: "AI Design", icon: "manufacturing",
    levels: {
      l0: "帮人做图、排版、出设计稿的 AI。",
      l1: "把生成式 AI 装进设计与创意工具，从海报、UI 到品牌素材一键生成。",
      l2: "帮人做图、排版、出设计稿的 AI,把生成式图像做成设计师的专业生产工具(矢量、品牌一致、可控),面向真实设计与营销工作流。代表:Canva、Recraft、Figma、Krea。",
    },
    companyIds: ["canva", "figma"],
  },
  edge_ai: {
    id: "edge_ai", parentId: "apps", type: "category", name: "端侧 AI", nameEn: "Edge AI", icon: "ai_coder",
    levels: {
      l0: "跑在手机、电脑、眼镜里的「本地 AI」。",
      l1: "把模型塞进终端设备，不联网也能用、更快更私密。苹果、高通、联发科等在芯片与系统里内建 AI，掀起 AI 手机与 AI PC 浪潮。",
      l2: "把 AI 跑在手机、电脑、眼镜等终端本地,不依赖云端,兼顾隐私、低延迟、省流量,靠芯片里的 NPU 支撑。是「AI 无处不在」的关键。代表:高通、联发科、苹果的端侧 AI。",
    },
    companyIds: ["apple", "qualcomm"],
  },
  ai_ad: {
    id: "ai_ad", parentId: "apps", type: "category", name: "AI 广告营销", nameEn: "AI Advertising", icon: "enterprise",
    levels: {
      l0: "用 AI 精准投放广告、赚钱的机器。",
      l1: "AI 广告用模型预测点击与转化、自动优化投放，是 AI 商业化最直接变现的场景，AppLovin 等靠它业绩暴涨。",
      l2: "用 AI 精准预测谁会点击、转化,把广告投给最合适的人,大幅提升变现效率。谁的推荐算法强谁就赚更多,是「AI 直接创造巨额营收」最鲜明的场景。代表:AppLovin、The Trade Desk。",
    },
    companyIds: ["applovin", "ttd"],
  },
  fin_ai: {
    id: "fin_ai", parentId: "apps", type: "category", name: "金融 AI", nameEn: "Finance AI", icon: "enterprise",
    levels: {
      l0: "帮投研、投行、资管干活的 AI。",
      l1: "金融 AI 做投研分析、风控、量化与投行尽调，用大模型处理海量财报与市场数据。",
      l2: "帮投研、投行、资管处理海量文档与数据:读财报、做尽调、比对研报、风控等,把高薪分析师从苦活中解放。强调准确、可核查、合规。代表:Hebbia、彭博、贝莱德 Aladdin。",
    },
    companyIds: ["bloomberg", "blackrock"],
  },
  edu_ai: {
    id: "edu_ai", parentId: "apps", type: "category", name: "教育 AI", nameEn: "Education AI", icon: "science",
    levels: {
      l0: "一对一的 AI 老师。",
      l1: "教育 AI 做语言学习、答疑与个性化辅导，多邻国、可汗学院把大模型变成人人可用的私教。",
      l2: "用 AI 做「一对一私教」:对话式辅导、口语陪练、逐题讲解、批改作业,让优质教育更便宜普及。关键是引导思考而非直接给答案、防作弊。代表:多邻国、可汗学院、Speak。",
    },
    companyIds: ["duolingo", "khanacademy"],
  },
  voice_agent: {
    id: "voice_agent", parentId: "apps", type: "category", name: "语音智能体", nameEn: "Voice Agents", icon: "chatbots",
    levels: {
      l0: "会打电话、能对话的 AI 客服。",
      l1: "语音智能体用实时语音 + 大模型自动接打电话，替代呼叫中心，做客服、预约与外呼。",
      l2: "会打电话、能自然对话的 AI 客服/助手,处理预约、外呼、问询等。底层要把语音识别+大模型+语音合成+电话+超低延迟拼起来,大模型让「和 AI 通话」成真。代表:Sierra、Vapi、Retell。",
    },
    companyIds: ["cresta", "retell"],
  },
  ai_security: {
    id: "ai_security", parentId: "apps", type: "category", name: "AI 网络安全", nameEn: "AI Security", icon: "enterprise",
    levels: {
      l0: "用 AI 防黑客，也防 AI 带来的新威胁。",
      l1: "AI 安全用模型实时检测入侵与异常、自动响应；同时也要守护大模型本身不被攻击滥用。",
      l2: "两面:用 AI 增强防御(自动检测威胁、端点安全),也应对 AI 带来的新风险(数据泄露、提示注入)。攻击日益自动化,「用 AI 对抗 AI」成必然。代表:CrowdStrike、Palo Alto、Wiz、Zscaler。",
    },
    companyIds: ["crowdstrike", "paloalto"],
  },
  defense_ai: {
    id: "defense_ai", parentId: "apps", type: "category", name: "国防 / 政务 AI", nameEn: "Defense AI", icon: "enterprise",
    levels: {
      l0: "把 AI 用到国防、情报与政府决策。",
      l1: "自主无人系统、战场感知与指挥决策，Anduril、Palantir、Helsing 等把 AI 引入军事与政务，是资本与地缘的焦点。",
      l2: "把 AI 用到国防与政务:战场态势感知、自主无人机/舰艇、情报分析、政府决策等。地缘冲突让需求激增,「软件定义国防」兴起。代表:Anduril、Helsing、Palantir、Shield AI。",
    },
    companyIds: ["anduril", "pltr"],
  },
  bci: {
    id: "bci", parentId: "apps", type: "category", name: "脑机接口", nameEn: "Brain-Computer Interface", icon: "science",
    levels: {
      l0: "让大脑直接和机器对话——AI 的终极人机接口。",
      l1: "脑机接口把神经信号读出/写入，帮瘫痪者操控设备，长远看是人与 AI 融合的入口。Neuralink、Synchron 领跑。",
      l2: "在大脑与机器间建直接通道,读取神经信号、解码意图,让人用「意念」控制设备,或帮瘫痪失语者恢复。首要是医疗,靠 AI 解码海量神经信号。代表:Neuralink、Synchron、Paradromics。",
    },
    companyIds: ["neuralink", "synchron"],
  },
  productivity_ai: {
    id: "productivity_ai", parentId: "apps", type: "category", name: "AI 办公 · 生产力", nameEn: "Productivity AI", icon: "enterprise",
    levels: {
      l0: "写作、文档、翻译、办公协作里的 AI。",
      l1: "把生成式 AI 装进文档、写作与办公协作(Notion、Grammarly、DeepL)，直接提升每个知识工作者的效率。",
      l2: "写作、文档、翻译、办公协作里的 AI,从「改你写的」升级到「帮你写」,嵌进你每天用的工具里,竞争在生态与数据。代表:Grammarly、Notion、DeepL、微软 Copilot。",
    },
    companyIds: ["notion", "grammarly"],
  },
  game_ai: {
    id: "game_ai", parentId: "apps", type: "category", name: "游戏 AI", nameEn: "Game AI", icon: "ai_coder",
    levels: {
      l0: "会「活」起来的游戏 NPC 与 AI 生成内容。",
      l1: "用大模型驱动游戏角色对话与行为、AI 生成美术与关卡，重塑内容生产与玩法。",
      l2: "让游戏 NPC 能自由对话、有记忆性格的 AI 角色引擎,以及 AI 生成游戏美术资产,有望彻底改变游戏体验与制作方式。代表:Inworld(角色)、Scenario(美术)。",
    },
    companyIds: ["inworld", "scenario"],
  },

  /* ---------------- 模型层 ---------------- */
  llm: { id: "llm", parentId: "models", type: "category", name: "大语言模型", nameEn: "LLM",
    levels: { l0: "擅长理解和生成文字的模型。", l1: "LLM 是 ChatGPT 背后的核心，通过海量文本训练，能对话、写作、推理。", l2: "以 Transformer 为主的大语言模型,靠海量文本预训练+对齐(RLHF)获得理解与生成能力。参数越大、数据越多通常越强,但训练极其烧钱。是整个模型层的核心。代表:GPT、Claude、Gemini、Llama。" }, companyIds: ["msft", "googl", "nvda"] },
  vlm: { id: "vlm", parentId: "models", type: "category", name: "视觉语言模型", nameEn: "VLM",
    levels: { l0: "既能看图又能说话的模型。", l1: "VLM 能同时理解图像和文字，比如看图回答问题。", l2: "在大语言模型上接入视觉编码器,让模型「长出眼睛」——能看图、答关于图像的问题、描述场景,是多模态的基础形态。代表:GPT-4o、Gemini、开源的 LLaVA。" }, companyIds: ["googl", "meta"] },
  vla: { id: "vla", parentId: "models", type: "category", name: "视觉-语言-动作模型", nameEn: "VLA",
    levels: { l0: "能看、能理解、还能行动的模型。", l1: "VLA 把感知和动作连起来，是机器人智能的关键。", l2: "视觉-语言-动作模型:输入画面+语言指令,直接输出机器人动作,是机器人的「通用大脑」,让机器人能听懂人话去做事,是具身智能的核心。代表:Physical Intelligence、谷歌 RT、OpenVLA。" }, companyIds: ["nvda", "tsla"] },
  mmllm: { id: "mmllm", parentId: "models", type: "category", name: "多模态大模型", nameEn: "MMLLM",
    levels: { l0: "能同时处理文字、图片、声音的大模型。", l1: "多模态模型让 AI 像人一样综合多种信息来理解世界。", l2: "原生多模态大模型,能同时处理文字、图像、音频、视频,而非事后拼接,更接近人类的综合感知,训练与数据难度更高。代表:GPT-4o、Gemini、Reka、阶跃星辰。" }, companyIds: ["googl", "meta"] },
  gpt: { id: "gpt", parentId: "models", type: "category", name: "生成式预训练模型", nameEn: "GPT",
    levels: { l0: "一类经典的生成式模型架构。", l1: "GPT 是 LLM 的代表架构，开创了「预训练 + 微调」的范式。", l2: "「生成式预训练」架构——先在海量数据上自监督预训练,再微调。是当今几乎所有大模型的基础范式,由此衍生出 GPT、Claude 等,属于经典但奠基性的模型架构。" }, companyIds: ["msft"] },
  dm: { id: "dm", parentId: "models", type: "category", name: "扩散模型", nameEn: "DM",
    levels: { l0: "擅长生成图像/视频的模型。", l1: "扩散模型通过「去噪」生成高质量图片和视频，是 AI 绘画的核心。", l2: "扩散模型:通过「逐步去噪」从随机噪声生成图像/视频,可控性和画质好,是生成式媒体的主流架构。代表:Stable Diffusion、FLUX,以及各类文生图/视频模型的底座。" }, companyIds: ["adbe", "googl"] },
  gnn: { id: "gnn", parentId: "models", type: "category", name: "图神经网络", nameEn: "GNN",
    levels: { l0: "处理「关系网络」数据的模型。", l1: "GNN 擅长社交网络、分子结构等图结构数据。", l2: "图神经网络:专门在「图」结构数据(社交网络、分子、知识图谱)上学习,挖掘节点间关系,用于药物发现、风控、推荐等。主流开源框架有 PyG、DGL。" }, companyIds: ["googl"] },
  moe: { id: "moe", parentId: "models", type: "category", name: "混合专家", nameEn: "MOE",
    levels: { l0: "让大模型更高效的结构。", l1: "MoE 把模型拆成多个「专家」，按需调用，既省算力又强。", l2: "混合专家结构:把大模型拆成许多「专家」子网络,每次只激活其中几个,从而在不成比例增加计算的前提下大幅扩大参数量、提升效率,被众多前沿大模型采用。" }, companyIds: ["googl", "msft"] },
  ssm: { id: "ssm", parentId: "models", type: "category", name: "状态空间模型", nameEn: "SSM",
    levels: { l0: "处理超长序列的高效模型。", l1: "SSM（如 Mamba）是 Transformer 的有力挑战者，处理长文本更省资源。", l2: "状态空间模型(如 Mamba):以接近线性的复杂度处理超长序列,是 Transformer(注意力平方级增长)最有潜力的高效挑战者,适合长文档、基因组、音频。" }, companyIds: ["nvda"] },
  lbm: { id: "lbm", parentId: "models", type: "category", name: "大行为模型", nameEn: "LBM",
    levels: { l0: "面向「动作 / 决策」的大模型。", l1: "LBM 把大模型的思路用于行为与控制，常见于机器人领域。", l2: "大行为模型:面向「动作/决策」而非文字,学习如何在环境中行动,是机器人与自动驾驶「大脑」的一种范式,与 VLA、世界模型密切相关。" }, companyIds: ["nvda", "tsla"] },
  world_model: { id: "world_model", parentId: "models", type: "category", name: "世界模型 · 空间智能", nameEn: "World Models",
    levels: {
      l0: "让 AI 理解并生成 3D 世界、拥有空间智能。",
      l1: "世界模型学习物理世界的运作规律，能生成可交互的 3D 环境，是机器人、自动驾驶与游戏的底层「想象力」。李飞飞 World Labs、谷歌 Genie 等领跑。",
      l2: "让 AI 理解并生成三维世界、具备空间智能——预测物理演化、生成可交互场景,被视为通向通用智能与机器人的关键。代表:李飞飞的 World Labs,以及各类视频/仿真世界模型。",
    }, companyIds: ["worldlabs", "googl"] },

  /* ---------------- 基础设施 / 芯片 / 能源 ---------------- */
  gpu: { id: "gpu", parentId: "chips", type: "category", name: "图形处理器", nameEn: "GPU", icon: "gpu",
    levels: { l0: "AI 计算的主力芯片。", l1: "GPU 能并行做海量计算，是训练 AI 模型的核心硬件，英伟达是绝对龙头。",
      l2: "GPU 设计由英伟达、AMD 主导，制造依赖台积电的先进制程；显存(HBM)与封装(CoWoS)是当前产能瓶颈。" }, companyIds: ["nvda", "amd"] },
  cpu: { id: "cpu", parentId: "chips", type: "category", name: "中央处理器", nameEn: "CPU", icon: "cpu",
    levels: { l0: "计算机的通用大脑。", l1: "CPU 负责通用计算与调度，在 AI 系统里与 GPU 协同工作。", l2: "计算机的通用处理器,擅长串行、复杂逻辑与调度。数据中心 CPU 由英特尔 Xeon、AMD EPYC 主导,Arm 架构(如 Neoverse)正快速抢占份额,是服务器不可或缺的「大管家」。" }, companyIds: ["intc", "amd"] },
  dpu: { id: "dpu", parentId: "chips", type: "category", name: "数据处理器", nameEn: "DPU", icon: "dpu",
    levels: { l0: "专门处理数据搬运的芯片。", l1: "DPU 卸载网络、存储等任务，让 GPU/CPU 专注于计算。", l2: "数据处理器:专门卸载网络、存储、安全等数据搬运任务,把 CPU 解放出来专注计算,是现代 AI 数据中心提升效率的关键芯片。代表:英伟达 BlueField、博通、Marvell。" }, companyIds: ["nvda", "mrvl"] },
  ai_accel: { id: "ai_accel", parentId: "chips", type: "category", name: "AI 加速芯片", nameEn: "AI Accelerators", icon: "gpu",
    levels: { l0: "挑战 GPU 的推理/训练新架构芯片。", l1: "Groq、Cerebras、SambaNova 等用全新架构(晶圆级、数据流、LPU)专攻 AI 推理与训练，主打更快更省。", l2: "挑战 GPU 的 AI 专用芯片,针对训练或推理做架构优化(存算一体、Transformer 专用、晶圆级),想在能效或成本上超过英伟达,难点是软件生态。代表:Cerebras、Groq、d-Matrix、Etched。" }, companyIds: ["groq", "cerebras", "sambanova"] },
  quantum: { id: "quantum", parentId: "chips", type: "category", name: "量子计算", nameEn: "Quantum Computing", icon: "cpu",
    levels: {
      l0: "用量子比特算传统计算机算不动的问题。",
      l1: "量子计算是「之后会爆」的前沿算力，理论上能指数级加速特定问题(密码、材料、优化)。谷歌、IBM 与 IonQ 等在赛跑，商用还早但想象空间巨大。",
      l2: "用量子比特的叠加与纠缠,在特定问题(分子模拟、优化、密码)上实现指数级加速。仍处早期——比特脆弱、纠错是核心难题,路线有超导、离子阱、光子等。代表:IonQ、Quantinuum、PsiQuantum。",
    }, companyIds: ["ionq", "googl", "ibm"] },
  av_chip: { id: "av_chip", parentId: "chips", type: "category", name: "自驾芯片 · 激光雷达", nameEn: "AV Chips & LiDAR", icon: "cpu",
    levels: {
      l0: "自动驾驶的「眼睛」与「大脑芯片」。",
      l1: "自动驾驶要靠车规 AI 芯片(英伟达 Thor、地平线征程)做实时决策，激光雷达(禾赛、Luminar)提供三维感知，是智能汽车的算力底座。",
      l2: "自动驾驶的「眼睛」(激光雷达/摄像头)与「大脑芯片」(车规 AI SoC),感知硬件决定车能否看清世界。代表:禾赛、Luminar(激光雷达),Mobileye、地平线(自驾芯片)。",
    }, companyIds: ["nvda", "mobileye", "hesai"] },
  nvlink: { id: "nvlink", parentId: "infra", type: "category", name: "高速互联", nameEn: "NVLink", icon: "nvlink",
    levels: { l0: "芯片之间的「高速公路」。", l1: "NVLink 让多张 GPU 高速互联，组成更大的算力集群。", l2: "芯片之间的高速互联,把成百上千张 GPU 连成一个「超级 GPU」。英伟达 NVLink 是私有护城河;UALink 等开放标准试图打破垄断,是 AI 集群性能的关键。" }, companyIds: ["nvda"] },
  network: { id: "network", parentId: "infra", type: "category", name: "网络", nameEn: "Network", icon: "network",
    levels: { l0: "连接成千上万台服务器的网络。", l1: "高速网络把数据中心里的机器连成一台「超级计算机」。", l2: "把成千上万台服务器连成一体的数据中心网络,分以太网与 InfiniBand 两大路线,以及高速交换芯片。AI 训练对带宽极度饥渴。代表:Arista、英伟达(Mellanox)、博通、思科。" }, companyIds: ["avgo", "anet", "nvda"] },
  /* ---------------- 存储层（独立大类：从最快的 HBM 到海量硬盘） ---------------- */
  storage: { id: "storage", parentId: null, type: "layer", name: "存储", nameEn: "STORAGE",
    levels: {
      l0: "AI 的「记忆」——从最快的 HBM 显存到海量硬盘，喂饱 GPU 全靠它。",
      l1: "模型参数与 KV 缓存要放进离芯片最近的 HBM / DRAM，训练数据放 SSD / HDD。存储的带宽与容量正成为 AI 的关键瓶颈，其中 HBM 最为炙手可热。",
      l2: "按「离计算的远近」分层：HBM(片上高带宽显存) → DRAM(主内存) → CXL(内存扩展) → NAND/SSD(闪存) → HDD(冷数据)。HBM 因深度绑定 GPU、供不应求，是当前最紧俏、利润最高的环节。",
    }, companyIds: ["skhynix", "samsung", "mu"] },
  hbm_mem: { id: "hbm_mem", parentId: "storage", type: "category", name: "HBM 高带宽显存", nameEn: "HBM", icon: "storage",
    levels: {
      l0: "贴着 GPU 的超高速显存，AI 芯片最紧的瓶颈、最火的存储赛道。",
      l1: "HBM 用 3D 堆叠把多层 DRAM 与 GPU 一起封装，带宽是普通内存的十几倍。每张 AI GPU 都要配大量 HBM，需求爆炸、长期供不应求。",
      l2: "SK 海力士份额领先，三星、美光紧追；HBM3E 向 HBM4 演进，单价高、利润厚，是存储厂业绩弹性最大的一环。",
    }, companyIds: ["skhynix", "samsung", "mu"] },
  dram_mem: { id: "dram_mem", parentId: "storage", type: "category", name: "DRAM 内存", nameEn: "DRAM",
    levels: { l0: "服务器与 PC 的主内存。", l1: "DDR5 / 服务器 DRAM 是 CPU 的主内存，AI 服务器动辄配上 TB 级内存，需求同样旺盛。", l2: "服务器与 PC 的主内存,速度快但断电即失。AI 关键是 HBM(高带宽内存)——多层 DRAM 堆叠紧贴 GPU 供数据。三巨头:三星、SK 海力士、美光。" }, companyIds: ["samsung", "skhynix", "mu"] },
  nand_ssd: { id: "nand_ssd", parentId: "storage", type: "category", name: "NAND 闪存 / SSD", nameEn: "NAND / SSD",
    levels: { l0: "高速固态存储。", l1: "NAND 闪存组成的企业级 SSD，用高吞吐把 PB 级训练数据快速喂给 GPU，是热数据的主力载体。", l2: "NAND 闪存:断电不丢、速度快,做固态硬盘(SSD),AI 服务器大量采用企业级 SSD。主要厂商:三星、SK 海力士、美光、铠侠、西部数据。" }, companyIds: ["samsung", "skhynix", "mu", "kioxia", "wdc"] },
  hdd_stor: { id: "hdd_stor", parentId: "storage", type: "category", name: "机械硬盘 HDD", nameEn: "HDD",
    levels: { l0: "海量冷数据的低成本仓库。", l1: "大容量机械硬盘存放 PB 级冷数据与备份，单位成本最低，AI 数据湖的底座。", l2: "机械硬盘:每 TB 成本远低于 SSD,是存海量「冷/温数据」(训练集、日志、备份)的首选。AI 数据爆炸让 HDD 重获价值。双雄:希捷、西部数据。" }, companyIds: ["wdc", "stx"] },
  cxl_mem: { id: "cxl_mem", parentId: "storage", type: "category", name: "CXL / 内存扩展", nameEn: "CXL",
    levels: { l0: "给服务器「扩内存」的新总线。", l1: "CXL 让 CPU/GPU 共享并扩展内存池，缓解 AI 的「内存墙」，是新兴高增长方向。", l2: "CXL 是一种新总线协议,让服务器能灵活「扩内存」、在设备间共享内存池,缓解 AI 的「内存墙」,是数据中心架构演进的新方向。" }, companyIds: ["mu", "samsung"] },
  ent_storage: { id: "ent_storage", parentId: "storage", type: "category", name: "企业存储系统", nameEn: "Enterprise Storage",
    levels: { l0: "整套数据存储解决方案。", l1: "全闪存阵列与分布式存储系统，为 AI 训练提供高吞吐、可扩展的数据底座。", l2: "面向企业的整套数据存储解决方案(全闪存阵列等),为 AI 提供高性能、可扩展的数据访问。代表:Pure Storage、VAST Data,以及各大存储厂。" }, companyIds: ["pstg", "vast", "wdc"] },
  neocloud: { id: "neocloud", parentId: "infra", type: "category", name: "AI 云算力", nameEn: "AI Cloud / Neoclouds", icon: "network",
    levels: { l0: "专门出租 GPU 算力的「AI 云」。", l1: "CoreWeave、Lambda、Crusoe 等新型云厂把成千上万张 GPU 打包成云服务出租，是 AI 训练/推理的算力二房东。", l2: "专门出租 GPU 算力的新兴云,不做全套公有云服务,只聚焦 AI 算力,常获英伟达扶持,在 GPU 紧缺时快速崛起。代表:CoreWeave、Nebius、Lambda、Crusoe。" }, companyIds: ["crwv", "lambda", "crusoe"] },
  depin: { id: "depin", parentId: "infra", type: "category", name: "去中心化算力", nameEn: "DePIN Compute", icon: "network",
    levels: {
      l0: "把闲置 GPU 众筹起来的「去中心化算力网」。",
      l1: "用区块链把全球分散的 GPU 聚合成算力市场(io.net、Render、Akash)，以更低价格供 AI 训练/渲染，是 Web3 × AI 的交叉。",
      l2: "去中心化物理基础设施:用区块链激励,把全球闲置 GPU 众筹成分布式算力网,提供比中心化云更便宜、开放的算力。代表:io.net、Akash、Render、Bittensor。",
    }, companyIds: ["ionet", "render"] },
  ai_datacenter: { id: "ai_datacenter", parentId: "infra", type: "category", name: "AI 数据中心 · 地产", nameEn: "Data Centers & REITs", icon: "storage",
    levels: {
      l0: "AI 算力的「厂房」——数据中心与背后的地产。",
      l1: "承载 GPU 集群的物理数据中心与数据中心 REIT(Equinix、Digital Realty、万国数据)，圈地、供电、建楼，是 AI 的不动产。",
      l2: "AI 算力的「厂房」——建设、运营数据中心并出租机房、电力、制冷、网络,背后是房地产与巨额资本。AI 需求让数据中心供不应求。代表:Equinix、Digital Realty、万国数据。",
    }, companyIds: ["eqix", "dlr", "gds"] },
  ai_server: { id: "ai_server", parentId: "infra", type: "category", name: "AI 服务器 · ODM", nameEn: "AI Servers & ODM", icon: "network",
    levels: {
      l0: "把 GPU 组装成整机的 AI 服务器厂。",
      l1: "AI 服务器 ODM/OEM 把 GPU、CPU、内存、散热拼成整机柜(如 GB200 NVL72)，超微、戴尔、工业富联、广达等是英伟达算力落地的组装主力。",
      l2: "把 GPU、内存、网络组装成整机与整机柜的 AI 服务器厂(ODM/品牌),承接英伟达 GB200 等系统的量产。代表:工业富联、广达、纬颖、超微、戴尔、技嘉。",
    }, companyIds: ["smci", "dell", "fii"] },
  connector: { id: "connector", parentId: "infra", type: "category", name: "高速连接 · 铜缆", nameEn: "Connectors & Cables", icon: "nvlink",
    levels: {
      l0: "机柜内高速传数据的连接器与铜缆。",
      l1: "GB200 机柜内用大量高速铜缆(DAC/背板连接器)互联 GPU，安费诺、TE 等连接器巨头是隐形受益者。",
      l2: "机柜内高速传数据的连接器、铜缆(如有源电缆 AEC)。GB200 等整机柜大量用铜互联,又快又省电。代表:安费诺、泰科电子、Credo。",
    }, companyIds: ["amphenol", "te"] },
  pcb: { id: "pcb", parentId: "infra", type: "category", name: "PCB 电路板", nameEn: "PCB", icon: "storage",
    levels: {
      l0: "承载所有芯片的「电路底板」。",
      l1: "高多层/高频 PCB 是 AI 服务器与交换机的基板，AI 拉动高端 PCB 需求，沪电、胜宏等受益。",
      l2: "承载并连接所有芯片的「电路底板」。AI 服务器需高层数、高速材料、高精度 PCB。代表:臻鼎、沪电、胜宏,以及封装载板龙头揖斐电、欣兴。",
    }, companyIds: ["wus", "victory"] },
  ai_infra_sw: { id: "ai_infra_sw", parentId: "infra", type: "category", name: "AI 开发框架", nameEn: "AI Dev Frameworks", icon: "storage",
    levels: { l0: "搭 AI 应用用的软件工具与数据底座。", l1: "向量数据库、编排框架、数据标注与实验管理等，是把大模型接进真实应用的「脚手架」。", l2: "搭 AI 应用的软件工具与数据底座:分布式训练框架、MLOps、向量数据库、推理/编排平台等,让开发者高效地训练、部署、调用模型。代表:Ray、Hugging Face、LangChain、向量数据库。" }, companyIds: ["pinecone", "langchain", "scaleai"] },
  cooling: { id: "cooling", parentId: "energy", type: "category", name: "散热", nameEn: "Cooling", icon: "cooling",
    levels: { l0: "给发烫的芯片降温。", l1: "高密度算力发热惊人，液冷等散热技术正变得越来越关键。", l2: "给发烫的芯片降温。AI 服务器功率密度飙升,风冷压不住,液冷(冷板/浸没)成标配。代表:Vertiv、台达、英维克、奇鋐、双鸿。" }, companyIds: ["vrt"] },
  power: { id: "power", parentId: "energy", type: "category", name: "电力", nameEn: "Power", icon: "power",
    levels: { l0: "给数据中心供电。", l1: "AI 数据中心是「电老虎」，稳定的大功率供电是一切的前提。", l2: "给数据中心供电的整个链条:从电网接入到配电、UPS、备用发电。AI 用电激增让电力成最大瓶颈之一。代表:伊顿、施耐德、Vertiv、Powell。" }, companyIds: ["vrt", "etn"] },
  power_supply: { id: "power_supply", parentId: "energy", type: "category", name: "AI 电源", nameEn: "Power Supply", icon: "power",
    levels: {
      l0: "把电高效转换、送进服务器的电源。",
      l1: "AI 服务器功率飙升，高压直流、高效电源与电源管理芯片(台达、Monolithic Power、Vicor)价值量大增。",
      l2: "把电高效转换、稳定送进服务器的电源(PSU)与电源管理芯片。AI GPU 功耗上千瓦,对供电效率与密度要求极高。代表:台达、光宝、Vicor、芯源系统。",
    }, companyIds: ["delta", "mpwr"] },
  grid: { id: "grid", parentId: "energy", type: "category", name: "电网", nameEn: "Grid", icon: "grid",
    levels: { l0: "输送电力的「大网」。", l1: "AI 用电激增正在考验电网，相关基建需求随之上升。", l2: "输送电力的「大网」——变电、输配电与电网工程。AI 数据中心接入与电网老化带来巨大升级需求。代表:GE Vernova、西门子能源、日立能源、Quanta Services。" }, companyIds: ["etn", "nee"] },
  generation: { id: "generation", parentId: "energy", type: "category", name: "发电", nameEn: "Power Generation",
    levels: { l0: "从源头造出电——AI 抢电时代最上游。", l1: "数据中心就近发电(燃气轮机/发电机组)与可再生能源，是 AI 用电的源头。", l2: "从源头造电——AI 抢电时代最上游,涵盖公用事业、燃气、风光、核电等,稳定的无碳基荷电力最稀缺。代表:NextEra、Constellation、Vistra、GE Vernova。" }, companyIds: ["gev", "cat", "cmi", "nee"] },
  nuclear: { id: "nuclear", parentId: "energy", type: "category", name: "核电 / SMR", nameEn: "Nuclear / SMR",
    levels: { l0: "给 AI 数据中心专属供电的核电与小型堆。", l1: "AI 用电激增让核电与小型模块化反应堆(SMR)重新走红，科技巨头纷纷签长约。", l2: "给 AI 数据中心供电的核电与小型模块化反应堆(SMR):无碳、稳定、大功率,正被科技巨头直接采购;SMR 更小、更快、更灵活但仍需落地。代表:NuScale、X-energy、Kairos、Oklo。" }, companyIds: ["ceg", "vst", "oklo", "smr", "talen"] },
  fusion: { id: "fusion", parentId: "energy", type: "category", name: "核聚变", nameEn: "Fusion",
    levels: {
      l0: "终极清洁能源——「人造太阳」，AI 供电的未来押注。",
      l1: "核聚变一旦商用可提供近乎无限的清洁电力。微软、OpenAI 创始人等已下注 Helion 等公司，是「之后会爆」的方向。",
      l2: "「人造太阳」——聚变清洁能源,是 AI 供电的未来押注。路线有托卡马克、磁惯性、场反位形等,技术极难仍在研发,但一旦成功回报巨大。代表:CFS、Helion、TAE。",
    }, companyIds: ["helion", "cfs", "tae"] },
  uranium: { id: "uranium", parentId: "energy", type: "category", name: "铀 · 核燃料", nameEn: "Uranium & Fuel",
    levels: {
      l0: "核电的「粮食」——铀矿开采与浓缩。",
      l1: "核电与 SMR 复兴带动铀需求，尤其 SMR 需要的高丰度低浓铀(HALEU)供应紧张，是核电链最上游。",
      l2: "核电的「粮食」:铀矿开采与浓缩,以及先进反应堆所需的高丰度铀(HALEU)。核电复兴让铀需求上升。代表:Cameco、Centrus。",
    }, companyIds: ["cameco", "centrus", "nanonuclear"] },
  fuelcell: { id: "fuelcell", parentId: "energy", type: "category", name: "燃料电池", nameEn: "Fuel Cells",
    levels: {
      l0: "在数据中心旁「就地发电」的燃料电池。",
      l1: "燃料电池用天然气/氢气就地高效发电，绕开拥堵的电网，成为 AI 数据中心抢电期的快速供电方案。",
      l2: "在数据中心旁「就地发电」的燃料电池,用天然气/氢电化学发电,绕开电网排队。代表:Bloom Energy、Plug Power。",
    }, companyIds: ["bloom", "plugpower"] },
  transformer: { id: "transformer", parentId: "energy", type: "category", name: "输配电设备", nameEn: "Grid Equipment",
    levels: {
      l0: "变压器、开关柜等——当前最紧缺的电力硬瓶颈。",
      l1: "把电送进数据中心离不开变压器与配电设备，AI 用电激增导致变压器全球性短缺、交期拉长，是电力链的卡点。",
      l2: "变压器、开关柜等输配电设备——当前最紧缺的电力硬瓶颈,交付周期长达数年,AI 数据中心与电网升级让其供不应求。代表:GE Vernova、西门子能源、伊顿、日立能源。",
    }, companyIds: ["hitachienergy", "siemensenergy", "powell", "pwr"] },
  /* ---------------- 光通信层（上游→中游→下游） ---------------- */
  optical: { id: "optical", parentId: null, type: "layer", name: "光通信", nameEn: "OPTICAL",
    levels: {
      l0: "用「光」在 AI 数据中心内外高速搬运数据——AI 算力爆发最直接的受益链之一。",
      l1: "GPU 越多，机器之间要传的数据越爆炸，电信号扛不住，于是改用光。光通信按上游(光芯片)→中游(光模块)→下游(网络设备)分工明确。",
      l2: "上游是激光器/EML 与光 DSP 芯片(技术与利润最集中)，中游把光芯片封装成可插拔光模块(中国厂商出货领先)，下游是消费这些模块的交换机与电信/数据中心网络设备。",
    }, companyIds: ["lite", "cohr", "innolight", "aaoi", "cien"] },
  opt_chip: { id: "opt_chip", parentId: "optical", type: "category", name: "上游·光芯片 / 激光器", nameEn: "Optical Chips & Lasers",
    levels: { l0: "光模块里最核心、毛利最高的「光芯片与激光器」。", l1: "激光器(EML/DFB/VCSEL)、光探测器、驱动器/TIA 与光 DSP/CDR 芯片，是光模块的心脏，技术壁垒与利润最集中。", l2: "光模块里最核心、毛利最高的光芯片与激光器(如 EML、DFB):把电信号变成光,技术门槛极高、能量产者屈指可数,是国产替代的攻坚点。代表:Lumentum、Coherent、源杰。" }, companyIds: ["lite", "cohr", "avgo", "mrvl", "mtsi", "smtc"] },
  opt_module: { id: "opt_module", parentId: "optical", type: "category", name: "中游·光模块厂商", nameEn: "Module Makers", icon: "fiber",
    levels: { l0: "把上游光芯片封装成可插拔的光收发模块。", l1: "800G/1.6T 光模块是 AI 集群组网的「血管接口」；模块厂向上采购光芯片，向下卖给设备商与云厂。", l2: "把上游光芯片封装成可插拔的光收发模块(400G/800G/1.6T),做数据中心「光电转换」。AI 让高速光模块需求爆发。代表:中际旭创、新易盛、Coherent、Fabrinet。" }, companyIds: ["innolight", "aaoi", "fn", "cohr"] },
  opt_network: { id: "opt_network", parentId: "optical", type: "category", name: "下游·通信设备商", nameEn: "Equipment Vendors", icon: "network",
    levels: { l0: "把光模块装进交换机/路由器/光传输设备的通信设备商。", l1: "相干光传输、路由与交换设备把数据中心和电信网连成一体，是光模块的下游买家；再往下是云厂等终端客户。", l2: "把光模块装进交换机、路由器、光传输设备的通信设备商。AI 让数据中心互联(DCI)带宽暴增。代表:Ciena、诺基亚、爱立信、思科。" }, companyIds: ["cien", "nok", "csco", "anet", "jnpr", "eric"] },

  /* ---------------- 芯片层·半导体供应链（深结构） ---------------- */
  foundry: { id: "foundry", parentId: "chips", type: "category", name: "晶圆代工", nameEn: "Foundry",
    levels: { l0: "按设计图把芯片造出来的工厂。", l1: "芯片「设计」与「制造」高度分工，代工厂掌握最先进制程，是 AI 芯片产能的真正瓶颈。", l2: "按设计图把芯片造出来的代工厂。先进制程(3nm/2nm)几乎决定顶级 AI 芯片,高度集中于台积电,其次三星、英特尔;成熟制程有联电等,是芯片制造的核心。" }, companyIds: ["tsm", "samsung", "intc"] },
  packaging: { id: "packaging", parentId: "chips", type: "category", name: "先进封装", nameEn: "Packaging",
    levels: { l0: "把多颗芯片与显存拼装成一个整体。", l1: "CoWoS 等先进封装把 GPU 与 HBM 集成在一起，是当前 AI 芯片最紧的产能卡点。", l2: "把多颗芯粒(chiplet)与 HBM 显存高密度拼装成一个整体(2.5D/3D 先进封装,如 CoWoS),直接决定 AI 芯片性能与良率,是产能瓶颈。代表:台积电、日月光、安靠。" }, companyIds: ["tsm", "ase", "amkr"] },
  equipment: { id: "equipment", parentId: "chips", type: "category", name: "半导体设备", nameEn: "Equipment",
    levels: { l0: "造芯片用的「母机」。", l1: "光刻、刻蚀、量测等设备决定能造多先进的芯片；ASML 的 EUV 光刻机是皇冠上的明珠。", l2: "造芯片用的「母机」:光刻、刻蚀、沉积、量测等设备,极其昂贵、壁垒极高。五巨头:ASML(独家 EUV)、应用材料、泛林、科磊、东京电子。" }, companyIds: ["asml", "amat", "lrcx", "klac"] },
  eda: { id: "eda", parentId: "chips", type: "category", name: "EDA 设计软件", nameEn: "EDA",
    levels: { l0: "设计芯片用的软件工具。", l1: "没有 EDA 就画不出几百亿晶体管的芯片，新思与楷登两家主导。", l2: "设计芯片用的软件工具——没有 EDA 就造不出任何先进芯片。近乎双寡头:新思、楷登。AI 芯片爆发拉动 EDA 需求,AI 也被用进 EDA 本身。" }, companyIds: ["snps", "cdns"] },
  asic_design: { id: "asic_design", parentId: "chips", type: "category", name: "IC 设计服务 · ASIC", nameEn: "ASIC Design & IP",
    levels: {
      l0: "帮云厂/客户把自研 AI 芯片「画」出来的设计服务与 IP。",
      l1: "云巨头做自研 AI ASIC 离不开设计服务(世芯、创意电子)与 IP(晶心 RISC-V、力旺)，台湾在这一环极强，是 AI 定制芯片的隐形赢家。",
      l2: "帮云厂/客户把自研 AI 芯片「画」出来并落地量产的设计服务与 IP。巨头纷纷自研 ASIC 以摆脱英伟达依赖,让这门生意炙手可热。代表:博通、Marvell、世芯、创意电子。",
    }, companyIds: ["alchip", "guc", "andes"] },

  /* ---------------- 材料层（整条链的最上游原料） ---------------- */
  materials: { id: "materials", parentId: null, type: "layer", name: "上游材料", nameEn: "MATERIALS",
    levels: {
      l0: "整条 AI 产业链的源头——造芯片、机器人、电力设备用的原材料。",
      l1: "硅片、光刻胶、电子特气造芯片；稀土永磁做机器人电机；铜撑起电力与线缆；第三代半导体做功率器件。越上游越基础，卡脖子风险也最集中。",
      l2: "半导体材料(硅片/光刻胶/特气/基板/靶材)高度依赖日本与少数厂商；稀土与铜受资源与地缘影响大，是 AI 硬件的隐形命脉。",
    }, companyIds: ["shinetsu", "linde", "mp", "entegris"] },
  silicon_wafer: { id: "silicon_wafer", parentId: "materials", type: "category", name: "硅片 · 衬底", nameEn: "Silicon Wafers",
    levels: { l0: "芯片的「地基」——一切从一片硅开始。", l1: "高纯度单晶硅片是所有芯片的衬底，日本信越、SUMCO 与台湾环球晶圆主导。", l2: "芯片的「地基」——一切从一片高纯硅片开始:超高纯度、超平整、无缺陷,门槛极高、全球集中。代表:信越、SUMCO、环球晶圆。" }, companyIds: ["shinetsu", "sumco", "gwafers"] },
  photoresist: { id: "photoresist", parentId: "materials", type: "category", name: "光刻胶", nameEn: "Photoresist",
    levels: { l0: "把电路图「印」到硅片上的感光材料。", l1: "光刻胶决定能画多细的线路，EUV 光刻胶技术壁垒极高，日企几乎垄断。", l2: "把电路图「印」到硅片上的感光材料,性能决定线路精细度。EUV 光刻胶尤为关键、供应商极少。代表:JSR、东京应化、信越。" }, companyIds: ["jsr", "tok", "shinetsu"] },
  e_gases: { id: "e_gases", parentId: "materials", type: "category", name: "电子特气", nameEn: "Electronic Gases",
    levels: { l0: "芯片制造离不开的各种高纯气体。", l1: "刻蚀、沉积、掺杂都要用高纯特种气体，林德、液化空气等工业气体巨头供应。", l2: "芯片制造每道工序(沉积/刻蚀/清洗)都要用的各种高纯特种气体,晶圆厂旁常配气体供应装置。代表:林德、液化空气。" }, companyIds: ["linde", "airliquide"] },
  substrate: { id: "substrate", parentId: "materials", type: "category", name: "封装基板 · 载板", nameEn: "IC Substrate",
    levels: { l0: "承载芯片、连接主板的高端 PCB。", l1: "ABF 载板是先进封装的关键材料，日本揖斐电、台湾欣兴等主导，AI 芯片带动需求。", l2: "承载芯片、连接主板的高端封装载板(ABF),是高端 GPU 连出上万引脚的「桥」,能做顶级的厂商极少。代表:揖斐电、欣兴、臻鼎。" }, companyIds: ["ibiden", "unimicron"] },
  cmp_mat: { id: "cmp_mat", parentId: "materials", type: "category", name: "CMP · 靶材 · 前驱体", nameEn: "CMP & Precursors",
    levels: { l0: "抛光、镀膜、成膜用的耗材。", l1: "CMP 抛光液/垫、溅射靶材与前驱体是制程耗材，Entegris、Cabot 等供应。", l2: "半导体制造耗材:CMP 抛光液/垫、溅射靶材、前驱体等,用于抛光、镀膜、成膜,随芯片产量稳定增长。代表:CMC(并入恩特格里斯)、恩特格里斯。" }, companyIds: ["entegris", "cabot"] },
  rare_earth: { id: "rare_earth", parentId: "materials", type: "category", name: "稀土 · 永磁", nameEn: "Rare Earth & Magnets",
    levels: { l0: "机器人电机与电动机的「磁芯」。", l1: "钕铁硼永磁是伺服电机、机器人关节、风机的核心，中国主导稀土供应链，地缘敏感。", l2: "稀土永磁(钕铁硼)是机器人关节电机、电动车驱动电机、风机的「磁芯」。稀土开采精炼高度集中于中国,供应链安全是西方关切。代表:金力永磁、MP Materials、Lynas。" }, companyIds: ["mp", "lynas", "jlmag"] },
  copper: { id: "copper", parentId: "materials", type: "category", name: "铜 · 电力金属", nameEn: "Copper",
    levels: { l0: "电力与线缆的「血液」。", l1: "数据中心、电网、电机都离不开大量铜，AI 用电激增推高铜需求，是电气化的基础金属。", l2: "电力与线缆的「血液」——AI 数据中心、电网、设备处处要铜。用电激增让铜需求结构性上升,而铜矿开发慢。代表:自由港、南方铜业。" }, companyIds: ["fcx", "scco"] },
  sic_gan: { id: "sic_gan", parentId: "materials", type: "category", name: "功率半导体 SiC/GaN", nameEn: "SiC / GaN",
    levels: { l0: "更高效的第三代半导体。", l1: "碳化硅(SiC)与氮化镓(GaN)功率器件损耗低、耐高压，用于数据中心供电与充电，能效提升关键。", l2: "第三代半导体(碳化硅 SiC、氮化镓 GaN):比硅更高效地转换电力,用于电动车、快充、数据中心电源。代表:Wolfspeed、英飞凌、Coherent(SiC 衬底)。" }, companyIds: ["wolfspeed", "ifx"] },

  /* ---------------- 太空算力层 ---------------- */
  space: { id: "space", parentId: null, type: "layer", name: "太空算力", nameEn: "SPACE",
    levels: {
      l0: "把 AI 的「连接」与「算力」搬上天——卫星互联与轨道数据中心。",
      l1: "太空是新兴前沿：星链等卫星提供全球连接，可回收火箭把载荷送上轨道，未来甚至在太空建数据中心（不缺阳光、天然散热）。",
      l2: "包含卫星互联、火箭发射、轨道数据中心等方向，与能源(太空太阳能)、网络(星地连接)、芯片(太空 GPU)强相关。",
    }, companyIds: ["spacex", "rklb"] },
  satellite: { id: "satellite", parentId: "space", type: "category", name: "卫星互联", nameEn: "Satellite Internet",
    levels: { l0: "用低轨卫星把网络覆盖到全球每个角落。", l1: "星链等卫星星座提供高速低延迟上网，甚至能直连普通手机。", l2: "用低轨卫星星座把网络覆盖到全球每个角落,甚至直连普通手机、无需地面基站。代表:SpaceX 星链、AST SpaceMobile。" }, companyIds: ["spacex", "asts"] },
  launch: { id: "launch", parentId: "space", type: "category", name: "火箭发射", nameEn: "Launch",
    levels: { l0: "把卫星和算力送上天的运力。", l1: "可回收火箭大幅降低入轨成本，是太空一切的前提。", l2: "把卫星和(未来的)算力送上天的运力——可回收火箭大幅降低发射成本。代表:SpaceX、Rocket Lab。" }, companyIds: ["spacex", "rklb"] },
  orbital_dc: { id: "orbital_dc", parentId: "space", type: "category", name: "轨道数据中心", nameEn: "Orbital DC",
    levels: { l0: "在太空里建 AI 数据中心。", l1: "太空有连续阳光和天然低温，适合放高耗能的 AI 算力，马斯克等正在推进。", l2: "在太空里建 AI 数据中心的前沿设想——利用太空的免费冷却与充足太阳能,仍是早期概念探索。" }, companyIds: ["spacex", "nvda"] },
  sat_ai: { id: "sat_ai", parentId: "space", type: "category", name: "卫星遥感 AI", nameEn: "Satellite Intelligence",
    levels: {
      l0: "用 AI 分析卫星影像看地球。",
      l1: "卫星遥感 AI 把海量对地观测影像用模型解译，做地理情报、灾害监测与商业分析，Planet、BlackSky 等提供数据与分析。",
      l2: "用 AI 分析卫星影像看地球:识别船只、设施、灾害、军事动向,把海量像素变成情报。代表:Planet、BlackSky。",
    }, companyIds: ["planet", "blacksky"] },
};

/* ---------------- 全景图布局（数据驱动渲染） ---------------- */
export interface MapGroup {
  boxes: { id: string; h: number; big?: boolean }[];
  content:
    | { kind: "icons"; cols: 4 | 5; ids: string[] }
    | { kind: "pills"; rows: string[][] }
    | { kind: "factories"; go: string };
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
    content: { kind: "factories", go: "infra" },
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

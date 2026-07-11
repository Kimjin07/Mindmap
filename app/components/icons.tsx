/**
 * Hand-drawn line-art icons for the application row.
 * All share the gold gradient stroke + sketch filter defined in SketchDefs.
 */
import type { ReactNode, JSX } from "react";

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {/* 不再用 url(#sketch) 位移滤镜——地图上有几百个图标，逐个跑 GPU 滤镜会严重卡顿 */}
      <g
        stroke="url(#gold)"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

/** 半透明金色填充（体块）与实心金色（光点），让图标更有体积与科技感。 */
const SOFT = "rgba(216,192,106,0.13)";
const SOLID = "url(#gold)";

/* ---- 应用层：更精细、更高科技的图标 ---- */

export const ChatbotsIcon = () => (
  <Ico>
    {/* 对话气泡 */}
    <path d="M9 12 h27 a5 5 0 0 1 5 5 v11 a5 5 0 0 1 -5 5 H21 l-8 6 v-6 h-4 a5 5 0 0 1 -5 -5 V17 a5 5 0 0 1 5 -5 Z" fill={SOFT} />
    {/* AI 声波 */}
    <path d="M14 22 v4 M19 19 v10 M24 21 v6 M29 18 v12 M34 22 v4" />
    {/* AI 火花 */}
    <path d="M37 8 l1.1 2.6 l2.6 1.1 l-2.6 1.1 l-1.1 2.6 l-1.1 -2.6 l-2.6 -1.1 l2.6 -1.1 Z" fill={SOLID} stroke="none" />
  </Ico>
);

export const DigitalBiologyIcon = () => (
  <Ico>
    {/* 双螺旋两条链 */}
    <path d="M18 8 C 30 13 30 19 24 24 C 18 29 18 35 30 40" fill="none" />
    <path d="M30 8 C 18 13 18 19 24 24 C 30 29 30 35 18 40" fill="none" />
    {/* 碱基对横档 */}
    <path d="M21 12 h6 M20 16 h8 M20 32 h8 M21 36 h6" />
    {/* 端点核苷 */}
    <circle cx="18" cy="8" r="1.3" fill={SOLID} stroke="none" />
    <circle cx="30" cy="8" r="1.3" fill={SOLID} stroke="none" />
    <circle cx="18" cy="40" r="1.3" fill={SOLID} stroke="none" />
    <circle cx="30" cy="40" r="1.3" fill={SOLID} stroke="none" />
  </Ico>
);

export const RobotaxiIcon = () => (
  <Ico>
    {/* 低趴跑车车身（流线楔形） */}
    <path d="M4 33 Q5.5 26 12 24 L19 23.5 Q23 15.5 31 15.5 Q37.5 15.5 40.5 22 L44 30 Q44.2 33 42 33 Z" fill={SOFT} />
    {/* 座舱玻璃 */}
    <path d="M20.5 23 Q23.5 17.2 30.5 17.2 Q34.5 17.2 36.2 20.6 Z" fill="rgba(216,192,106,0.06)" />
    {/* 前大灯 / 进气 */}
    <path d="M5 29.5 h3.4" />
    <path d="M42.4 28.5 h-2.4" opacity="0.7" />
    {/* 轮拱 */}
    <path d="M9.6 33 a4.6 4.6 0 0 1 9.2 0" />
    <path d="M30.4 33 a4.6 4.6 0 0 1 9.2 0" />
    {/* 车轮（低扁运动轮） */}
    <circle cx="14.2" cy="33" r="4.4" fill={SOFT} />
    <circle cx="35" cy="33" r="4.4" fill={SOFT} />
    <circle cx="14.2" cy="33" r="1.5" fill={SOLID} stroke="none" />
    <circle cx="35" cy="33" r="1.5" fill={SOLID} stroke="none" />
    {/* 顶部激光雷达 + 自动驾驶扫描弧 */}
    <path d="M28.4 15.5 a2 2 0 0 1 4 0 Z" fill={SOFT} />
    <circle cx="30.4" cy="14" r="0.8" fill={SOLID} stroke="none" />
    <path d="M34 12.6 a6.5 6.5 0 0 1 3.4 3.8" opacity="0.6" />
    <path d="M37 10.8 a9.5 9.5 0 0 1 4 5" opacity="0.4" />
    {/* 地面 */}
    <path d="M4 38.4 h40" opacity="0.45" />
  </Ico>
);

export const EnterpriseIcon = () => (
  <Ico>
    {/* 叠层服务器 / 数据 */}
    <rect x="8" y="28" width="22" height="7" rx="1.6" fill={SOFT} />
    <rect x="8" y="19.5" width="22" height="7" rx="1.6" fill={SOFT} />
    <rect x="8" y="11" width="22" height="7" rx="1.6" fill={SOFT} />
    <circle cx="12" cy="14.5" r="1" fill={SOLID} stroke="none" />
    <circle cx="12" cy="23" r="1" fill={SOLID} stroke="none" />
    <circle cx="12" cy="31.5" r="1" fill={SOLID} stroke="none" />
    <path d="M17 14.5 h9 M17 23 h9 M17 31.5 h9" />
    {/* AI 智能体头 */}
    <rect x="31" y="12" width="11" height="9.5" rx="2.4" fill={SOFT} />
    <path d="M36.5 12 v-2.5" />
    <circle cx="36.5" cy="8.5" r="1.1" fill={SOLID} stroke="none" />
    <circle cx="34.2" cy="16.4" r="1.1" fill={SOLID} stroke="none" />
    <circle cx="38.8" cy="16.4" r="1.1" fill={SOLID} stroke="none" />
    <path d="M36.5 21.5 v3 h-6" opacity="0.7" />
  </Ico>
);

export const ScienceIcon = () => (
  <Ico>
    <ellipse cx="24" cy="24" rx="16" ry="6.6" />
    <ellipse cx="24" cy="24" rx="16" ry="6.6" transform="rotate(60 24 24)" />
    <ellipse cx="24" cy="24" rx="16" ry="6.6" transform="rotate(120 24 24)" />
    <circle cx="24" cy="24" r="3" fill={SOLID} stroke="none" />
    <circle cx="40" cy="24" r="1.5" fill={SOLID} stroke="none" />
    <circle cx="16" cy="10.1" r="1.5" fill={SOLID} stroke="none" />
    <circle cx="16" cy="37.9" r="1.5" fill={SOLID} stroke="none" />
  </Ico>
);

export const RoboticsIcon = () => (
  <Ico>
    {/* 头 + 天线 + 眼 */}
    <rect x="17" y="7" width="14" height="11" rx="3.4" fill={SOFT} />
    <path d="M24 7 V4" />
    <circle cx="24" cy="3" r="1.3" fill={SOLID} stroke="none" />
    <circle cx="21.3" cy="12.5" r="1.3" fill={SOLID} stroke="none" />
    <circle cx="26.7" cy="12.5" r="1.3" fill={SOLID} stroke="none" />
    {/* 躯干 */}
    <path d="M18 20 h12 v12 a2 2 0 0 1 -2 2 H20 a2 2 0 0 1 -2 -2 Z" fill={SOFT} />
    <path d="M24 22 v8 M20 26 h8" opacity="0.7" />
    {/* 手臂：一只挥手 */}
    <path d="M18 22 l-5 -2 l-1.5 -5" />
    <path d="M30 23 l4.5 4 v4" />
    {/* 腿 */}
    <path d="M21.5 34 v5 M26.5 34 v5" />
  </Ico>
);

export const ManufacturingIcon = () => (
  <Ico>
    {/* 底座 */}
    <rect x="9" y="33" width="10" height="5" rx="1.2" fill={SOFT} />
    {/* 机械臂两段 + 关节 */}
    <path d="M14 33 l4 -11" />
    <circle cx="18" cy="22" r="1.8" fill={SOFT} />
    <path d="M18 22 l13 -3.5" />
    <circle cx="31" cy="18.5" r="1.4" fill={SOFT} />
    {/* 夹爪 */}
    <path d="M31 18.5 l3.2 1.8 M31 18.5 l3.2 -1.6" />
    {/* 被搬运的箱子 */}
    <rect x="33.5" y="19" width="8.5" height="8.5" rx="1" fill={SOFT} />
    <path d="M33.5 23.2 h8.5" opacity="0.7" />
    {/* 传送带 */}
    <path d="M6 40 h36" />
    <path d="M10 40 v-1 M18 40 v-1 M26 40 v-1 M34 40 v-1" opacity="0.7" />
  </Ico>
);

export const AICoderIcon = () => (
  <Ico>
    {/* 终端窗口 */}
    <rect x="7" y="10" width="34" height="28" rx="4" fill={SOFT} />
    <path d="M7 17 h34" />
    <circle cx="11" cy="13.5" r="0.95" fill={SOLID} stroke="none" />
    <circle cx="14.5" cy="13.5" r="0.95" fill={SOLID} stroke="none" />
    <circle cx="18" cy="13.5" r="0.95" fill={SOLID} stroke="none" />
    {/* 代码尖括号 + 斜杠 */}
    <path d="M19 24 l-4.5 4.5 l4.5 4.5 M29 24 l4.5 4.5 l-4.5 4.5" />
    <path d="M26.5 22 l-4.5 13" />
    {/* 光标 */}
    <rect x="31.5" y="31.5" width="4.5" height="2" rx="0.6" fill={SOLID} stroke="none" />
  </Ico>
);

/* ---- infrastructure / chips / energy icons ---- */

export const GPUIcon = () => (
  <Ico>
    <rect x="6" y="14" width="36" height="20" rx="2" />
    <circle cx="17" cy="24" r="5" />
    <path d="M17 19 v10 M12 24 h10" />
    <path d="M28 20 h9 M28 24 h9 M28 28 h9" />
    <path d="M12 34 v4 M21 34 v4 M31 34 v4" />
  </Ico>
);

export const CPUIcon = () => (
  <Ico>
    <rect x="14" y="14" width="20" height="20" rx="2" />
    <rect x="20" y="20" width="8" height="8" rx="1" />
    <path d="M19 14 v-4 M24 14 v-4 M29 14 v-4" />
    <path d="M19 34 v4 M24 34 v4 M29 34 v4" />
    <path d="M14 19 h-4 M14 24 h-4 M14 29 h-4" />
    <path d="M34 19 h4 M34 24 h4 M34 29 h4" />
  </Ico>
);

export const DPUIcon = () => (
  <Ico>
    <rect x="13" y="14" width="22" height="20" rx="2" />
    <path d="M17 21 h12 l-3 -3 M29 21 l-3 3" />
    <path d="M31 27 h-12 l3 -3 M19 27 l3 3" />
    <path d="M19 14 v-3 M29 14 v-3 M19 34 v3 M29 34 v3" />
    <path d="M13 20 h-3 M13 28 h-3 M35 20 h3 M35 28 h3" />
  </Ico>
);

export const NVLinkIcon = () => (
  <Ico>
    <rect x="6" y="17" width="13" height="14" rx="2" />
    <rect x="29" y="17" width="13" height="14" rx="2" />
    <path d="M20 21 h8 l-3 -3 M28 21 l-3 3" />
    <path d="M28 27 h-8 l3 -3 M20 27 l3 3" />
    <path d="M10 21 h5 M10 27 h5 M33 21 h5 M33 27 h5" />
  </Ico>
);

export const NetworkIcon = () => (
  <Ico>
    <circle cx="24" cy="12" r="3.4" />
    <circle cx="11" cy="34" r="3.4" />
    <circle cx="24" cy="34" r="3.4" />
    <circle cx="37" cy="34" r="3.4" />
    <path d="M24 15.4 L13 31 M24 15.4 V30.6 M24 15.4 L35 31" />
  </Ico>
);

export const StorageIcon = () => (
  <Ico>
    <ellipse cx="24" cy="12" rx="13" ry="4.5" />
    <path d="M11 12 v24 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5 V12" />
    <path d="M11 21 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5" />
    <path d="M11 30 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5" />
  </Ico>
);

export const CoolingIcon = () => (
  <Ico>
    <path d="M24 7 V41" />
    <path d="M9 15.5 L39 32.5" />
    <path d="M39 15.5 L9 32.5" />
    <path d="M21 11 l3 -3 l3 3 M21 37 l3 3 l3 -3" />
    <path d="M12 13 l1 4 l4 -1 M36 13 l-1 4 l-4 -1" />
    <path d="M12 35 l1 -4 l4 1 M36 35 l-1 -4 l-4 1" />
  </Ico>
);

export const PowerIcon = () => (
  <Ico>
    <path d="M27 6 L13 27 H22 L20 42 L35 20 H25 Z" />
  </Ico>
);

export const GridIcon = () => (
  <Ico>
    <path d="M15 40 L23 9 H25 L33 40" />
    <path d="M11 40 H37" />
    <path d="M18 22 H30 M16 30 H32" />
    <path d="M18 22 L30 30 M30 22 L18 30" />
    <path d="M23 9 H25" />
  </Ico>
);

export const FiberIcon = () => (
  <Ico>
    <rect x="18" y="29" width="12" height="10" rx="1.5" />
    <path d="M22 29 V22 M26 29 V22" />
    <path d="M22 22 C 19 15 14 12 11 9" />
    <path d="M24 22 V7" />
    <path d="M26 22 C 29 15 34 12 37 9" />
    <circle cx="11" cy="9" r="1.2" />
    <circle cx="24" cy="7" r="1.2" />
    <circle cx="37" cy="9" r="1.2" />
  </Ico>
);

/* =========================================================================
 * 每个「城市」（细分赛道）的专属主题图标 —— 用于世界地图城市标记
 * ========================================================================= */

/* ---- 应用层新增 ---- */
export const GenMediaIcon = () => (<Ico><rect x="9" y="14" width="30" height="22" rx="3" fill={SOFT} /><path d="M9 20 h30" /><path d="M13 14 l3 6 M20 14 l3 6 M27 14 l3 6" /><path d="M21 24 l7 4 l-7 4 Z" fill={SOLID} stroke="none" /></Ico>);
export const SearchAIIcon = () => (<Ico><circle cx="21" cy="21" r="10" fill={SOFT} /><path d="M28.5 28.5 L38 38" /><path d="M21 15 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill={SOLID} stroke="none" /></Ico>);
export const HealthAIIcon = () => (<Ico><rect x="8" y="12" width="32" height="24" rx="4" fill={SOFT} /><path d="M12 24 h6 l3 -7 l4 14 l3 -7 h8" /></Ico>);
export const DesignAIIcon = () => (<Ico><path d="M13 35 l3 -12 l13 -13 l6 6 l-13 13 Z" fill={SOFT} /><path d="M16 23 l6 6" /><path d="M13 35 l4.5 -1.2 l-3.3 -3.3 Z" fill={SOLID} stroke="none" /><path d="M35 9 l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 Z" fill={SOLID} stroke="none" /></Ico>);
export const EdgeAIIcon = () => (<Ico><rect x="16" y="7" width="16" height="34" rx="3.5" fill={SOFT} /><path d="M21 11 h6" /><circle cx="24" cy="37" r="1.2" /><rect x="20" y="18" width="8" height="8" rx="1" /><path d="M22.5 18 v-1.5 M25.5 18 v-1.5 M22.5 26 v1.5 M25.5 26 v1.5" /></Ico>);
export const AdIcon = () => (<Ico><path d="M9 20 l17 -5 v18 l-17 -5 Z" fill={SOFT} /><path d="M26 15 a10 10 0 0 1 0 18" /><path d="M9 28 v6 h4 v-5" /><path d="M31 20 h4 M32 24 h4 M31 28 h4" opacity="0.65" /></Ico>);
export const FinanceIcon = () => (<Ico><rect x="8" y="10" width="32" height="28" rx="3" fill={SOFT} /><path d="M12 31 l6 -6 l5 4 l10 -13" /><path d="M33 16 h4 v4" /><circle cx="30" cy="31" r="3" /><path d="M30 29 v4 M28.6 30 h2.8" opacity="0.7" /></Ico>);
export const EduIcon = () => (<Ico><path d="M24 12 L42 20 L24 28 L6 20 Z" fill={SOFT} /><path d="M14 23 v7 c0 2 4.5 4 10 4 s10 -2 10 -4 v-7" /><path d="M42 20 v9" /><circle cx="42" cy="30" r="1.4" fill={SOLID} stroke="none" /></Ico>);
export const VoiceIcon = () => (<Ico><rect x="19" y="9" width="10" height="19" rx="5" fill={SOFT} /><path d="M14 24 a10 10 0 0 0 20 0" /><path d="M24 34 v4 M18 38 h12" /><path d="M10 18 q-2 4 0 8 M38 18 q2 4 0 8" opacity="0.6" /></Ico>);
export const SecurityIcon = () => (<Ico><path d="M24 7 l15 5 v9 c0 10 -6.5 15 -15 19 c-8.5 -4 -15 -9 -15 -19 v-9 Z" fill={SOFT} /><path d="M17 24 l4.5 4.5 l9 -10" /></Ico>);
export const AgentIcon = () => (<Ico><rect x="13" y="13" width="22" height="17" rx="4" fill={SOFT} /><path d="M24 13 v-3.5" /><circle cx="24" cy="8" r="1.5" fill={SOLID} stroke="none" /><circle cx="19.5" cy="21" r="1.7" fill={SOLID} stroke="none" /><circle cx="28.5" cy="21" r="1.7" fill={SOLID} stroke="none" /><path d="M20 26 h8" /><path d="M29 31 l7 6 l-3 0.6 l1.8 3.4 l-2.2 1.1 l-1.8 -3.4 l-2.3 1.7 Z" fill={SOLID} stroke="none" /></Ico>);
export const RobotPartsIcon = () => (<Ico><circle cx="20" cy="22" r="8" fill={SOFT} /><circle cx="20" cy="22" r="3" /><path d="M20 11 v3 M20 30 v3 M9 22 h3 M28 22 h0 M12.5 14.5 l2.2 2.2 M25.3 27.3 l2.2 2.2 M25.5 14.5 l2 -2 M12.5 29.5 l2 -2" /><rect x="30" y="25" width="11" height="5" rx="1.5" fill={SOFT} /><path d="M33 25 v5 M36 25 v5 M39 25 v5" opacity="0.6" /></Ico>);

/* ---- 模型层 ---- */
export const LLMIcon = () => (<Ico><rect x="9" y="10" width="30" height="28" rx="4" fill={SOFT} /><path d="M14 18 h20 M14 24 h20 M14 30 h13" /><circle cx="31" cy="30" r="2.4" fill={SOLID} stroke="none" /></Ico>);
export const VLMIcon = () => (<Ico><path d="M6 24 Q24 12 42 24 Q24 36 6 24 Z" fill={SOFT} /><circle cx="24" cy="24" r="5" /><circle cx="24" cy="24" r="1.8" fill={SOLID} stroke="none" /></Ico>);
export const VLAIcon = () => (<Ico><path d="M5 22 Q20 11 35 22 Q20 33 5 22 Z" fill={SOFT} /><circle cx="20" cy="22" r="4" /><circle cx="20" cy="22" r="1.4" fill={SOLID} stroke="none" /><path d="M31 34 l8 -3 l-2.5 8" /><path d="M22 26 q7 7 15 4" /></Ico>);
export const MMLLMIcon = () => (<Ico><circle cx="19" cy="20" r="9" fill={SOFT} /><circle cx="29" cy="20" r="9" fill={SOFT} /><circle cx="24" cy="29" r="9" fill={SOFT} /></Ico>);
export const GPTIcon = () => (<Ico><rect x="12" y="10" width="24" height="7" rx="2" fill={SOFT} /><rect x="12" y="20.5" width="24" height="7" rx="2" fill={SOFT} /><rect x="12" y="31" width="24" height="7" rx="2" fill={SOFT} /><path d="M18 17 v3.5 M30 17 v3.5 M24 27.5 v3.5" /></Ico>);
export const DMIcon = () => (<Ico><rect x="8" y="11" width="32" height="26" rx="3" fill={SOFT} /><circle cx="17" cy="19" r="2.6" fill={SOLID} stroke="none" /><path d="M8 31 l9 -9 l6 6 l7 -8 l10 11" /></Ico>);
export const GNNIcon = () => (<Ico><circle cx="12" cy="14" r="3" fill={SOFT} /><circle cx="36" cy="16" r="3" fill={SOFT} /><circle cx="24" cy="34" r="3" fill={SOFT} /><circle cx="25" cy="20" r="3" fill={SOFT} /><path d="M14.5 15.5 L22.5 18.5 M33.2 17 L27.5 19 M24.5 23 L24 31" /></Ico>);
export const MOEIcon = () => (<Ico><circle cx="9" cy="24" r="3" fill={SOFT} /><rect x="30" y="10" width="11" height="6" rx="1.5" fill={SOFT} /><rect x="30" y="21" width="11" height="6" rx="1.5" fill={SOFT} /><rect x="30" y="32" width="11" height="6" rx="1.5" fill={SOFT} /><path d="M12 24 L30 13 M12 24 h18 M12 24 L30 35" /></Ico>);
export const SSMIcon = () => (<Ico><path d="M5 24 q5 -13 10 0 t10 0 t10 0 t8 0" /><circle cx="5" cy="24" r="1.7" fill={SOLID} stroke="none" /><circle cx="43" cy="24" r="1.7" fill={SOLID} stroke="none" /></Ico>);
export const LBMIcon = () => (<Ico><circle cx="27" cy="11" r="3.2" fill={SOFT} /><path d="M27 14.5 l-4 9 l-6 3 M23.5 23.5 l6 4 l-1 8 M17 26.5 l-4 6" /></Ico>);

/* ---- 基础设施 ---- */
export const NeoCloudIcon = () => (<Ico><path d="M13 31 a7 7 0 0 1 1 -14 a9.5 9.5 0 0 1 18 -1 a6.5 6.5 0 0 1 1 15 Z" fill={SOFT} /><rect x="19" y="23" width="11" height="9" rx="1" /><path d="M22 23 v-2 M27 23 v-2 M22 32 v2 M27 32 v2" /></Ico>);
export const InfraSWIcon = () => (<Ico><ellipse cx="19" cy="14" rx="9" ry="3.5" fill={SOFT} /><path d="M10 14 v14 c0 2 4 3.5 9 3.5 s9 -1.5 9 -3.5 V14" fill={SOFT} /><path d="M10 21 c0 2 4 3.5 9 3.5 s9 -1.5 9 -3.5" /><circle cx="35" cy="31" r="4" /><path d="M35 25.5 v-2 M35 36.5 v2 M40.5 31 h2 M29.5 31 h-2" /></Ico>);
export const DataCenterIcon = () => (<Ico><rect x="12" y="9" width="24" height="30" rx="1.5" fill={SOFT} /><path d="M12 17 h24 M12 25 h24 M12 33 h24" /><path d="M16 13 h4 M24 13 h4 M16 21 h4 M24 21 h4 M16 29 h4 M24 29 h4" /><path d="M7 39 h34" /></Ico>);
export const AIServerIcon = () => (<Ico><rect x="14" y="8" width="20" height="32" rx="2.5" fill={SOFT} /><path d="M18 13 h12 M18 18 h12 M18 23 h12 M18 28 h12 M18 33 h12" /><circle cx="31" cy="13" r="1" fill={SOLID} stroke="none" /><circle cx="31" cy="18" r="1" fill={SOLID} stroke="none" /></Ico>);
export const ConnectorIcon = () => (<Ico><rect x="7" y="18" width="15" height="12" rx="2.5" fill={SOFT} /><path d="M22 22 h7 M22 26 h7" /><rect x="29" y="16" width="12" height="16" rx="2.5" fill={SOFT} /><path d="M33 21 h4 M33 27 h4" /></Ico>);
export const PCBIcon = () => (<Ico><rect x="9" y="9" width="30" height="30" rx="3" fill={SOFT} /><circle cx="16" cy="16" r="1.7" fill={SOLID} stroke="none" /><circle cx="32" cy="32" r="1.7" fill={SOLID} stroke="none" /><circle cx="32" cy="16" r="1.7" fill={SOLID} stroke="none" /><path d="M16 16 h11 v11 M32 16 v7 h-6 M16 24 v9 h11" /></Ico>);

/* ---- 芯片 ---- */
export const AIAccelIcon = () => (<Ico><rect x="12" y="14" width="24" height="20" rx="2" fill={SOFT} /><path d="M18 14 v-3 M24 14 v-3 M30 14 v-3 M18 34 v3 M24 34 v3 M30 34 v3 M12 20 h-3 M12 28 h-3 M36 20 h3 M36 28 h3" /><path d="M27 17 l-7 9 h5 l-3 6 l8 -10 h-5 Z" fill={SOLID} stroke="none" /></Ico>);
export const QuantumIcon = () => (<Ico><circle cx="24" cy="24" r="12" fill={SOFT} /><ellipse cx="24" cy="24" rx="12" ry="4.6" /><path d="M24 24 L31 15" /><circle cx="31" cy="15" r="1.7" fill={SOLID} stroke="none" /><circle cx="24" cy="24" r="1.5" fill={SOLID} stroke="none" /></Ico>);
export const AVChipIcon = () => (<Ico><rect x="10" y="15" width="28" height="19" rx="2" fill={SOFT} /><path d="M16 15 v-3 M24 15 v-3 M32 15 v-3 M16 34 v3 M24 34 v3 M32 34 v3" /><path d="M16 28 l1.6 -5 h12.8 l1.6 5 Z" /><circle cx="19.5" cy="29" r="1.1" /><circle cx="28.5" cy="29" r="1.1" /></Ico>);
export const FoundryIcon = () => (<Ico><circle cx="24" cy="24" r="14" fill={SOFT} /><path d="M11 19 h26 M11 24 h26 M11 29 h26 M19 11 v26 M24 11 v26 M29 11 v26" opacity="0.85" /><path d="M22 10.4 l4 0.2" /></Ico>);
export const PackagingIcon = () => (<Ico><rect x="8" y="30" width="32" height="6" rx="1" fill={SOFT} /><rect x="12" y="20" width="12" height="10" rx="1" fill={SOFT} /><rect x="26" y="17" width="10" height="13" rx="1" fill={SOFT} /><path d="M26 21 h10 M26 25 h10" /><path d="M12 36 v2 M20 36 v2 M28 36 v2 M36 36 v2" /></Ico>);
export const EquipmentIcon = () => (<Ico><rect x="16" y="9" width="16" height="24" rx="2" fill={SOFT} /><path d="M24 33 v5 M13 38 h22" /><path d="M24 13 v15" /><circle cx="24" cy="13" r="2.3" fill={SOLID} stroke="none" /><path d="M19 28 h10" /></Ico>);
export const EDAIcon = () => (<Ico><path d="M14 12 h8 a10 10 0 0 1 0 24 h-8 Z" fill={SOFT} /><path d="M8 18 h6 M8 30 h6 M32 24 h8" /><circle cx="41" cy="24" r="1.5" /></Ico>);

/* ---- 能源 ---- */
export const GenerationIcon = () => (<Ico><circle cx="18" cy="21" r="7" fill={SOFT} /><path d="M18 21 v-5.5 M18 21 l4.8 2.8 M18 21 l-4.8 2.8" /><circle cx="18" cy="21" r="1.4" fill={SOLID} stroke="none" /><path d="M28 34 v-10 h8 v10 Z" fill={SOFT} /><path d="M30 24 q2 -5 4 0" opacity="0.7" /><path d="M8 38 h34" /></Ico>);
export const NuclearIcon = () => (<Ico><path d="M12 34 a12 12 0 0 1 24 0 Z" fill={SOFT} /><ellipse cx="24" cy="28" rx="6.5" ry="2.6" /><ellipse cx="24" cy="28" rx="6.5" ry="2.6" transform="rotate(60 24 28)" /><ellipse cx="24" cy="28" rx="6.5" ry="2.6" transform="rotate(120 24 28)" /><circle cx="24" cy="28" r="1.7" fill={SOLID} stroke="none" /><path d="M8 34 h32" /></Ico>);
export const FusionIcon = () => (<Ico><ellipse cx="24" cy="24" rx="15" ry="6.4" fill={SOFT} /><circle cx="24" cy="24" r="9" fill={SOFT} /><circle cx="24" cy="24" r="3.2" fill={SOLID} stroke="none" /><path d="M24 9 v-3 M24 42 v-3 M9 24 h-3 M39 24 h3" opacity="0.7" /></Ico>);
export const UraniumIcon = () => (<Ico><path d="M24 9 l11 8 l-4 17 h-14 l-4 -17 Z" fill={SOFT} /><circle cx="24" cy="23" r="1.5" fill={SOLID} stroke="none" /><path d="M24 23 v7 M24 23 l6 -3.5 M24 23 l-6 -3.5" opacity="0.7" /></Ico>);
export const FuelCellIcon = () => (<Ico><rect x="12" y="15" width="24" height="19" rx="2" fill={SOFT} /><path d="M12 21 h24 M12 27.5 h24" /><path d="M21 9 q4 4 0 6 q-4 -2 0 -6 Z" fill={SOLID} stroke="none" /><path d="M20 34 v4 M28 34 v4" /></Ico>);
export const TransformerIcon = () => (<Ico><path d="M15 13 v22 M33 13 v22" /><path d="M15 16 q6.5 0 6.5 3 q-6.5 0 -6.5 3 q6.5 0 6.5 3 q-6.5 0 -6.5 3" /><path d="M33 16 q-6.5 0 -6.5 3 q6.5 0 6.5 3 q-6.5 0 -6.5 3 q6.5 0 6.5 3" /></Ico>);
export const PowerSupplyIcon = () => (<Ico><rect x="9" y="16" width="25" height="16" rx="2" fill={SOFT} /><path d="M34 20 h4 v8 h-4" /><path d="M22 18 l-5 7 h4.5 l-2.5 7 l7 -9 h-4.5 l2.5 -5 Z" fill={SOLID} stroke="none" /></Ico>);

/* ---- 光通信 ---- */
export const OptChipIcon = () => (<Ico><rect x="9" y="18" width="13" height="12" rx="2" fill={SOFT} /><path d="M22 24 h17" /><path d="M31 20 l8 4 l-8 4" opacity="0.7" /><circle cx="15.5" cy="24" r="1.7" fill={SOLID} stroke="none" /></Ico>);
export const OptNetIcon = () => (<Ico><rect x="9" y="20" width="28" height="11" rx="2" fill={SOFT} /><circle cx="15" cy="25.5" r="1.2" fill={SOLID} stroke="none" /><circle cx="19" cy="25.5" r="1.2" fill={SOLID} stroke="none" /><path d="M28 20 l4 -6 M32 25.5 h6 M28 31 l4 6" opacity="0.7" /></Ico>);

/* ---- 太空 ---- */
export const SatelliteIcon = () => (<Ico><rect x="20" y="18" width="8" height="12" rx="1.5" fill={SOFT} /><rect x="5" y="20" width="12" height="8" rx="1" fill={SOFT} /><rect x="31" y="20" width="12" height="8" rx="1" fill={SOFT} /><path d="M9 20 v8 M13 20 v8 M35 20 v8 M39 20 v8" /><path d="M24 18 v-4" /><circle cx="24" cy="12" r="1.6" fill={SOLID} stroke="none" /></Ico>);
export const LaunchIcon = () => (<Ico><path d="M24 6 q6.5 6 6.5 18 v6 h-13 v-6 q0 -12 6.5 -18 Z" fill={SOFT} /><circle cx="24" cy="18" r="2.4" /><path d="M17.5 27 l-5 6 h5 M30.5 27 l5 6 h-5" fill={SOFT} /><path d="M21 33 l3 8 l3 -8" fill={SOLID} stroke="none" /></Ico>);
export const OrbitalDCIcon = () => (<Ico><ellipse cx="24" cy="24" rx="18" ry="7.5" transform="rotate(-20 24 24)" /><rect x="18" y="18" width="12" height="12" rx="1.5" fill={SOFT} /><path d="M21 22 h6 M21 26 h6" /><circle cx="38" cy="17" r="1.5" fill={SOLID} stroke="none" /></Ico>);
export const SatAIIcon = () => (<Ico><circle cx="18" cy="30" r="8" fill={SOFT} /><path d="M12 27 q6 3 12 0 M13 33 q5 2 10 0" opacity="0.7" /><rect x="30" y="9" width="9" height="6" rx="1" fill={SOFT} /><path d="M34 15 L23 26" opacity="0.7" /><path d="M31 17 L25 23 M37 17 L27 27" opacity="0.5" /></Ico>);

/* ---- 存储 ---- */
export const HBMIcon = () => (<Ico><rect x="14" y="11" width="20" height="5" rx="1" fill={SOFT} /><rect x="14" y="18" width="20" height="5" rx="1" fill={SOFT} /><rect x="14" y="25" width="20" height="5" rx="1" fill={SOFT} /><rect x="12" y="32" width="24" height="6" rx="1" fill={SOFT} /><path d="M18 38 v2 M24 38 v2 M30 38 v2" /></Ico>);
export const DRAMIcon = () => (<Ico><rect x="8" y="18" width="32" height="14" rx="1.5" fill={SOFT} /><rect x="12" y="21" width="5" height="8" rx="1" /><rect x="19" y="21" width="5" height="8" rx="1" /><rect x="26" y="21" width="5" height="8" rx="1" /><rect x="33" y="21" width="4" height="8" rx="1" /><path d="M14 32 v3 M24 32 v3 M34 32 v3" /></Ico>);
export const NANDIcon = () => (<Ico><rect x="10" y="14" width="28" height="20" rx="2" fill={SOFT} /><path d="M16 14 v-2 M24 14 v-2 M32 14 v-2 M16 34 v2 M24 34 v2 M32 34 v2" /><path d="M18 22 h12 M18 26 h8" /><circle cx="31" cy="26" r="1.5" fill={SOLID} stroke="none" /></Ico>);
export const HDDIcon = () => (<Ico><circle cx="22" cy="24" r="13" fill={SOFT} /><circle cx="22" cy="24" r="3.5" /><circle cx="22" cy="24" r="1" fill={SOLID} stroke="none" /><path d="M34 12 L26 22" /><circle cx="34" cy="12" r="1.8" /></Ico>);
export const CXLIcon = () => (<Ico><rect x="9" y="16" width="14" height="16" rx="2" fill={SOFT} /><path d="M12 20 h8 M12 24 h8 M12 28 h8" /><path d="M23 24 h13 M31 20 l5 4 l-5 4" /><rect x="34" y="20" width="6" height="8" rx="1" fill={SOFT} /></Ico>);
export const EntStorageIcon = () => (<Ico><rect x="10" y="12" width="28" height="7" rx="1.5" fill={SOFT} /><rect x="10" y="21" width="28" height="7" rx="1.5" fill={SOFT} /><rect x="10" y="30" width="28" height="7" rx="1.5" fill={SOFT} /><circle cx="14" cy="15.5" r="1" fill={SOLID} stroke="none" /><circle cx="14" cy="24.5" r="1" fill={SOLID} stroke="none" /><circle cx="14" cy="33.5" r="1" fill={SOLID} stroke="none" /><path d="M30 15.5 h4 M30 24.5 h4 M30 33.5 h4" /></Ico>);

/* ---- 材料 ---- */
export const WaferIcon = () => (<Ico><path d="M24 10 a14 14 0 1 1 -9.5 3.7 Z" fill={SOFT} /><path d="M17 14.5 a13 13 0 0 1 14.5 0.5" opacity="0.55" /><circle cx="24" cy="24" r="6" opacity="0.55" /></Ico>);
export const PhotoresistIcon = () => (<Ico><rect x="19" y="10" width="10" height="15" rx="2" fill={SOFT} /><path d="M21 10 v-2 h6 v2" /><path d="M24 27 q3.2 4.5 0 6.5 q-3.2 -2 0 -6.5 Z" fill={SOLID} stroke="none" /><path d="M11 38 h26" opacity="0.6" /><path d="M20 25 h8" /></Ico>);
export const GasIcon = () => (<Ico><rect x="18" y="12" width="12" height="26" rx="6" fill={SOFT} /><rect x="21" y="7" width="6" height="6" rx="1.5" fill={SOFT} /><path d="M20 20 h8 M20 26 h8 M20 32 h8" opacity="0.7" /></Ico>);
export const SubstrateIcon = () => (<Ico><rect x="8" y="20" width="32" height="10" rx="1.5" fill={SOFT} /><path d="M8 25 h32" opacity="0.6" /><path d="M12 30 v3 M18 30 v3 M24 30 v3 M30 30 v3 M36 30 v3" /><rect x="18" y="14" width="12" height="6" rx="1" fill={SOFT} /></Ico>);
export const CMPIcon = () => (<Ico><circle cx="24" cy="26" r="13" fill={SOFT} /><circle cx="24" cy="26" r="6" /><path d="M24 8 v6" /><circle cx="24" cy="8" r="1.7" fill={SOLID} stroke="none" /><path d="M15 26 a9 9 0 0 1 18 0" opacity="0.5" /></Ico>);
export const RareEarthIcon = () => (<Ico><path d="M16 12 v13 a8 8 0 0 0 16 0 V12" fill={SOFT} /><path d="M11 12 h9 M28 12 h9" /><path d="M13 12 v-3 h5 v3 M30 12 v-3 h5 v3" /></Ico>);
export const CopperIcon = () => (<Ico><path d="M10 29 l4 -6 h20 l4 6 Z" fill={SOFT} /><path d="M10 29 h28 v6 h-28 Z" fill={SOFT} /><path d="M16 23 l-2.5 6 M24 23 v6 M32 23 l2.5 6" opacity="0.6" /></Ico>);
export const SiCIcon = () => (<Ico><path d="M24 9 l12.5 7.2 v14.6 L24 38 l-12.5 -7.2 V16.2 Z" fill={SOFT} /><path d="M24 9 v9 M24 18 l10.8 6.2 M24 18 l-10.8 6.2 M24 38 V24" opacity="0.7" /><circle cx="24" cy="18" r="1.5" fill={SOLID} stroke="none" /></Ico>);

/* ---- 第八波新赛道 ---- */
export const DefenseIcon = () => (<Ico><rect x="21" y="21" width="6" height="6" rx="1.5" fill={SOFT} /><path d="M21 21 L11 13 M27 21 L37 13 M21 27 L11 35 M27 27 L37 35" /><circle cx="11" cy="13" r="3.2" fill={SOFT} /><circle cx="37" cy="13" r="3.2" fill={SOFT} /><circle cx="11" cy="35" r="3.2" fill={SOFT} /><circle cx="37" cy="35" r="3.2" fill={SOFT} /><circle cx="24" cy="24" r="1.3" fill={SOLID} stroke="none" /></Ico>);
export const BCIIcon = () => (<Ico><path d="M15 35 v-4 a11 11 0 1 1 15 5.5" fill={SOFT} /><rect x="17" y="19" width="7" height="7" rx="1" /><path d="M20.5 19 v-2 M20.5 26 v2 M17 22.5 h-2 M24 22.5 h2" /><path d="M30 22 h6" opacity="0.7" /><path d="M33 22 v-4" opacity="0.7" /><circle cx="36" cy="22" r="1.3" fill={SOLID} stroke="none" /></Ico>);
export const GameAIIcon = () => (<Ico><path d="M14 20 h20 a8 8 0 0 1 8 8 a4.5 4.5 0 0 1 -8.5 2.5 l-2 -3 h-15 l-2 3 A4.5 4.5 0 0 1 6 28 a8 8 0 0 1 8 -8 Z" fill={SOFT} /><path d="M11.5 25 h5 M14 22.5 v5" /><circle cx="31" cy="24" r="1.4" fill={SOLID} stroke="none" /><circle cx="35" cy="27" r="1.4" fill={SOLID} stroke="none" /></Ico>);
export const DePINIcon = () => (<Ico><circle cx="24" cy="24" r="3.2" fill={SOFT} /><circle cx="10" cy="14" r="2.6" fill={SOFT} /><circle cx="38" cy="14" r="2.6" fill={SOFT} /><circle cx="10" cy="34" r="2.6" fill={SOFT} /><circle cx="38" cy="34" r="2.6" fill={SOFT} /><circle cx="24" cy="8" r="2.6" fill={SOFT} /><circle cx="24" cy="40" r="2.6" fill={SOFT} /><path d="M24 24 L10.5 14.7 M24 24 L37.5 14.7 M24 24 L10.5 33.3 M24 24 L37.5 33.3 M24 24 V10.6 M24 24 V37.4" opacity="0.6" /></Ico>);

/* ---- 第九波新赛道 ---- */
export const WorldModelIcon = () => (<Ico><circle cx="24" cy="24" r="14" fill={SOFT} /><ellipse cx="24" cy="24" rx="14" ry="5.5" /><path d="M10 24 h28 M24 10 v28" /><path d="M13 15 q11 6 22 0 M13 33 q11 -6 22 0" opacity="0.6" /><circle cx="24" cy="24" r="1.5" fill={SOLID} stroke="none" /></Ico>);
export const ProductivityIcon = () => (<Ico><rect x="11" y="8" width="26" height="32" rx="3" fill={SOFT} /><path d="M16 15 h16 M16 21 h16 M16 27 h11" /><path d="M26 33 l3 3 l6 -7" /></Ico>);
export const ASICIcon = () => (<Ico><rect x="13" y="13" width="22" height="22" rx="2" fill={SOFT} /><rect x="19" y="19" width="10" height="10" rx="1" /><path d="M24 19 v-2 M24 29 v2 M19 24 h-2 M29 24 h2" /><path d="M18 13 v-3 M30 13 v-3 M18 35 v3 M30 35 v3 M13 18 h-3 M13 30 h-3 M35 18 h3 M35 30 h3" /><path d="M22 22 h4 v4 h-4 Z" fill={SOLID} stroke="none" /></Ico>);

/** 城市 id → 专属图标；地图城市标记按此渲染（缺省回退到金色星标）。 */
export const CITY_ICON: Record<string, () => JSX.Element> = {
  // 应用层
  chatbots: ChatbotsIcon, digital_biology: DigitalBiologyIcon, robotaxi: RobotaxiIcon,
  enterprise: EnterpriseIcon, science: ScienceIcon, robotics: RoboticsIcon,
  manufacturing: ManufacturingIcon, ai_coder: AICoderIcon, genmedia: GenMediaIcon,
  search_ai: SearchAIIcon, health_ai: HealthAIIcon, design_ai: DesignAIIcon,
  edge_ai: EdgeAIIcon, ai_ad: AdIcon, fin_ai: FinanceIcon, edu_ai: EduIcon,
  voice_agent: VoiceIcon, ai_security: SecurityIcon, ai_agent: AgentIcon, robot_parts: RobotPartsIcon,
  defense_ai: DefenseIcon, bci: BCIIcon, game_ai: GameAIIcon, productivity_ai: ProductivityIcon,
  // 模型层
  llm: LLMIcon, vlm: VLMIcon, vla: VLAIcon, mmllm: MMLLMIcon, gpt: GPTIcon,
  dm: DMIcon, gnn: GNNIcon, moe: MOEIcon, ssm: SSMIcon, lbm: LBMIcon, world_model: WorldModelIcon,
  // 基础设施
  nvlink: NVLinkIcon, network: NetworkIcon, neocloud: NeoCloudIcon, ai_infra_sw: InfraSWIcon,
  ai_datacenter: DataCenterIcon, ai_server: AIServerIcon, connector: ConnectorIcon, pcb: PCBIcon, depin: DePINIcon,
  // 芯片
  gpu: GPUIcon, cpu: CPUIcon, dpu: DPUIcon, ai_accel: AIAccelIcon, quantum: QuantumIcon,
  av_chip: AVChipIcon, foundry: FoundryIcon, packaging: PackagingIcon, equipment: EquipmentIcon, eda: EDAIcon, asic_design: ASICIcon,
  // 能源
  cooling: CoolingIcon, power: PowerIcon, grid: GridIcon, generation: GenerationIcon, nuclear: NuclearIcon,
  fusion: FusionIcon, uranium: UraniumIcon, fuelcell: FuelCellIcon, transformer: TransformerIcon, power_supply: PowerSupplyIcon,
  // 光通信
  opt_chip: OptChipIcon, opt_module: FiberIcon, opt_network: OptNetIcon,
  // 太空
  satellite: SatelliteIcon, launch: LaunchIcon, orbital_dc: OrbitalDCIcon, sat_ai: SatAIIcon,
  // 存储
  hbm_mem: HBMIcon, dram_mem: DRAMIcon, nand_ssd: NANDIcon, hdd_stor: HDDIcon, cxl_mem: CXLIcon, ent_storage: EntStorageIcon,
  // 材料
  silicon_wafer: WaferIcon, photoresist: PhotoresistIcon, e_gases: GasIcon, substrate: SubstrateIcon,
  cmp_mat: CMPIcon, rare_earth: RareEarthIcon, copper: CopperIcon, sic_gan: SiCIcon,
};

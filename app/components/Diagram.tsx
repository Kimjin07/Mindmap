"use client";

import { useRouter } from "next/navigation";
import { type JSX } from "react";
import { MAP, NODES } from "../data/nodes";
import {
  ChatbotsIcon, DigitalBiologyIcon, RobotaxiIcon, EnterpriseIcon, ScienceIcon,
  RoboticsIcon, ManufacturingIcon, AICoderIcon, GPUIcon, CPUIcon, DPUIcon,
  NVLinkIcon, NetworkIcon, StorageIcon, CoolingIcon, PowerIcon, GridIcon, FiberIcon,
} from "./icons";

const ICONS: Record<string, () => JSX.Element> = {
  chatbots: ChatbotsIcon, digital_biology: DigitalBiologyIcon, robotaxi: RobotaxiIcon,
  enterprise: EnterpriseIcon, science: ScienceIcon, robotics: RoboticsIcon,
  manufacturing: ManufacturingIcon, ai_coder: AICoderIcon, gpu: GPUIcon, cpu: CPUIcon,
  dpu: DPUIcon, nvlink: NVLinkIcon, network: NetworkIcon, storage: StorageIcon,
  cooling: CoolingIcon, power: PowerIcon, grid: GridIcon, fiber: FiberIcon,
};

/** 点击节点 → 跳到对应「层」的地图页；细分则定位到该地区(锚点)。 */
function hrefFor(id: string): string {
  const node = NODES[id];
  if (!node) return "/";
  if (node.type === "layer") return `/map/${id}`;
  return `/map/${node.parentId}#${id}`;
}

const X = 6;
const W = 330;
const GAP = 16;
const PAD = 6;

function BoxGroup({
  boxes, go,
}: {
  boxes: { id: string; h: number; big?: boolean }[];
  go: (id: string) => void;
}) {
  let y = PAD;
  const placed = boxes.map((b) => {
    const item = { ...b, y };
    y += b.h + GAP;
    return item;
  });
  const totalH = y - GAP + PAD;

  const bx = X + W + 8;
  const arm = 14, tip = 28, r = 11, ax = bx + arm;
  const y0 = placed[0].y;
  const last = placed[placed.length - 1];
  const y1 = last.y + last.h;
  const ym = (y0 + y1) / 2;
  const bracePath = [
    `M ${bx} ${y0}`, `Q ${ax} ${y0} ${ax} ${y0 + r}`, `L ${ax} ${ym - r}`,
    `Q ${ax} ${ym} ${bx + tip} ${ym}`, `Q ${ax} ${ym} ${ax} ${ym + r}`,
    `L ${ax} ${y1 - r}`, `Q ${ax} ${y1} ${bx} ${y1}`,
  ].join(" ");
  const vbW = bx + tip + 8;

  return (
    <svg viewBox={`0 0 ${vbW} ${totalH}`} fill="none">
      <g filter="url(#sketch)" stroke="url(#gold)">
        <path d={bracePath} fill="none" strokeWidth={1.4} />
      </g>

      {placed.map((b) => (
        <g
          key={b.id}
          className="box-hit"
          onClick={() => go(b.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && go(b.id)}
        >
          <rect
            x={X} y={b.y} width={W} height={b.h} rx={16} ry={16}
            fill="transparent" stroke="url(#gold)" strokeWidth={1.5}
            filter="url(#sketch)"
          />
          <text
            x={X + W / 2} y={b.y + b.h / 2} textAnchor="middle"
            dominantBaseline="central" fill="var(--diagram-box-ink)"
            fontSize={b.big ? 20 : 15} letterSpacing="3"
            style={{ fontWeight: 400 }}
          >
            {NODES[b.id]?.nameEn}
          </text>
        </g>
      ))}
    </svg>
  );
}

function IconGrid({
  ids, cols, go,
}: {
  ids: string[]; cols: 4 | 5; go: (id: string) => void;
}) {
  return (
    <div className={cols === 5 ? "icon-grid five" : "icon-grid"}>
      {ids.map((id) => {
        const node = NODES[id];
        const Icon = node?.icon ? ICONS[node.icon] : undefined;
        return (
          <button className="icon-cell" key={id} onClick={() => go(id)}>
            {Icon && <Icon />}
            <div className="label">{node?.nameEn}</div>
          </button>
        );
      })}
    </div>
  );
}

/** 「AI FACTORIES」——阶梯式等距服务器机柜（每个柜有独立顶面+侧面，草图+金光风格）。 */
function AIFactories({ onClick }: { onClick: () => void }) {
  const RW = 24, RH = 56, DX = 20, DY = 12, VBW = 620, VBH = 300;
  // 前(宽、低、亮) → 后(窄、高、暗)。层间纵向留出 DY 让下层顶面(台阶)露出。
  const tiers = [
    { n: 14, yBase: 262, op: 1 },
    { n: 12, yBase: 262 - RH - DY, op: 0.82 },
    { n: 10, yBase: 262 - 2 * (RH + DY), op: 0.64 },
  ];
  return (
    <button className="factories" onClick={onClick} aria-label="AI Factories">
      <div className="factories-title">AI FACTORIES</div>
      <svg viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="xMidYMid meet">
        {/* 后层先画（在下方），前层后画盖住 → 正确遮挡 */}
        {[...tiers].reverse().map((t) => {
          const rowW = t.n * RW;
          const x0 = (VBW - rowW) / 2;
          const yTop = t.yBase - RH;
          const rackXs = Array.from({ length: t.n }, (_, i) => x0 + i * RW);
          return (
            <g key={t.n} filter="url(#sketch)" opacity={t.op} stroke="url(#gold)" strokeWidth={1} strokeLinejoin="round">
              {/* 每个机柜的顶面（等距平行四边形） → 一排连续的柜顶 */}
              {rackXs.map((rx, i) => (
                <path
                  key={`t${i}`}
                  d={`M ${rx} ${yTop} L ${rx + DX} ${yTop - DY} L ${rx + RW + DX} ${yTop - DY} L ${rx + RW} ${yTop} Z`}
                  fill="rgba(224,200,110,0.16)"
                />
              ))}
              {/* 整排的右侧面（深色，增强体积） */}
              <path
                d={`M ${x0 + rowW} ${yTop} L ${x0 + rowW + DX} ${yTop - DY} L ${x0 + rowW + DX} ${t.yBase - DY} L ${x0 + rowW} ${t.yBase} Z`}
                fill="rgba(0,0,0,0.5)"
              />
              {/* 每个机柜正面 + 金色发光卡槽 */}
              {rackXs.map((rx, i) => (
                <g key={`f${i}`}>
                  <rect x={rx} y={yTop} width={RW} height={RH} fill="rgba(16,13,7,0.62)" />
                  {[0, 1, 2, 3, 4].map((s) => (
                    <rect
                      key={s}
                      x={rx + 3.5} y={yTop + 6 + s * 10} width={RW - 7} height={4} rx={1}
                      fill="url(#gold)" stroke="none"
                      opacity={(i * 2 + s) % 3 === 0 ? 0.95 : 0.3}
                      filter="url(#glow)"
                    />
                  ))}
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </button>
  );
}

function Pill({ id, go }: { id: string; go: (id: string) => void }) {
  return (
    <button className="pill" onClick={() => go(id)}>
      <svg viewBox="0 0 120 36" preserveAspectRatio="none">
        <rect x="2" y="2" width="116" height="32" rx="16" ry="16"
          fill="none" stroke="url(#gold)" strokeWidth="1.4" filter="url(#sketchSoft)" />
      </svg>
      <span>{NODES[id]?.nameEn}</span>
    </button>
  );
}

export default function Diagram() {
  const router = useRouter();
  const go = (id: string) => router.push(hrefFor(id));

  return (
    <div className="diagram">
      {MAP.map((group, gi) => (
        <div className="group" key={gi}>
          <div className="box-col">
            <BoxGroup boxes={group.boxes} go={go} />
          </div>
          <div className="content">
            {group.content.kind === "icons" ? (
              <IconGrid ids={group.content.ids} cols={group.content.cols} go={go} />
            ) : group.content.kind === "factories" ? (
              <AIFactories onClick={() => go(group.content.kind === "factories" ? group.content.go : "infra")} />
            ) : (
              <div className="pill-rows">
                {group.content.rows.map((row, i) => (
                  <div className="pill-row" key={i}>
                    {row.map((id) => (
                      <Pill key={id} id={id} go={go} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

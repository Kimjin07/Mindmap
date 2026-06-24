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
            dominantBaseline="central" fill="#ece0a8"
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

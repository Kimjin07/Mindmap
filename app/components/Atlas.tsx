"use client";

/**
 * 一整张「Google 地图式」的 AI 产业链世界地图 + 旅行路线模式。
 * - 五大板块同处一图，每个赛道是一座城市，城市间公路相连（跨板块为虚线航线）。
 * - 点城市 → 推近，城里浮现代表产品（景点）。
 * - 点某个产品 → 进入「旅行路线」：把与它相关的项目串起来——
 *   ① 同公司散落各城市的产品；② 跨公司「驱动 / 供应」它的产品（如 Copilot 由 GPT 驱动、
 *   大模型靠 GPU 算力、GPU 靠光模块组网…）。镜头收拢过来，给出沿途行程与每站特别之处。
 */

import Link from "next/link";
import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type JSX,
} from "react";
import { NODES } from "../data/nodes";
import { getPlayers, companyOfPlayer, PRODUCTS, relatedTree, type TreeRelated } from "../data/players";
import { COMPANIES, KIND_LABEL, isDomesticCompany } from "../data/companies";
import CompanyLogo from "./CompanyLogo";
import CompanyDetail from "./CompanyDetail";
import {
  worldLayout, roadsFor, isCrossLayer, clusterRadius, continentLobes, CLUSTERS, LAYER_IDS, LAYER_GROUPS, type Pt,
} from "../data/atlas";
import { CITY_ICON } from "./icons";

const KMIN = 0.06, KMAX = 2.8, K_FOCUS = 1.5;
const CARD_RESERVE = 250; // 底部信息卡占用的高度，进城/路线时为它让位
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const ROAD_CORNER = 46; // 公路拐角圆角半径（世界单位）
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
function unit(dx: number, dy: number): Pt {
  const m = Math.hypot(dx, dy) || 1;
  return { x: dx / m, y: dy / m };
}

/**
 * 把一串折线点转成「带圆角拐弯」的 SVG path —— 拐角处用二次贝塞尔抹圆，
 * 让横竖道路看起来像真实地图里平滑的公路转弯。
 */
function roundedPath(pts: Pt[], r: number): string {
  if (pts.length < 2) return "";
  if (r <= 0) return "M" + pts.map((p) => `${p.x} ${p.y}`).join(" L");
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], p = pts[i], p1 = pts[i + 1];
    const v0 = unit(p0.x - p.x, p0.y - p.y);
    const v1 = unit(p1.x - p.x, p1.y - p.y);
    const d0 = Math.min(r, dist(p0, p) / 2);
    const d1 = Math.min(r, dist(p, p1) / 2);
    const s = { x: p.x + v0.x * d0, y: p.y + v0.y * d0 };
    const e = { x: p.x + v1.x * d1, y: p.y + v1.y * d1 };
    d += ` L ${s.x} ${s.y} Q ${p.x} ${p.y} ${e.x} ${e.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

const ALIGN_TOL = 70; // 两端已大致对齐时直接走直线，不拐弯

/**
 * 正交「公路」路径：横平竖直，**最多只拐一次弯**（L 形）。
 * 两端已经接近同一行/同一列时干脆走直线，尽量减少拐弯与重叠。
 */
function roadPath(a: Pt, b: Pt): string {
  const dx = b.x - a.x, dy = b.y - a.y;
  // 几乎对齐 → 直线，零拐弯
  if (Math.abs(dx) <= ALIGN_TOL || Math.abs(dy) <= ALIGN_TOL) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }
  // 否则单个直角弯：先走长轴，再拐向短轴
  const corner =
    Math.abs(dx) >= Math.abs(dy) ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
  return roundedPath([a, corner, b], ROAD_CORNER);
}

/** 把关系标签归类，用于配色：同公司 / 驱动 / 算力 / 上游供应 / 网络 / 能源。 */
function relKind(rel: string): string {
  if (rel === "同公司") return "same";
  if (/竞品|竞争|对标|同行|同道|双雄/.test(rel)) return "rival";
  if (/投资|股东|入股|押注|被投/.test(rel)) return "invest";
  if (/驱动|运行|同系|同模型|加持|大脑|VLA/.test(rel)) return "drive";
  if (/算力|训练|GPU算力/.test(rel)) return "compute";
  if (/发电|核电|供电|散热|电力|SMR|并网|太阳能|燃气/.test(rel)) return "energy";
  if (/网络|组网|交换|路由|光网络|互联|供货|AI组网/.test(rel)) return "network";
  if (/芯片|EML|DSP|激光|显存|HBM|封装|代工|设备|光刻|器件|零部件|谐波|减速器|模块|代工制造/.test(rel)) return "supply";
  return "default";
}
/* ---- 价值链分组：按产业链「层级」把相关产品分到一列一列（环节）---- */
/** 层级 → 中文「环节」名（列首标签，像价值链里的 Design / Foundry / Packaging…）。 */
const BAND_LABEL: Record<number, string> = {
  0: "应用", 1: "太空算力", 2: "火箭发射", 3: "模型", 4.8: "AI服务器·系统", 5: "计算芯片",
  6: "部件·网络·存储", 6.2: "连接·铜缆", 6.5: "光模块", 6.8: "PCB·电路板",
  7: "先进封装", 7.3: "机器人零部件", 7.5: "代工·光芯片",
  8: "芯片架构·IP", 8.5: "设备·EDA", 9: "供电·散热", 9.5: "电网·输配电", 10: "发电·核电",
  10.5: "核燃料", 11: "上游材料",
};

export interface ChainCol {
  rank: number;
  label: string;
  dir: "up" | "down";
  items: TreeRelated[];
}

function groupByRank(list: TreeRelated[]): [number, TreeRelated[]][] {
  const m = new Map<number, TreeRelated[]>();
  for (const it of list) {
    const arr = m.get(it.rank) ?? [];
    arr.push(it);
    m.set(it.rank, arr);
  }
  return [...m.entries()];
}

/**
 * 把相关产品组织成**横向价值链的列**：
 *   · 上游(被依赖) → origin 左侧，按层级越上游越靠左
 *   · 下游(去使用) → origin 右侧，按层级越下游越靠右
 *   · 同侧(同公司 / 同行) → 底部一排
 * 每一列是产业链上的一个「环节」（含环节名 + 该环节的若干公司/产品）。
 */
function valueChain(pid: string) {
  const related = relatedTree(pid);
  const origin = PRODUCTS[pid];
  const toCol = (list: TreeRelated[], dir: "up" | "down"): ChainCol[] =>
    groupByRank(list)
      .sort((a, b) => b[0] - a[0]) // 高层级(更上游)在前 → 渲染时更靠左
      .map(([rank, items]) => ({ rank, label: BAND_LABEL[rank] ?? "其它", dir, items }));
  // 语义固定：上游→左、下游→右、同类竞品→底部一排。
  // 终端产品(没有下游)右侧留空、最上游材料(没有上游)左侧留空，都是正确的。
  const upCols = toCol(related.filter((r) => r.dir === "up"), "up");
  const downCols = toCol(related.filter((r) => r.dir === "down"), "down");
  const side = related.filter((r) => r.dir === "side");

  return { origin, related, upCols, downCols, side };
}

function StarMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 L14 9.6 L20.4 9.7 L15.3 13.6 L17.1 19.6 L12 15.9 L6.9 19.6 L8.7 13.6 L3.6 9.7 L10 9.6 Z"
        stroke="url(#gold)" strokeWidth="1.4" strokeLinejoin="round" filter="url(#sketchSoft)"
      />
    </svg>
  );
}

type Tour = { productId: string };

export default function Atlas({ focusLayer }: { focusLayer?: string }) {
  const pos = useMemo<Record<string, Pt>>(() => worldLayout(), []);
  const ids = useMemo(() => Object.keys(pos), [pos]);
  const roads = useMemo(() => roadsFor(ids), [ids]);

  const vpRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState({ cx: 0, cy: 0, k: 0.4 });
  const [active, setActive] = useState<string | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [tourPath, setTourPath] = useState<string[]>([]); // 无限钻取的面包屑历史
  const [panelCo, setPanelCo] = useState<string | null>(null);
  const [arrived, setArrived] = useState<string | null>(null);
  const [smooth, setSmooth] = useState(false);
  const ready = size.w > 0;

  const originColRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const gestureMoved = useRef(false);
  const onBackground = useRef(false);

  /**
   * 旅行路线（树状图）：以出发产品为根，把相关产品按产业链方向上下拆分——
   * 上游(origin 依赖的) 在上、下游(依赖 origin 的) 在下，同公司/同行分到左右两侧。
   */
  const tourData = useMemo(() => {
    if (!tour) return null;
    if (!PRODUCTS[tour.productId]) return null;
    return valueChain(tour.productId);
  }, [tour]);

  // 价值链打开/切根后，把「当前」这一列滚到水平中央（长链时上下游都能往两侧看）
  useEffect(() => {
    if (!tour) return;
    const id = requestAnimationFrame(() =>
      originColRef.current?.scrollIntoView({ inline: "center", block: "nearest" })
    );
    return () => cancelAnimationFrame(id);
  }, [tour]);

  const fitPoints = useCallback(
    (cityIds: string[], maxK = KMAX, pad = 480) => {
      const W = size.w, H = size.h;
      if (!W || cityIds.length === 0) return null;
      const xs = cityIds.map((i) => pos[i].x), ys = cityIds.map((i) => pos[i].y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      const k = clamp(Math.min(W / (maxX - minX + pad), H / (maxY - minY + pad)), KMIN, maxK);
      return { cx, cy, k };
    },
    [size, pos]
  );

  const fitAll = useCallback(() => fitPoints(ids, KMAX, 320), [fitPoints, ids]);

  /** 把某个板块（层）的所有城市刚好框进视野。 */
  const fitLayer = useCallback(
    (layer: string) => {
      const cityIds = ids.filter((id) => NODES[id]?.parentId === layer);
      if (cityIds.length === 0) return null;
      // 单城市的层给个合理放大；多城市按范围自适应，留足边距不切边。
      return fitPoints(cityIds, 1.0, 620);
    },
    [fitPoints, ids]
  );

  useLayoutEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const inited = useRef(false);
  useEffect(() => {
    if (!ready || inited.current) return;
    inited.current = true;
    const hash =
      typeof window !== "undefined" ? decodeURIComponent(window.location.hash.slice(1)) : "";
    if (ids.includes(hash)) {
      setView({ cx: pos[hash].x, cy: pos[hash].y, k: 0.75 });
      setArrived(hash);
    } else if (focusLayer && CLUSTERS[focusLayer]) {
      const v = fitLayer(focusLayer);
      setView(v ?? { cx: CLUSTERS[focusLayer].x, cy: CLUSTERS[focusLayer].y, k: 0.6 });
    } else {
      const v = fitAll();
      if (v) setView(v);
    }
  }, [ready, fitAll, fitLayer, ids, pos, focusLayer]);

  /* 滚轮缩放——但指针在信息卡上时放行，让卡片内部正常滚动 */
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest(".atlas-card, .atlas-panel, .vchain")) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      setSmooth(false);
      setView((v) => {
        const k2 = clamp(v.k * (e.deltaY < 0 ? 1.12 : 0.89), KMIN, KMAX);
        const wx = v.cx + (mx - r.width / 2) / v.k;
        const wy = v.cy + (my - r.height / 2) / v.k;
        return { k: k2, cx: wx - (mx - r.width / 2) / k2, cy: wy - (my - r.height / 2) / k2 };
      });
      setArrived(null);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panelCo) setPanelCo(null);
      else if (tour) exitTour();
      else if (active) exitCity();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const tx = size.w / 2 - view.k * view.cx;
  // 进城 / 路线时把焦点上移，给底部信息卡预留空间，避免盖住最下面的项目
  const focalFrac = (active || tour) && size.h ? (size.h - CARD_RESERVE) / (2 * size.h) : 0.5;
  const ty = size.h * focalFrac - view.k * view.cy;

  const onPointerDown = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    onBackground.current = !t.closest(
      ".city, .attraction, .tour-node, .tour-origin, .atlas-card, .atlas-top, .atlas-controls, .atlas-panel"
    );
    drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: false };
    setSmooth(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setView((v) => ({ ...v, cx: d.cx - dx / v.k, cy: d.cy - dy / v.k }));
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    gestureMoved.current = d?.moved ?? false;
    if (d && !d.moved && onBackground.current) {
      if (tour) exitTour();
      else if (active) exitCity();
    }
    if (d && d.moved) setArrived(null);
  };

  const enterCity = (id: string) => {
    if (gestureMoved.current) return;
    // 进城缩放随产品数量自适应：产品多→稍微缩远，保证整圈落在屏幕内、不超出
    const m = getPlayers(id).length;
    const rr = Math.max(135, m * 10);
    const avail = Math.min(size.w || 1200, (size.h || 800) - CARD_RESERVE);
    const k = clamp(avail / (2.2 * rr), 0.5, K_FOCUS);
    setSmooth(true);
    setTour(null);
    setActive(id);
    setArrived(null);
    setView({ cx: pos[id].x, cy: pos[id].y, k });
  };
  const exitCity = () => {
    setSmooth(true);
    setActive(null);
    setTour(null);
  };
  /** 切换价值链的根产品（不动面包屑历史）。价值链是固定浮层，与地图缩放无关。 */
  const focusTour = (productId: string) => {
    const origin = PRODUCTS[productId];
    if (!origin) return;
    setSmooth(true);
    setActive(null);
    setTour({ productId });
    // 镜头悄悄对准该产品所在城市，方便退出时回到对应位置
    setView({ cx: pos[origin.cityId].x, cy: pos[origin.cityId].y, k: K_FOCUS });
  };
  /** 从城市里点产品 → 新开一条价值链（重置面包屑）。 */
  const openTour = (productId: string) => {
    if (gestureMoved.current || !PRODUCTS[productId]) return;
    setTourPath([productId]);
    focusTour(productId);
  };
  /** 点价值链里的某个产品 → 以它为根继续展开（无限循环钻取，追加面包屑）。 */
  const hopTo = (productId: string) => {
    if (gestureMoved.current || !PRODUCTS[productId]) return;
    setTourPath((prev) => {
      const at = prev.indexOf(productId);
      return at >= 0 ? prev.slice(0, at + 1) : [...prev, productId];
    });
    focusTour(productId);
  };
  /** 点面包屑某一站 → 回到那一步。 */
  const jumpTourTo = (i: number) => {
    const id = tourPath[i];
    if (!id) return;
    setTourPath(tourPath.slice(0, i + 1));
    focusTour(id);
  };
  const exitTour = () => {
    setSmooth(true);
    const origin = tour ? PRODUCTS[tour.productId] : null;
    setTour(null);
    setTourPath([]);
    if (origin) {
      setActive(origin.cityId);
      setView({ cx: pos[origin.cityId].x, cy: pos[origin.cityId].y, k: K_FOCUS });
    }
  };
  /** 地图上点某个站点城市 → 进入那座城市。 */
  const flyToLayer = (layer: string) => {
    setSmooth(true);
    setActive(null);
    setTour(null);
    setArrived(null);
    const v = fitLayer(layer);
    const c = CLUSTERS[layer];
    if (v) setView(v);
    else if (c) setView({ cx: c.x, cy: c.y, k: 0.6 });
  };
  const resetView = () => {
    setSmooth(true);
    setActive(null);
    setTour(null);
    const v = fitAll();
    if (v) setView(v);
  };
  const zoomBy = (f: number) => {
    setSmooth(true);
    setView((v) => ({ ...v, k: clamp(v.k * f, KMIN, KMAX) }));
  };

  /** 在左侧抽屉里打开公司详情（不跳页）。 */
  const openCompanyPanel = (id?: string) => {
    if (!id || !COMPANIES[id]) return;
    setPanelCo(id);
  };
  /** 抽屉里点「地图环节」→ 让地图飞过去定位（城市则进城）。 */
  const gotoNode = (nodeId: string) => {
    const n = NODES[nodeId];
    if (!n) return;
    setSmooth(true);
    setTour(null);
    setPanelCo(null);
    if (pos[nodeId]) {
      setActive(nodeId);
      setArrived(nodeId);
      setView({ cx: pos[nodeId].x, cy: pos[nodeId].y, k: K_FOCUS });
    } else if (CLUSTERS[nodeId]) {
      setActive(null);
      setView({ cx: CLUSTERS[nodeId].x, cy: CLUSTERS[nodeId].y, k: 0.5 });
    }
  };

  const activeNode = active && !tour ? NODES[active] : null;
  const activePlayers = activeNode ? getPlayers(active!) : [];
  // 进城后产品排在一圈上，半径随产品数量放大（避免重叠），但保持紧凑
  const ringR = Math.max(135, activePlayers.length * 10);
  const tourCo = tourData ? COMPANIES[tourData.origin.companyId ?? ""] : null;

  /** 价值链里的一个产品/公司小卡——点它即以它为新根继续钻取（无限循环）。 */
  const renderChip = (it: TreeRelated) => (
    <button
      key={it.id}
      className="vchain-item"
      title={it.note}
      onClick={(e) => {
        e.stopPropagation();
        hopTo(it.id);
      }}
    >
      <CompanyLogo companyId={it.companyId} size={24} />
      <span className="vi-name">{it.name}</span>
      <span className={`rel-tag ${relKind(it.rel)}`}>{it.rel}</span>
    </button>
  );

  return (
    <div
      ref={vpRef}
      className={`atlas${active || tour ? " entered" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className={`atlas-world${smooth ? " smooth" : ""} ${
          active || view.k >= 0.26 ? "detail" : "overview"
        }`}
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${view.k})` }}
      >
        <svg
          className="atlas-lines"
          viewBox="-5000 -5000 10000 10000"
          width={10000}
          height={10000}
          style={{ left: -5000, top: -5000 }}
          aria-hidden="true"
        >
          {/* 每个板块 = 一块「大陆」：填充陆地 + 洲名。缩小看洲，放大看城市。 */}
          {!tour && LAYER_IDS.map((layer) => {
            const c = CLUSTERS[layer];
            const n = NODES[layer];
            const lobes = continentLobes(layer);
            return (
              <g key={layer} className="continent">
                {lobes.map((l, i) => (
                  <circle key={i} cx={l.x} cy={l.y} r={l.r} className="continent-land" />
                ))}
                <text x={c.x} y={c.y - 8} textAnchor="middle" className="continent-label">
                  {n?.nameEn}
                </text>
                <text x={c.x} y={c.y + 78} textAnchor="middle" className="continent-sub">
                  {n?.name}
                </text>
                {/* 小簇（「国家/地区」）名——缩小时也能看到每一块的名字 */}
                {(LAYER_GROUPS[layer] ?? []).map((g) => (
                  <g key={g.name}>
                    <text
                      x={c.x + g.dx}
                      y={c.y + g.dy}
                      textAnchor="middle"
                      className="subregion-label"
                    >
                      {g.nameEn}
                    </text>
                    <text
                      x={c.x + g.dx}
                      y={c.y + g.dy + 82}
                      textAnchor="middle"
                      className="subregion-sub"
                    >
                      {g.name}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {roads.map(([a, b], i) => {
            const cross = isCrossLayer(a, b);
            const hot = active && !tour && (a === active || b === active);
            return (
              <path
                key={i}
                d={roadPath(pos[a], pos[b])}
                className={`${cross ? "route" : "road"}${hot ? " hot" : ""}${tour ? " faded" : ""}`}
              />
            );
          })}

          {activeNode && (
            <circle cx={pos[active!].x} cy={pos[active!].y} r={ringR + 45} className="city-aura" />
          )}
          {activeNode &&
            activePlayers.map((_, i) => {
              const m = activePlayers.length;
              const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m;
              const R = ringR;
              return (
                <line
                  key={i}
                  x1={pos[active!].x} y1={pos[active!].y}
                  x2={pos[active!].x + Math.cos(ang) * R} y2={pos[active!].y + Math.sin(ang) * R}
                  className="spoke"
                />
              );
            })}

        </svg>

        {/* 城市：只在放大档(城市视图)渲染，缩小时只剩大陆——大幅减少 DOM，缩放不再卡 */}
        {!tour && (active || view.k >= 0.26) && ids.map((id) => {
          const n = NODES[id];
          const p = pos[id];
          const Icon = CITY_ICON[id] ?? null;
          const count = getPlayers(id).length;
          const isActive = active === id;
          const dim = active && !isActive;
          return (
            <button
              key={id}
              className={`city${isActive ? " active" : ""}${dim ? " dim" : ""}${
                arrived === id ? " arrived" : ""
              }`}
              style={{ left: p.x, top: p.y }}
              onClick={(e) => {
                e.stopPropagation();
                enterCity(id);
              }}
            >
              <span className="city-marker">
                {Icon ? <Icon /> : <StarMark />}
                {count > 0 && <span className="city-count">{count}</span>}
              </span>
              <span className="city-name">{n.nameEn}</span>
              <span className="city-en">{n.name}</span>
              {arrived === id && <span className="city-here">你在这里</span>}
            </button>
          );
        })}

        {/* 进城后浮现的景点（产品）——图标用公司字标，点击看路线 */}
        {activeNode &&
          activePlayers.map((pl, i) => {
            const m = activePlayers.length;
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m;
            const R = ringR;
            const x = pos[active!].x + Math.cos(ang) * R;
            const y = pos[active!].y + Math.sin(ang) * R;
            const cid = companyOfPlayer(pl);
            return (
              <button
                key={pl.id}
                className="attraction clickable"
                style={{ left: x, top: y, animationDelay: `${i * 45}ms` }}
                title={pl.note}
                onClick={(e) => {
                  e.stopPropagation();
                  openTour(pl.id);
                }}
              >
                <CompanyLogo companyId={cid} size={30} />
                <span className="att-name">{pl.name}</span>
                {pl.by && <span className="att-by">{pl.by}</span>}
              </button>
            );
          })}

      </div>

      {/* ---------- 价值链浮层（固定，不随地图缩放，避免重叠/过小） ---------- */}
      {tourData && (
        <div
          className="vchain"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget) exitTour();
          }}
        >
          <div className="vchain-bar">
            <button className="atlas-back" onClick={exitTour}>← 返回地图</button>
            {tourPath.length > 1 && (
              <div className="tour-crumb">
                {tourPath.map((id, i) => (
                  <span key={id} className="tour-crumb-step">
                    {i > 0 && <span className="sep">›</span>}
                    <button
                      className={i === tourPath.length - 1 ? "cur" : ""}
                      onClick={() => jumpTourTo(i)}
                    >
                      {PRODUCTS[id]?.name ?? id}
                    </button>
                  </span>
                ))}
              </div>
            )}
            <span className="vchain-count">
              上下游 {tourData.related.length} 项 · 点任意项继续无限钻取
            </span>
          </div>
          <div className="vchain-ends">
            <span>◀ 上游 UPSTREAM（被它依赖）</span>
            <span>下游 DOWNSTREAM（去使用它）▶</span>
          </div>
          <div className="vchain-flow">
            {tourData.upCols.map((col, ci) => (
              <div key={`u${ci}`} className="vchain-col up">
                <div className="vchain-col-head">{col.label}</div>
                <div className="vchain-card">{col.items.map(renderChip)}</div>
              </div>
            ))}
            <div className="vchain-col origin" ref={originColRef}>
              <div className="vchain-col-head cur">当前</div>
              <div className="vchain-card origin">
                <CompanyLogo companyId={tourData.origin.companyId} size={44} />
                <span className="vo-name">{tourData.origin.name}</span>
                {tourCo && (
                  <span className={`kind-badge ${tourCo.kind}`}>{KIND_LABEL[tourCo.kind]}</span>
                )}
                {tourData.origin.note && <p className="vo-note">{tourData.origin.note}</p>}
                {tourCo && (
                  <button
                    className="vo-cta"
                    onClick={() => openCompanyPanel(tourData.origin.companyId)}
                  >
                    查看 {tourCo.name} 主页 →
                  </button>
                )}
              </div>
            </div>
            {tourData.downCols.map((col, ci) => (
              <div key={`d${ci}`} className="vchain-col down">
                <div className="vchain-col-head">{col.label}</div>
                <div className="vchain-card">{col.items.map(renderChip)}</div>
              </div>
            ))}
          </div>
          {tourData.side.length > 0 && (
            <div className="vchain-side">
              <span className="vchain-side-label">同公司 / 同行 · 竞品</span>
              {(() => {
                const overseas = tourData.side.filter((s) => !isDomesticCompany(s.companyId));
                const domestic = tourData.side.filter((s) => isDomesticCompany(s.companyId));
                return (
                  <div className="vchain-side-rows">
                    {overseas.length > 0 && (
                      <div className="vchain-side-row">
                        <span className="region-tag overseas">国外</span>
                        <div className="vchain-card row">{overseas.map(renderChip)}</div>
                      </div>
                    )}
                    {domestic.length > 0 && (
                      <div className="vchain-side-row">
                        <span className="region-tag domestic">国内</span>
                        <div className="vchain-card row">{domestic.map(renderChip)}</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ---------- 浮层 UI ---------- */}
      <div className="atlas-top">
        <Link href="/" className="atlas-chip">← 产业链全景</Link>
        <div className="atlas-title">
          <strong>AI 产业链 · 世界地图</strong>
          <span>THE AI VALUE-CHAIN ATLAS</span>
        </div>
        <div className="atlas-layers">
          {LAYER_IDS.map((l) => (
            <button key={l} className="atlas-chip ghost" onClick={() => flyToLayer(l)}>
              {NODES[l]?.name}
            </button>
          ))}
        </div>
      </div>

      {/* 进城信息卡 */}
      {activeNode && (
        <div className="atlas-card">
          <button className="atlas-back" onClick={exitCity}>← 返回地图</button>
          <h3>{activeNode.name}</h3>
          <span className="atlas-card-en">{activeNode.nameEn}</span>
          <p>{activeNode.levels.l1 ?? activeNode.levels.l0}</p>
          <span className="atlas-card-count">
            {activePlayers.length > 0
              ? `${activePlayers.length} 个代表性产品 · 点图钉看路线`
              : "居民整理中…"}
          </span>
        </div>
      )}

      {/* 左侧公司详情抽屉（Google-Maps 式，不跳页） */}
      {panelCo && COMPANIES[panelCo] && (
        <aside
          className="atlas-panel"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="atlas-panel-bar">
            <button className="atlas-back" onClick={() => setPanelCo(null)}>← 关闭</button>
            <Link href={`/company/${panelCo}`} className="atlas-panel-full">整页查看 ↗</Link>
          </div>
          <div className="atlas-panel-body">
            <CompanyDetail
              c={COMPANIES[panelCo]}
              onOpenCompany={openCompanyPanel}
              onGotoNode={gotoNode}
            />
          </div>
        </aside>
      )}

      <div className="atlas-controls">
        <button className="atlas-btn" onClick={() => zoomBy(1.25)} aria-label="放大">＋</button>
        <button className="atlas-btn" onClick={() => zoomBy(0.8)} aria-label="缩小">－</button>
        <button className="atlas-btn small" onClick={resetView} aria-label="全图">⤢</button>
      </div>

      {!active && !tour && (
        <div className="atlas-hint">拖动平移 · 滚轮缩放 · 点城市进入 · 点产品看路线</div>
      )}
    </div>
  );
}

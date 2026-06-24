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
import { getPlayers, companyOfPlayer, PRODUCTS, relatedProducts } from "../data/players";
import { COMPANIES, KIND_LABEL } from "../data/companies";
import CompanyLogo from "./CompanyLogo";
import {
  worldLayout, roadsFor, isCrossLayer, clusterRadius, CLUSTERS, LAYER_IDS, type Pt,
} from "../data/atlas";
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

const KMIN = 0.14, KMAX = 2.8, K_FOCUS = 1.5;
const CARD_RESERVE = 250; // 底部信息卡占用的高度，进城/路线时为它让位
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** 把关系标签归类，用于配色：同公司 / 驱动 / 算力 / 上游供应 / 网络 / 能源。 */
function relKind(rel: string): string {
  if (rel === "同公司") return "same";
  if (/驱动|运行|同系|同模型|加持|大脑|VLA/.test(rel)) return "drive";
  if (/算力|训练|GPU算力/.test(rel)) return "compute";
  if (/发电|核电|供电|散热|电力|SMR|并网|太阳能|燃气/.test(rel)) return "energy";
  if (/网络|组网|交换|路由|光网络|互联|供货|AI组网/.test(rel)) return "network";
  if (/芯片|EML|DSP|激光|显存|HBM|封装|代工|设备|光刻|器件|零部件|谐波|减速器|模块|代工制造/.test(rel)) return "supply";
  return "default";
}
const REL_LEGEND: { kind: string; label: string }[] = [
  { kind: "drive", label: "驱动" },
  { kind: "compute", label: "算力" },
  { kind: "supply", label: "上游供应" },
  { kind: "network", label: "网络" },
  { kind: "energy", label: "能源" },
  { kind: "same", label: "同公司" },
];

const RING_RADII = [205, 400, 600];
/** 相关项目多时分多层同心圆摊开，避免挤成一团看不清。 */
function ringPlan(n: number): { sizes: number[]; maxR: number } {
  let sizes: number[];
  if (n <= 13) sizes = [n];
  else if (n <= 28) {
    const a = Math.ceil(n * 0.4);
    sizes = [a, n - a];
  } else {
    const a = Math.ceil(n * 0.26), b = Math.ceil(n * 0.34);
    sizes = [a, b, n - a - b];
  }
  return { sizes, maxR: RING_RADII[sizes.length - 1] };
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
  const [arrived, setArrived] = useState<string | null>(null);
  const [smooth, setSmooth] = useState(false);
  const ready = size.w > 0;

  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const gestureMoved = useRef(false);
  const onBackground = useRef(false);

  /**
   * 旅行路线（聚拢式）：把相关产品拉到出发产品**身边**围成一圈，
   * 短线连接、不再横跨整张地图。
   */
  const tourData = useMemo(() => {
    if (!tour) return null;
    const origin = PRODUCTS[tour.productId];
    if (!origin) return null;
    // 显式关系（驱动/算力…）排前，「同公司」排后
    const related = relatedProducts(tour.productId).sort(
      (a, b) => (a.rel === "同公司" ? 1 : 0) - (b.rel === "同公司" ? 1 : 0)
    );
    const center = pos[origin.cityId];
    const { sizes, maxR } = ringPlan(related.length);
    // 多层同心圆摊开：内圈放跨公司供应链，外圈放同公司足迹
    const nodes: (typeof related[number] & { x: number; y: number })[] = [];
    let idx = 0;
    sizes.forEach((cnt, ring) => {
      const R = RING_RADII[ring];
      for (let j = 0; j < cnt; j++) {
        const r = related[idx++];
        const ang = -Math.PI / 2 + (j * 2 * Math.PI) / cnt + (ring % 2) * (Math.PI / cnt);
        nodes.push({ ...r, x: center.x + Math.cos(ang) * R, y: center.y + Math.sin(ang) * R });
      }
    });
    return { origin, related, nodes, center, ringR: maxR };
  }, [tour, pos]);

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
      setView({ cx: CLUSTERS[focusLayer].x, cy: CLUSTERS[focusLayer].y, k: 0.5 });
    } else {
      const v = fitAll();
      if (v) setView(v);
    }
  }, [ready, fitAll, ids, pos, focusLayer]);

  /* 滚轮缩放——但指针在信息卡上时放行，让卡片内部正常滚动 */
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest(".atlas-card")) return;
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
      if (tour) exitTour();
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
      ".city, .attraction, .tour-stop, .atlas-card, .atlas-top, .atlas-controls"
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
    setSmooth(true);
    setTour(null);
    setActive(id);
    setArrived(null);
    setView({ cx: pos[id].x, cy: pos[id].y, k: K_FOCUS });
  };
  const exitCity = () => {
    setSmooth(true);
    setActive(null);
    setTour(null);
  };
  /** 点产品 → 开启该产品的旅行路线（聚拢在身边，放大到看得清）。 */
  const openTour = (productId: string) => {
    if (gestureMoved.current) return;
    const origin = PRODUCTS[productId];
    if (!origin) return;
    const { maxR } = ringPlan(relatedProducts(productId).length);
    setSmooth(true);
    setActive(null);
    setTour({ productId });
    // 镜头对准出发城市，缩放把最外圈装进「卡片以上」的可视区，且字够大
    const W = size.w, usableH = size.h - CARD_RESERVE;
    const k = W && usableH > 0 ? clamp(Math.min(W, usableH) / (2 * (maxR + 130)), 0.45, 1.5) : K_FOCUS;
    setView({ cx: pos[origin.cityId].x, cy: pos[origin.cityId].y, k });
  };
  const exitTour = () => {
    setSmooth(true);
    const origin = tour ? PRODUCTS[tour.productId] : null;
    setTour(null);
    if (origin) {
      setActive(origin.cityId);
      setView({ cx: pos[origin.cityId].x, cy: pos[origin.cityId].y, k: K_FOCUS });
    }
  };
  /** 行程里点某一站的产品 → 沿着这条线继续走（开启那个产品的路线）。 */
  const hopTo = (productId: string) => openTour(productId);
  /** 地图上点某个站点城市 → 进入那座城市。 */
  const flyToLayer = (layer: string) => {
    setSmooth(true);
    setActive(null);
    setTour(null);
    setArrived(null);
    const c = CLUSTERS[layer];
    if (c) setView({ cx: c.x, cy: c.y, k: 0.5 });
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

  const activeNode = active && !tour ? NODES[active] : null;
  const activePlayers = activeNode ? getPlayers(active!) : [];
  const tourCo = tourData ? COMPANIES[tourData.origin.companyId ?? ""] : null;

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
        className={`atlas-world${smooth ? " smooth" : ""}`}
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
          {LAYER_IDS.map((layer) => {
            const c = CLUSTERS[layer];
            const r = clusterRadius(layer);
            const n = NODES[layer];
            return (
              <g key={layer} className="region-blob">
                <ellipse cx={c.x} cy={c.y} rx={r} ry={r * 0.86} />
                <text x={c.x} y={c.y - r * 0.86 - 26} textAnchor="middle" className="region-label">
                  {n?.name}
                </text>
                <text x={c.x} y={c.y - r * 0.86 - 2} textAnchor="middle" className="region-label-en">
                  {n?.nameEn}
                </text>
              </g>
            );
          })}

          {roads.map(([a, b], i) => {
            const cross = isCrossLayer(a, b);
            const hot = active && !tour && (a === active || b === active);
            return (
              <line
                key={i}
                x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
                className={`${cross ? "route" : "road"}${hot ? " hot" : ""}${tour ? " faded" : ""}`}
              />
            );
          })}

          {activeNode && (
            <circle cx={pos[active!].x} cy={pos[active!].y} r={150} className="city-aura" />
          )}
          {activeNode &&
            activePlayers.map((_, i) => {
              const m = activePlayers.length;
              const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m;
              const R = 120;
              return (
                <line
                  key={i}
                  x1={pos[active!].x} y1={pos[active!].y}
                  x2={pos[active!].x + Math.cos(ang) * R} y2={pos[active!].y + Math.sin(ang) * R}
                  className="spoke"
                />
              );
            })}

          {/* 旅行路线：从出发产品连向围在身边的相关产品（短线） */}
          {tourData && (
            <>
              <circle cx={tourData.center.x} cy={tourData.center.y} r={tourData.ringR + 26} className="city-aura" />
              {tourData.nodes.map((nd) => (
                <line
                  key={nd.id}
                  x1={tourData.center.x} y1={tourData.center.y} x2={nd.x} y2={nd.y}
                  className="tour-route"
                />
              ))}
            </>
          )}
        </svg>

        {/* 城市 */}
        {ids.map((id) => {
          const n = NODES[id];
          const p = pos[id];
          const Icon = n.icon ? ICONS[n.icon] : null;
          const count = getPlayers(id).length;
          const isActive = !tour && active === id;
          const isTourHub = tour && tourData?.origin.cityId === id;
          const dim = (active && !isActive && !tour) || (!!tour && !isTourHub);
          return (
            <button
              key={id}
              className={`city${isActive ? " active" : ""}${dim ? " dim" : ""}${
                isTourHub ? " on-route" : ""
              }${arrived === id ? " arrived" : ""}`}
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
              <span className="city-name">{n.name}</span>
              <span className="city-en">{n.nameEn}</span>
              {arrived === id && <span className="city-here">你在这里</span>}
            </button>
          );
        })}

        {/* 进城后浮现的景点（产品）——图标用公司字标，点击看路线 */}
        {activeNode &&
          activePlayers.map((pl, i) => {
            const m = activePlayers.length;
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m;
            const R = 120;
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

        {/* 旅行模式：出发产品（中心）+ 围在身边的相关产品 */}
        {tourData && (
          <div
            className="tour-origin"
            style={{ left: tourData.center.x, top: tourData.center.y }}
          >
            <CompanyLogo companyId={tourData.origin.companyId} size={46} />
            <span className="to-name">{tourData.origin.name}</span>
          </div>
        )}
        {tourData &&
          tourData.nodes.map((nd) => (
            <button
              key={nd.id}
              className="tour-node"
              style={{ left: nd.x, top: nd.y }}
              title={nd.note}
              onClick={(e) => {
                e.stopPropagation();
                hopTo(nd.id);
              }}
            >
              <CompanyLogo companyId={nd.companyId} size={34} />
              <span className="tn-name">{nd.name}</span>
              <span className="tn-meta">
                <span className={`rel-tag ${relKind(nd.rel)}`}>{nd.rel}</span>
                <span className="tn-city">{NODES[nd.cityId]?.name}</span>
              </span>
            </button>
          ))}
      </div>

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

      {/* 旅行行程卡 */}
      {tourData && (
        <div className="atlas-card tour">
          <button className="atlas-back" onClick={exitTour}>← 返回地图</button>
          <div className="tour-head">
            <CompanyLogo companyId={tourData.origin.companyId} size={36} />
            <div className="tour-head-t">
              <h3>{tourData.origin.name}</h3>
              <span className="atlas-card-en">
                {tourData.origin.by ?? tourCo?.name}
                {tourCo && <span className={`kind-badge ${tourCo.kind}`}>{KIND_LABEL[tourCo.kind]}</span>}
              </span>
            </div>
          </div>
          {tourData.origin.note && <p>{tourData.origin.note}</p>}
          <div className="tour-foot">
            {tourCo && (
              <Link href={`/company/${tourData.origin.companyId}`} className="tour-cta">
                查看 {tourCo.name} 公司主页 →
              </Link>
            )}
            <span className="tour-foot-hint">
              身边 {tourData.related.length} 个相关项目 · 点图标继续逛
            </span>
          </div>
          <div className="rel-legend">
            {REL_LEGEND.map((l) => (
              <span key={l.kind} className={`rel-tag ${l.kind}`}>{l.label}</span>
            ))}
          </div>
        </div>
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

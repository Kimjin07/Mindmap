"use client";

import { useState } from "react";
import { COMPANIES } from "../data/companies";

/** 从官网字段取主域名，用于拼 logo 服务地址。 */
function domainOf(website?: string): string | undefined {
  if (!website) return undefined;
  return website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim() || undefined;
}

/**
 * 公司图标：优先真 logo，取不到再回退到深色金字字标（永不出现白底）。
 * logo 来源优先级：
 *   1) companies.ts 里手填的 `logo`（本地 /logos/ 文件，最稳，可离线）
 *   2) 按官网域名从图标服务自动取真 logo（DuckDuckGo，国内可达）
 *   3) 字标兜底
 */
export default function CompanyLogo({
  companyId,
  size = 26,
}: {
  companyId?: string;
  size?: number;
}) {
  const c = companyId ? COMPANIES[companyId] : undefined;
  const [failed, setFailed] = useState(false);

  const domain = domainOf(c?.website);
  const src = c
    ? c.logo === true
      ? `/logos/${c.id}.svg`
      : typeof c.logo === "string"
      ? c.logo
      : domain
      ? `https://icons.duckduckgo.com/ip3/${domain}.ico`
      : undefined
    : undefined;

  if (src && !failed) {
    return (
      <span className="logo-chip has-img" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} />
      </span>
    );
  }

  let mark = (c?.nameEn ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  if (!mark) mark = (c?.name ?? "·").slice(0, 1);

  return (
    <span className="logo-chip" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {mark}
    </span>
  );
}

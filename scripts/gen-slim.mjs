/**
 * 从 companies.json 生成浏览器端用的瘦版 companies.slim.json。
 * 客户端(地图标签/引用 chip/logo/别名索引)只需要这些字段,
 * 完整数据(简介/新闻/财报等 1.6MB+)留在服务端,避免打进浏览器 JS 包。
 * 由 package.json 的 predev/prebuild 自动执行。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "app/data/companies.json");
const out = path.join(root, "app/data/companies.slim.json");

const full = JSON.parse(fs.readFileSync(src, "utf8"));
const slim = {};
for (const [id, c] of Object.entries(full)) {
  slim[id] = {
    name: c.name,
    nameEn: c.nameEn,
    kind: c.kind,
    ...(c.aliases && c.aliases.length ? { aliases: c.aliases } : {}),
    ...(c.hq ? { hq: c.hq } : {}),
    ...(c.website ? { website: c.website } : {}),
    ...(c.logo !== undefined ? { logo: c.logo } : {}),
  };
}
fs.writeFileSync(out, JSON.stringify(slim), "utf8");
const kb = (s) => Math.round(fs.statSync(s).size / 1024);
console.log(`gen-slim: ${kb(src)}KB -> ${kb(out)}KB (${Object.keys(slim).length} companies)`);

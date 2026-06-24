# 公司官方 logo

把每家公司的官方 logo 放进这个文件夹即可在地图景点、行程卡、公司页显示真 logo；
没放的公司自动回退到「深色金字字标」，不会出现白底。

## 怎么加一个 logo

1. 准备 logo 文件，**优先用透明背景的 SVG / PNG**（白底图会在暗色主题上很突兀）。
2. 命名为公司 id，放到这里。公司 id 见 `app/data/companies.ts` 的 key，例如：
   - `openai.svg`、`nvda.svg`、`googl.svg`、`anthropic.svg`、`unitree.svg` …
3. 在 `app/data/companies.ts` 给这家公司加一行 `logo: true`：
   ```ts
   nvda: { id: "nvda", name: "英伟达", ..., logo: true, ... },
   ```
   - 若文件不是 `.svg`（比如 png），写成 `logo: "/logos/nvda.png"`。

就这样。组件 `app/components/CompanyLogo.tsx` 会优先用真 logo，加载失败时再回退字标。

> 注意：公司 logo 多为注册商标，请确认你有权使用后再放入。

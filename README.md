# DesignRadar · 设计雷达

AI 模型 UI 设计评测 + 设计行业每日精选。

- **模型评测榜**（`/leaderboard`）：追踪 AI 模型生成网页与界面作品的真人盲选成绩（当前来自 LMArena WebDev 官方快照，CC BY 4.0 署名展示），另附综合参考榜。
- **设计日报**：每天 08:00 自动从设计工具官方博客、设计媒体、AI 评测信源抓取 → 模型预筛、两次独立评分、中文摘要写作 → 同一事件聚簇 → 出日报（周一出周报，每月 1 日出月报）。
- **热点与主题**：48 小时事件热度榜、公司/工具与方向主题页、全文搜索。
- **给 Agent 用**：RSS、公开 API（`/openapi-v1.json`）、MCP（`/api/mcp`）、`llms.txt`。

## 架构

基于开源框架 [AIHOT](https://github.com/KKKKhazix/AIHOT)（MIT）的行业包定制：站名、分类、信源、精选提示词都在 [`industry/`](industry/)，框架代码见原仓库与 `docs/`。

部署在 Vercel + Supabase（本仓库 `vercel.json`），GitHub 与 Vercel 关联，push 到 main 自动部署：

| 部分 | 运行位置 | 说明 |
|---|---|---|
| Web（React Router 8 SSR） | Vercel Function `api/ssr.mjs` | 静态资源走部署文件系统；api-owned 路径 rewrite 到 `api/server.mjs` |
| API（Fastify） | Vercel Function `api/server.mjs` | SSR、RSS、OG 图、公开 API、MCP 同源同域；运行时文件内嵌进 bundle（`deploy/embedded-fs.mjs`） |
| Worker（抓取/评分/聚簇/日报） | GitHub Actions 定时 | 每 30 分钟拉起一次 5 分钟窗口，跑满自动退出；迁移与种子同流程（手动 dispatch 可带 seed/leaderboard） |
| PostgreSQL | Supabase | API 与 worker 都走 session pooler；worker 需 `NODE_TLS_REJECT_UNAUTHORIZED=0`（pooler 私有 CA） |

## 本地开发

需要 Node 24+ 和一个 PostgreSQL 17（本地 Docker 或 Neon）：

```bash
npm install
cp .env.example .env   # 填 DATABASE_URL、LLM_API_KEY 等
node scripts/migrate.ts
node scripts/seed.ts   # 导入 industry/sources.json 的首批信源与主题
npm run dev:web        # http://127.0.0.1:3000
```

## 品牌资产生成

```bash
node scripts/make-brand.mjs                       # 从 industry/brand/logo-art.png 派生各尺寸图标与 favicon
npm pack @fontsource/noto-sans-sc@5.3.0 && tar xzf fontsource-noto-sans-sc-5.3.0.tgz
node scripts/nameplates.ts package                # 重新生成日报/周报/月报报头字
```

## 许可与署名

- 框架代码来自 [AIHOT](https://github.com/KKKKhazix/AIHOT)，MIT License（见 `LICENSE`、`NOTICE`）。
- 模型评测榜单数据来自公开评测（LMArena 等），署名与来源见 `/leaderboard/sources`。
- 站点内容为第三方原文的聚合摘要，原文版权归各来源所有。

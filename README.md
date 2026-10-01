# DesignRadar · 设计雷达

AI 模型 UI 设计评测 + 设计行业每日精选。

- **模型评测榜**（`/leaderboard`）：追踪 AI 模型生成网页与界面作品的真人盲选成绩（当前来自 LMArena WebDev 官方快照，CC BY 4.0 署名展示），另附综合参考榜。
- **设计日报**：每天 08:00 自动从设计工具官方博客、设计媒体、AI 评测信源抓取 → 模型预筛、两次独立评分、中文摘要写作 → 同一事件聚簇 → 出日报（周一出周报，每月 1 日出月报）。
- **热点与主题**：48 小时事件热度榜、公司/工具与方向主题页、全文搜索。
- **给 Agent 用**：RSS、公开 API（`/openapi-v1.json`）、MCP（`/api/mcp`）、`llms.txt`。

## 架构

基于开源框架 [AIHOT](https://github.com/KKKKhazix/AIHOT)（MIT）的行业包定制：站名、分类、信源、精选提示词都在 [`industry/`](industry/)，框架代码见原仓库与 `docs/`。

部署在 Vercel + Neon（本仓库 `vercel.json`）：

| 部分 | 运行位置 | 说明 |
|---|---|---|
| Web（React Router 8 SSR） | Vercel Function `api/ssr.ts` | 静态资源走部署文件系统；api-owned 路径 rewrite 到 `api/server.ts` |
| API（Fastify） | Vercel Function `api/server.ts` | SSR、RSS、OG 图、公开 API、MCP 同源同域 |
| Worker（抓取/评分/聚簇/日报） | GitHub Actions 定时 | `*/5` 分钟拉起一次，跑满窗口自动退出；迁移与种子同流程 |
| PostgreSQL | Neon | API 用 pooled 连接（`DATABASE_PREPARE=false`、`DATABASE_POOL_MAX=1`），worker 用直连 |

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

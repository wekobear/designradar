// 可选模块。leaderboard 在本站改为“AI 模型 UI 设计评测榜”（公开 aesthetics 板，数据来自 LMArena WebDev）。
// codexResetMonitor 只对 AI 行业有意义，本站关闭：导航不再出现入口，对应定时任务不运行，页面与接口返回 404。

export const FEATURES = {
  /** 模型榜：/leaderboard。每天抓 4 次评测来源，按公开方法计算各板排名。 */
  leaderboard: true,
  /** Codex 重置监控：盯 OpenAI Codex 负责人在 X 上的额度重置公告（/codex-reset）。需要 SocialData。 */
  codexResetMonitor: false,
} as const;

// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "eval", label: "评测", section: "模型评测与榜单", guide: "AI 模型在 UI、界面、视觉与创意能力上的评测结果、公开基准与榜单变化、模型设计能力对比、真人与专家盲选结果" },
  { key: "ai-design", label: "AI×设计", section: "AI×设计", guide: "AI 设计能力与生成式 UI 的发布与更新：文生 UI、界面生成、设计稿转代码、AI 设计助手、AI 网页与原型生成工具" },
  { key: "tool", label: "设计工具", section: "设计工具与生态", guide: "Figma、Sketch、Framer、Adobe、Canva 等设计工具与生态：功能更新、设计系统、插件、设计工程、协作与交付" },
  { key: "industry", label: "行业", section: "行业动态", guide: "设计行业动态：公司经营、融资并购、人事、政策监管、设计岗位与市场、行业大事件" },
  { key: "paper", label: "论文", section: "研究与论文", guide: "与 UI 生成、设计自动化、视觉理解相关的 AI 研究论文、基准与数据集" },
  { key: "tip", label: "教程", section: "技巧与观点", guide: "设计教程、AI 设计实操经验、提示词与工作流技巧、深度技术讲解" },
  { key: "opinion", label: "观点", section: "技巧与观点", guide: "设计师与研究者观点、评论、访谈、现象与趋势讨论" },
] as const;

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "评测/基准", "模型发布", "产品更新", "论文/研究", "开源/仓库", "教程/实践", "现象/趋势", "观点", "行业动态", "政策/监管", "非AI/通用工具", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "UI 生成", "设计到代码", "设计系统", "多模态", "图像生成", "视频", "3D", "Agent", "编码", "开源生态", "可访问性", "字体排版", "动效", "数据可视化", "设计工程", "提示词",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = [
  "Figma", "Framer", "Sketch", "Adobe", "Canva", "Webflow", "OpenAI", "Anthropic", "Google", "Meta", "Microsoft", "Vercel", "LMArena", "Hugging Face",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "文生UI": "UI 生成", "text-to-ui": "UI 生成", "生成式UI": "UI 生成", "generative-ui": "UI 生成", "界面生成": "UI 生成", "ui": "UI 生成", "UI设计": "UI 生成",
  "design-to-code": "设计到代码", "d2c": "设计到代码", "设计转代码": "设计到代码", "截图转代码": "设计到代码",
  "design system": "设计系统", "design-system": "设计系统", "tokens": "设计系统", "design tokens": "设计系统",
  "a11y": "可访问性", accessibility: "可访问性", 无障碍: "可访问性", "accessibility/无障碍": "可访问性",
  typography: "字体排版", 字体: "字体排版", 排版: "字体排版",
  motion: "动效", "动效设计": "动效", animation: "动效",
  visualization: "数据可视化", 可视化: "数据可视化", 图表: "数据可视化",
  "design engineering": "设计工程", "design-engineer": "设计工程",
  prompt: "提示词", "提示工程": "提示词", "prompting": "提示词",
  论文: "论文/研究", 研究: "论文/研究", paper: "论文/研究", papers: "论文/研究", benchmark: "评测/基准", 榜单: "评测/基准",
  "open-source": "开源/仓库", 开源: "开源/仓库", 仓库: "开源/仓库", repo: "开源/仓库",
  教程: "教程/实践", 指南: "教程/实践", 技巧: "教程/实践", 最佳实践: "教程/实践", 实践: "教程/实践",
  产品: "产品更新", 更新: "产品更新", 发布: "模型发布", 趋势: "现象/趋势", 现象: "现象/趋势",
  融资: "行业动态", 收购: "行业动态", 并购: "行业动态", 合作: "行业动态", 生态: "行业动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管",
  非ai: "非AI/通用工具", "non-ai": "非AI/通用工具", 通用工具: "非AI/通用工具",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  model_release: "模型发布", product_launch: "产品更新", tool_or_prompt: "教程/实践", research_paper: "论文/研究",
  industry_event: "行业动态", opinion_analysis: "观点", tutorial_explainer: "评测/基准",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/** 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  figma: { name: "Figma", displayTag: "Figma", aliases: ["Figma", "FigJam", "Figma Make", "Figma Slides", "Dev Mode"] },
  framer: { name: "Framer", displayTag: null, aliases: ["Framer"] },
  sketch: { name: "Sketch", displayTag: null, aliases: ["Sketch"] },
  adobe: { name: "Adobe", displayTag: "Adobe", aliases: ["Adobe", "Photoshop", "Illustrator", "Firefly", "Adobe XD", "Spectrum"] },
  canva: { name: "Canva", displayTag: null, aliases: ["Canva", "可画", "Affinity"] },
  webflow: { name: "Webflow", displayTag: null, aliases: ["Webflow"] },
  openai: { name: "OpenAI", displayTag: "OpenAI", aliases: ["OpenAI", "ChatGPT", "GPT", "Sora", "Codex", "Canvas"] },
  anthropic: { name: "Anthropic", displayTag: "Anthropic", aliases: ["Anthropic", "Claude"] },
  google: { name: "Google", displayTag: "Google", aliases: ["Google", "Gemini", "DeepMind", "Material Design", "谷歌", "Stitch"] },
  meta: { name: "Meta", displayTag: null, aliases: ["Meta", "Llama"] },
  microsoft: { name: "Microsoft", displayTag: null, aliases: ["Microsoft", "微软", "Copilot"] },
  vercel: { name: "Vercel / v0", displayTag: null, aliases: ["Vercel", "v0", "V0"] },
  lovable: { name: "Lovable", displayTag: null, aliases: ["Lovable"] },
  replit: { name: "Replit", displayTag: null, aliases: ["Replit", "Replit Agent"] },
  stackblitz: { name: "Bolt / StackBlitz", displayTag: null, aliases: ["StackBlitz", "Bolt", "bolt.new"] },
  cursor: { name: "Cursor", displayTag: null, aliases: ["Cursor", "Anysphere"] },
  lmarena: { name: "LMArena", displayTag: null, aliases: ["LMArena", "Chatbot Arena", "WebDev Arena", "Design Arena"] },
  designarena: { name: "Design Arena", displayTag: null, aliases: ["Design Arena", "designarena.ai"] },
  deepseek: { name: "DeepSeek", displayTag: null, aliases: ["DeepSeek", "深度求索"] },
  qwen: { name: "千问 Qwen", displayTag: null, aliases: ["Qwen", "通义", "阿里"] },
  zhipu: { name: "智谱 GLM", displayTag: null, aliases: ["智谱", "GLM", "Z.ai"] },
  kimi: { name: "Kimi / 月之暗面", displayTag: null, aliases: ["Kimi", "月之暗面", "Moonshot"] },
  xai: { name: "xAI", displayTag: null, aliases: ["xAI", "Grok"] },
  nvidia: { name: "NVIDIA", displayTag: null, aliases: ["NVIDIA", "英伟达"] },
  "hugging-face": { name: "Hugging Face", displayTag: "Hugging Face", aliases: ["Hugging Face"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "figma", name: "Figma", patterns: [/\bfigma\b|figjam/i] },
  { id: "framer", name: "Framer", patterns: [/\bframer\b/i] },
  { id: "sketch", name: "Sketch", patterns: [/\bsketch\.com\b/i, /(?<!\w)(Sketch)(?=\s*(?:App|软件|官方|发布|推出|更新|上线)|\s*\.com)/] },
  { id: "adobe", name: "Adobe", patterns: [/\badobe\b|photoshop|illustrator|firefly/i] },
  { id: "canva", name: "Canva", patterns: [/\bcanva\b|可画/i] },
  { id: "webflow", name: "Webflow", patterns: [/\bwebflow\b/i] },
  { id: "openai", name: "OpenAI", patterns: [/openai|chatgpt|\bgpt-?[o\d]|\bsora\b|\bcodex\b/i] },
  { id: "anthropic", name: "Anthropic", patterns: [/anthropic|\bclaude\b/i] },
  { id: "google", name: "Google / Gemini", patterns: [/google|deepmind|\bgemini\b|material\s?design|谷歌|stitch/i] },
  { id: "deepseek", name: "DeepSeek", patterns: [/deepseek|深度求索/i] },
  { id: "xai", name: "xAI / Grok", patterns: [/\bxai\b|\bgrok\b/i] },
  { id: "meta", name: "Meta / Llama", patterns: [/\bMeta\b/, /\bmeta\s?ai\b|\bllama\b/i] },
  { id: "microsoft", name: "Microsoft / Copilot", patterns: [/microsoft|copilot|微软/i] },
  { id: "nvidia", name: "NVIDIA", patterns: [/nvidia|英伟达|\bnemotron\b/i] },
  { id: "qwen", name: "千问 Qwen", patterns: [/\bqwen|通义|千问/i] },
  { id: "zhipu", name: "智谱 GLM", patterns: [/智谱|\bglm-?[4-9]/i] },
  { id: "kimi", name: "Kimi / 月之暗面", patterns: [/\bkimi\b|月之暗面|\bmoonshot\s?ai\b/i] },
  { id: "hugging-face", name: "Hugging Face", patterns: [/hugging\s?face/i] },
  { id: "cursor", name: "Cursor", patterns: [/\bCursor\b/, /\bAnysphere\b/] },
  { id: "vercel", name: "Vercel / v0", patterns: [/\bvercel\b/, /\bv0\b/i] },
  { id: "lovable", name: "Lovable", patterns: [/\blovable\b/i] },
  { id: "replit", name: "Replit", patterns: [/\breplit\b/i] },
  { id: "stackblitz", name: "Bolt / StackBlitz", patterns: [/stackblitz|\bbolt\.new\b|\bbolt\b(?=\s*(?:new|databases|artifact))/i] },
  { id: "lmarena", name: "LMArena", patterns: [/\blmarena\b|chatbot\s?arena|webdev\s?arena/i] },
  { id: "designarena", name: "Design Arena", patterns: [/design\s?arena/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "figma", domains: ["figma.com"] },
  { entityId: "framer", domains: ["framer.com"] },
  { entityId: "sketch", domains: ["sketch.com"] },
  { entityId: "adobe", domains: ["adobe.com"] },
  { entityId: "canva", domains: ["canva.com"] },
  { entityId: "webflow", domains: ["webflow.com"] },
  { entityId: "openai", domains: ["openai.com"] },
  { entityId: "anthropic", domains: ["anthropic.com", "claude.com"] },
  { entityId: "google", domains: ["deepmind.google", "ai.google", "blog.google", "web.dev", "developer.chrome.com"] },
  { entityId: "vercel", domains: ["vercel.com"] },
  { entityId: "lovable", domains: ["lovable.dev"] },
  { entityId: "replit", domains: ["replit.com"] },
  { entityId: "stackblitz", domains: ["stackblitz.com"] },
  { entityId: "cursor", domains: ["cursor.com"] },
  { entityId: "lmarena", domains: ["lmarena.ai"] },
  { entityId: "designarena", domains: ["designarena.ai"] },
  { entityId: "deepseek", domains: ["deepseek.com"] },
  { entityId: "xai", domains: ["x.ai"] },
  { entityId: "qwen", domains: ["qwen.ai"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "nvidia", domains: ["nvidia.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "zhipu", pattern: /\bZhipu(?:\s+AI\b|['’]s\b)/i },
  { entityId: "vercel", pattern: /\bv0(?:\.dev|app)\b/i },
];

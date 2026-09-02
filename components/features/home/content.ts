/**
 * 首页文案与数据，逐字提取自旧静态首页 public/six-credit/index.html。
 * 任何文案调整都应先对照旧页面，保持逐字一致。
 */

export type DimensionId =
  | "identity"
  | "time"
  | "environment"
  | "character"
  | "social"
  | "civilization";

export interface Dimension {
  id: DimensionId;
  /** 面板左上角序号，如 "01 / 06" */
  number: string;
  /** 装饰用大数字，如 "1" */
  rawNumber: string;
  /** 维度全名，如 "标签信用" */
  name: string;
  /** 维度短名，如 "标签"（成长路径与卡片 chip 使用） */
  shortName: string;
  /** 英文名，如 "Identity Credit" */
  en: string;
  /** 生命树隐喻，如 "叶片" */
  metaphor: string;
  /** 成长阶段，如 "被看见" */
  stage: string;
  /** 核心动作行，如 "核心动作 · 被看见" */
  action: string;
  question: string;
  definition: string;
  proof: string;
  quote: string;
  /** 维度主题色 */
  color: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "identity",
    number: "01 / 06",
    rawNumber: "1",
    name: "标签信用",
    shortName: "标签",
    en: "Identity Credit",
    metaphor: "叶片",
    stage: "被看见",
    action: "核心动作 · 被看见",
    question: "你是谁？",
    definition:
      "社会给予个人的身份识别系统，是进入任何关系的第一步入口。学历、职业、作品和经历降低了陌生人认识你的成本。",
    proof:
      "建立清晰、真实、可复核的专业身份；让别人第一次接触你时，知道为什么值得继续了解。",
    quote: "标签可以让你被看见，却不能保证你一直值得相信。",
    color: "#d9ad57",
  },
  {
    id: "time",
    number: "02 / 06",
    rawNumber: "2",
    name: "时间信用",
    shortName: "时间",
    en: "Time Credit",
    metaphor: "年轮",
    stage: "被观察",
    action: "核心动作 · 被观察",
    question: "你是否一直如此？",
    definition:
      "时间对一个人长期价值选择的持续记录。它不是简单坚持，而是重复行动、长期一致与周期穿越共同形成的稳定预期。",
    proof:
      "在没有掌声、反馈和即时结果的时候持续行动，让多年后的记录彼此一致，而不是互相否定。",
    quote: "时间不是在奖励你。时间是在记录你。",
    color: "#6e98aa",
  },
  {
    id: "environment",
    number: "03 / 06",
    rawNumber: "3",
    name: "环境信用",
    shortName: "环境",
    en: "Environmental Credit",
    metaphor: "土壤与风雨",
    stage: "被验证",
    action: "核心动作 · 被验证",
    question: "变化之后，你还是你吗？",
    definition:
      "现实在顺境、逆境、利益、竞争与失败中对一个人的压力测试。时间验证持续性，环境验证稳定性。",
    proof:
      "观察自己在资源增加、关系改变、诱惑出现或结果失败时，是否仍保持同一种价值排序。",
    quote: "环境不是背景，环境是试金石。",
    color: "#b9684d",
  },
  {
    id: "character",
    number: "04 / 06",
    rawNumber: "4",
    name: "人格信用",
    shortName: "人格",
    en: "Character Credit",
    metaphor: "根系",
    stage: "被信任",
    action: "核心动作 · 被信任",
    question: "你到底是什么样的人？",
    definition:
      "标签、时间与环境共同验证后，沉淀出的内在稳定性。当利益、压力、诱惑和现实同时出现时，你最终选择什么。",
    proof:
      "在无人监督时仍然守住底线；犯错之后愿意承担；让别人能够放心把重要的人和事托付给你。",
    quote: "真正的人格信用，是在巨大利益面前，依然知道什么不能卖。",
    color: "#8d78a0",
  },
  {
    id: "social",
    number: "05 / 06",
    rawNumber: "5",
    name: "社会信用",
    shortName: "社会",
    en: "Social Credit",
    metaphor: "树冠与生态",
    stage: "被连接",
    action: "核心动作 · 被连接",
    question: "为什么别人愿意相信你？",
    definition:
      "个人可靠性在关系网络中的传播与放大。别人不只认识你，还愿意因为相信你而与你建立长期关系。",
    proof:
      "用真实合作、长期履约和可被他人转述的口碑，让个人信用成为关系网络中的连接理由。",
    quote: "最高级的社会信用，是当你不在场时，依然有人愿意相信你。",
    color: "#7fa06d",
  },
  {
    id: "civilization",
    number: "06 / 06",
    rawNumber: "6",
    name: "文明信用",
    shortName: "文明",
    en: "Civilization Credit",
    metaphor: "果实与种子",
    stage: "被铭记",
    action: "核心动作 · 被铭记",
    question: "你的存在改变了什么？",
    definition:
      "个人价值超越自身生命周期后的长期影响。思想、作品、制度、方法与精神被后来者继承，新的生命因此继续生长。",
    proof:
      "创造即使离开你仍能帮助他人的东西，让价值不依赖个人在场，也不以被记住为唯一目的。",
    quote: "文明信用不是让别人记住你，而是让你留下的东西继续生长。",
    color: "#e0b84f",
  },
];

export type ModelId = "pyramid" | "tree";

export interface CreditModel {
  id: ModelId;
  /** 切换 tab 文案 */
  tab: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 模型类型行，如 "成长模型 · PYRAMID" */
  label: string;
  title: string;
  description: string;
  answer: string;
  structure: string;
  focus: string;
}

export const MODELS: CreditModel[] = [
  {
    id: "pyramid",
    tab: "六维信用金字塔",
    src: "/six-credit/assets/pyramid.png",
    alt: "六维信用体系金字塔模型",
    width: 1536,
    height: 1024,
    label: "成长模型 · PYRAMID",
    title: "金字塔看高度",
    description:
      "它强调层级、路径与跃迁：一个人先被看见，再被观察、被验证、被信任、被连接，最终被铭记。",
    answer: "一个人如何成长？",
    structure: "标签 → 时间 → 环境 → 人格 → 社会 → 文明",
    focus: "看清所处阶段，找到下一次信用跃迁",
  },
  {
    id: "tree",
    tab: "六维信用生命树",
    src: "/six-credit/assets/life-tree.png",
    alt: "六维信用生命树模型",
    width: 1402,
    height: 1122,
    label: "运行模型 · LIFE TREE",
    title: "生命树看生命",
    description:
      "它强调根系、主体、生态与传承：人格提供根基，环境带来验证，时间形成记录，标签负责被看见，社会形成连接，文明完成传承。",
    answer: "六种信用如何共同运行？",
    structure: "根系 × 年轮 × 风雨 × 叶片 × 树冠 × 种子",
    focus: "理解信用的循环、支撑关系与长期生命力",
  },
];

export interface CaseStudy {
  id: string;
  /** 卡片分类，如 "商业文明" */
  category: string;
  /** 人物名，如 "于东来" */
  person: string;
  /** 弹窗顶部标签，如 "商业文明 · 于东来" */
  label: string;
  title: string;
  /** 卡片摘要 */
  description: string;
  /** 卡片维度 chip（短名） */
  tags: string[];
  /** 弹窗导语 */
  summary: string;
  /** 弹窗维度 chip（全名） */
  dimensions: string[];
  question: string;
  evidence: string[];
  quote: string;
}

export const CASES: CaseStudy[] = [
  {
    id: "yudonglai",
    category: "商业文明",
    person: "于东来",
    label: "商业文明 · 于东来",
    title: "30年之后，一家超市为什么开始影响商业文明？",
    description:
      "从经营选择、员工关系到社会影响，看个人信用如何由时间沉淀，再向制度与文明扩散。",
    tags: ["时间", "人格", "社会", "文明"],
    summary:
      "于东来的价值不只在于一家企业经营得好，而在于长期一致的价值选择开始被员工、顾客、同行和公共讨论反复验证。个人信用由此越过商业结果，进入可传播、可学习的制度样本。",
    dimensions: ["时间信用", "人格信用", "社会信用", "文明信用"],
    question:
      "当一种经营选择被坚持30年，它还是个人风格，还是已经成为一种可以被社会继承的商业文明？",
    evidence: [
      "长期坚持以员工尊严、顾客信任和商品质量作为经营排序，而非只在舆论高点表达。",
      "不盲目扩张、主动约束规模等选择，让商业原则在利益压力下继续被验证。",
      "当同行开始学习、公众开始跨地域传播时，个人可靠性逐渐转化为社会信用网络。",
    ],
    quote:
      "社会信用，是你的树荫覆盖多少人；文明信用，是你的种子能够长出多少棵新的树。",
  },
  {
    id: "wangjibing",
    category: "时间复利",
    person: "王计兵",
    label: "时间复利 · 王计兵",
    title: "鲁迅文学奖，只是时间完成第38年审计后的公章",
    description:
      "身份可以突然改变，但真正托住一次“被看见”的，是此前漫长、安静而连续的生命记录。",
    tags: ["标签", "时间", "人格", "文明"],
    summary:
      "“外卖诗人”是被看见后的标签，但它不是价值的起点。真正托住这个标签的，是多年持续写作留下的年轮。奖项让社会集中看见了一段长期记录，而不是凭空创造了一个诗人。",
    dimensions: ["标签信用", "时间信用", "人格信用", "文明信用"],
    question:
      "一次被看见，究竟是偶然爆红，还是时间信用在某一天的集中兑现？",
    evidence: [
      "在工作与生活压力中长期持续写作，记录没有因为缺少即时反馈而中断。",
      "身份变化之后仍保持原有生活与创作节奏，标签没有反过来吞噬人格。",
      "普通劳动者的经验进入文学公共空间，让更多微小而真实的生命获得表达位置。",
    ],
    quote: "所有一夜成名的人，不过都是时间信用在某一天集中兑现。",
  },
  {
    id: "zhangguowei",
    category: "身份重构",
    person: "张国伟",
    label: "身份重构 · 张国伟",
    title: "“带货养梦”如何把两种冲突标签重新焊在一起？",
    description:
      "当运动员、内容创作者与商业主播三个身份相遇，持续训练与透明选择成为重构信用的锚。",
    tags: ["标签", "时间", "人格", "社会"],
    summary:
      "运动员、内容创作者与商业主播看似互相冲突。真正决定标签能否共存的，不是解释得多漂亮，而是持续训练、亲自验证产品和公开资金用途等行为证据能否形成同一条价值链。",
    dimensions: ["标签信用", "时间信用", "人格信用", "社会信用"],
    question:
      "当旧身份无法继续支撑梦想，一个人能否用新的社会连接，反过来滋养原来的长期选择？",
    evidence: [
      "退役与内容爆红之后仍持续训练，让“运动员”不是只被消费的旧标签。",
      "商业行为强调亲自核验与责任承担，用人格信用连接流量与交易。",
      "将商业收入与训练目标建立透明关系，使社会信用重新支撑时间信用。",
    ],
    quote:
      "标签可以变化，但真正的身份重构，必须由持续行为而不是一句新口号完成。",
  },
  {
    id: "liyapeng",
    category: "信用修复",
    person: "李亚鹏",
    label: "信用修复 · 李亚鹏",
    title: "信用修复为什么不是一次漂亮的“洗白”？",
    description:
      "标签与社会评价可以跌落，但多年可审计的公益记录，仍可能成为重新建立稳定预期的基础。",
    tags: ["时间", "人格", "社会", "文明"],
    summary:
      "信用并不是全有或全无。商业判断、社会评价与公益记录可以在不同维度呈现不同状态。真正的修复不能靠叙事覆盖争议，只能靠已有证据、责任承担和新的时间记录逐步完成。",
    dimensions: ["时间信用", "人格信用", "社会信用", "文明信用"],
    question:
      "当标签信用和社会信用受损，一个人还可以依靠哪些可审计的长期记录重新建立稳定预期？",
    evidence: [
      "多年公益投入构成独立于短期舆论的时间证据，不能被一次评价完全抹去。",
      "面对债务与经营问题时，是否真实说明、持续承担，决定人格信用能否修复。",
      "社会重新评估一个人，需要至少两到三个维度长期提供一致且可核验的新记录。",
    ],
    quote: "信用可以修复，但没有底线的洗白，只会加速信用死亡。",
  },
  {
    id: "huxinyao",
    category: "选择密度",
    person: "胡心瑶",
    label: "选择密度 · 胡心瑶",
    title: "一个足够纯粹的选择，能否在瞬间击穿六个维度？",
    description:
      "时间长度并非唯一变量。某些在极端处境中作出的选择，能够同时暴露一个人的价值排序。",
    tags: ["环境", "人格", "社会", "文明"],
    summary:
      "有些人的时间记录很长，有些选择的生命密度很高。一个人在自身处境艰难时仍主动把善意传向更远处，这种行为会同时暴露环境压力、人格排序、社会连接与文明意义。",
    dimensions: ["环境信用", "人格信用", "社会信用", "文明信用"],
    question:
      "信用一定只能慢慢积累吗？还是某些极端环境中的选择，能够让一个人的根在瞬间被看见？",
    evidence: [
      "环境越艰难，选择越能显示一个人的真实价值排序，而不只是顺境中的自我描述。",
      "从被帮助者转向帮助者，形成善意在关系网络中的继续传递。",
      "个体选择不以规模取胜，却能提供可被后来者继承的文明示范。",
    ],
    quote:
      "时间长度不是信用的唯一尺度，选择在压力中的纯度，同样会留下深刻年轮。",
  },
  {
    id: "jiaqianqian",
    category: "反面样本",
    person: "贾浅浅",
    label: "反面样本 · 贾浅浅",
    title: "当人格信用归零，漂亮标签为什么反而加速反噬？",
    description:
      "外部身份可以提供入口，却无法替代底层行为证据。信用乘积中的关键一维失守，会重估全部标签。",
    tags: ["标签", "时间", "环境", "人格"],
    summary:
      "标签能够提供入场机会，却也是一笔需要由行为偿还的预支信用。当作品、履历与真实能力之间无法互相证明，外部背书越强，环境变化之后产生的反噬也越大。",
    dimensions: ["标签信用", "时间信用", "环境信用", "人格信用"],
    question:
      "如果身份主要依赖他人的环境信用，而底层行为证据无法支撑，标签还能保护一个人多久？",
    evidence: [
      "学历、职位与家庭背景可以降低进入系统的门槛，却不能替代后续行为验证。",
      "负面记录在时间中持续叠加，会让时间从信用资产变成信用负债。",
      "当人格信用失守，曾经提供帮助的环境背书会被重新解释，并放大公众反噬。",
    ],
    quote: "所有标签都会过期。真正的信用建设，最终只能由自己完成。",
  },
];

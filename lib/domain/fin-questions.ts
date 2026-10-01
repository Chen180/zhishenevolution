/**
 * 财商等级测试的题目与维度定义。
 *
 * 维度设计来自《周文强之后，我们还敢谈财商吗》提出的五本书路径：
 * 认识钱 → 理解资产 → 理解财富观 → 理解人性 → 理解长期复利，
 * 最后走向自己的判断系统。每个维度对应一本共读书目，
 * 结果页据此给出延伸阅读（见 Resource/business/财商/product.md）。
 */

export const FIN_DIMENSION_ORDER = [
  "money",
  "asset",
  "values",
  "psychology",
  "compound",
  "judgment",
] as const;

export type FinDimensionId = (typeof FIN_DIMENSION_ORDER)[number];

export interface FinDimensionDefinition {
  id: FinDimensionId;
  name: string;
  role: string;
  metric: string;
  chapterTitle: string;
  chapterQuote: string;
  description: string;
  focusDescription: string;
  actions: readonly [string, string, string];
  book: { title: string; author: string; reason: string };
  color: string;
}

export const FIN_DIMENSIONS: Record<FinDimensionId, FinDimensionDefinition> = {
  money: {
    id: "money",
    name: "金钱认知",
    role: "地基",
    metric: "清晰度",
    chapterTitle: "先从钱本身开始。",
    chapterQuote: "财商的第一步，不是投资，而是先知道自己的钱去了哪里。",
    description: "你是否清楚自己的收入、支出与现金流，钱对你来说是不是一笔明白账。",
    focusDescription:
      "你对自己的钱还缺乏清晰的掌控。这并不意味着赚得少，而是钱来了就走，很难开始任何积累。先让钱变成一笔明白账。",
    actions: [
      "连续30天记录每一笔支出，月底看一次结构",
      "工资到账先转出10%，再安排消费",
      "建立一笔覆盖3个月生活费的备用金",
    ],
    book: {
      title: "小狗钱钱",
      author: "博多·舍费尔",
      reason: "财商启蒙第一课：钱不是只能被别人管理的东西，你可以认识它、管理它。",
    },
    color: "#d9ad57",
  },
  asset: {
    id: "asset",
    name: "资产思维",
    role: "框架",
    metric: "转化率",
    chapterTitle: "接下来，看你留下的东西。",
    chapterQuote: "关键不是赚了多少，而是赚到的钱最后留下了什么。",
    description: "你能否分清资产与负债，并把收入持续转化为能长期增值的东西。",
    focusDescription:
      "你的收入大多停在了消费和存款层面，还没有稳定地转化为资产。需要开始区分\"会下蛋的鹅\"和\"看起来值钱的东西\"。",
    actions: [
      "列出你的资产/负债清单，标出哪些在产生现金流",
      "下次买大件前，先问它三年后还留下什么价值",
      "把每月新增储蓄的一部分，固定转化为长期资产",
    ],
    book: {
      title: "富爸爸，穷爸爸",
      author: "罗伯特·清崎",
      reason: "提出的问题至今有效：资产和负债有什么区别？收入和财富是一回事吗？",
    },
    color: "#6e98aa",
  },
  values: {
    id: "values",
    name: "财富观",
    role: "方向",
    metric: "自洽度",
    chapterTitle: "再看你为什么而赚。",
    chapterQuote: "我的消费，到底是在满足自己，还是在证明自己？",
    description: "你是否清楚自己为什么赚钱、什么叫\"足够\"，消费是否服务于你认定的目标。",
    focusDescription:
      "你对钱的理解更多来自外部环境，而不是自己的答案。收入提高未必能缓解焦虑，因为\"足够\"的标准还没有建立。",
    actions: [
      "写下\"我为什么赚钱\"的三个真实答案并排序",
      "定义你的\"足够\"：一个具体数字加一种生活状态",
      "复盘三笔最大消费：它们满足了需要，还是证明了自己",
    ],
    book: {
      title: "有钱人和你想的不一样",
      author: "哈维·艾克",
      reason: "限制一个人的常常不是收入，而是他对钱的理解——每个人都有一套自己的财富观。",
    },
    color: "#b9684d",
  },
  psychology: {
    id: "psychology",
    name: "金钱心理",
    role: "镜子",
    metric: "稳定度",
    chapterTitle: "这一章，看自己。",
    chapterQuote: "钱的问题，很多时候其实是人的问题。",
    description: "面对贪婪、恐惧与从众时，你能否识别自己的情绪，而不被它替你做决定。",
    focusDescription:
      "在金钱决策中，情绪对你的影响可能超过你的预期。真正危险的往往不是不知道机会，而是不知道自己为什么被它吸引。",
    actions: [
      "下次心动时先问：我为什么这么想赚这笔钱",
      "为大额决策设24小时冷静期，不在情绪里下单",
      "记录一次情绪化消费或投资，写下当时的触发点",
    ],
    book: {
      title: "金钱心理学",
      author: "摩根·豪泽尔",
      reason: "人不是计算器。真正需要管理的不是钱，而是自己。",
    },
    color: "#8d78a0",
  },
  compound: {
    id: "compound",
    name: "长期复利",
    role: "杠杆",
    metric: "积累度",
    chapterTitle: "接下来，看时间。",
    chapterQuote: "不追每一个风口，而是建立时间越久、价值越高的东西。",
    description: "你是否在持续积累技能、作品、信誉等时间越久越值钱的资产。",
    focusDescription:
      "你的投入更多消耗在一次性的事情上，还没有形成稳定的复利积累。钱会花完，但技能、信誉和判断力会持续产生价值。",
    actions: [
      "选定一个每周固定投入的长期方向，先持续90天",
      "把\"快速赚钱的机会\"和\"长期积累\"分开记账",
      "盘点你拥有的非金钱资产：技能、作品、信誉、关系",
    ],
    book: {
      title: "纳瓦尔宝典",
      author: "埃里克·乔根森",
      reason: "从\"赚钱\"走向\"长期复利\"：技能、信誉、判断力，都是可以复利的资产。",
    },
    color: "#7fa06d",
  },
  judgment: {
    id: "judgment",
    name: "判断系统",
    role: "舵手",
    metric: "独立度",
    chapterTitle: "最后，看判断。",
    chapterQuote: "这条路适合我吗？这个时代还适合吗？如果失败，我承担得起吗？",
    description: "面对机会与建议时，判断权是否在你手里，以及你有没有一套自己的判断方法。",
    focusDescription:
      "你的财务决定还比较依赖他人的答案。判断力不是天生的，它来自知识、实践、复盘和真实世界的反馈。",
    actions: [
      "为重要财务决定建立自己的三问清单：适合我吗、还成立吗、输得起吗",
      "对一次跟随他人的决定做复盘：哪些判断本该自己做",
      "练习对\"看起来不错\"的机会说不，并写下理由",
    ],
    book: {
      title: "五本书合起来",
      author: "通往自己的判断系统",
      reason: "认识钱、理解资产、理解财富观、理解人性、理解长期复利——最后走向自己的判断系统。",
    },
    color: "#e0b84f",
  },
};

interface QuestionBase {
  id: string;
  number: number;
  dimension: FinDimensionId;
  prompt: string;
  helper?: string;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: "single";
  options: readonly string[];
  scoreDirection?: "ascending" | "descending";
  scores?: readonly number[];
  followUp?: {
    prompt: string;
    options: readonly string[];
    triggerFromIndex: number;
    neutralScoreWhenHidden: number;
  };
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: "multi";
  options: readonly string[];
  score: false;
}

export type FinQuestion = SingleChoiceQuestion | MultiChoiceQuestion;

export const FIN_QUESTIONS: readonly FinQuestion[] = [
  {
    id: "f01",
    number: 1,
    dimension: "money",
    type: "single",
    prompt: "过去三个月，你是否清楚自己的钱主要花在了哪里？",
    options: [
      "完全不清楚",
      "只有大概感觉",
      "知道几个大项",
      "比较清楚",
      "有持续记录，能说清结构",
    ],
  },
  {
    id: "f02",
    number: 2,
    dimension: "money",
    type: "single",
    prompt: "工资或收入到账之后，你通常的做法更接近：",
    options: [
      "来了就花，月底看剩多少",
      "先消费，有剩再存",
      "大致分配一下",
      "先存下一部分，再安排消费",
      "有固定的分配规则，并长期执行",
    ],
  },
  {
    id: "f03",
    number: 3,
    dimension: "money",
    type: "single",
    prompt: "面对一笔计划外的大额支出（如医疗、家电、人情），你通常：",
    options: [
      "只能靠借贷或分期",
      "会明显打乱当月生活",
      "动用存款可以应付",
      "有专门的备用金",
      "备用金充足，不影响其他计划",
    ],
  },
  {
    id: "f04",
    number: 4,
    dimension: "money",
    type: "single",
    prompt: "过去一年，你的储蓄情况更接近：",
    options: [
      "基本存不下钱",
      "偶尔能存一点",
      "有存，但不稳定",
      "比较稳定",
      "储蓄已经成为自动化习惯",
    ],
  },
  {
    id: "f05",
    number: 5,
    dimension: "asset",
    type: "single",
    prompt: "你对\"资产\"和\"负债\"的区分，目前更接近：",
    options: [
      "没有细想过",
      "大概听说过",
      "能说出两者的区别",
      "能用它分析自己拥有的东西",
      "买大件之前会用它做判断",
    ],
  },
  {
    id: "f06",
    number: 6,
    dimension: "asset",
    type: "single",
    prompt: "你赚到的钱，目前更多变成了：",
    options: [
      "消费完了",
      "银行存款",
      "一部分开始变成能增值的东西",
      "有比较明确的资产",
      "资产已经开始带来被动收入",
    ],
  },
  {
    id: "f07",
    number: 7,
    dimension: "asset",
    type: "single",
    prompt: "假设你的收入突然增加一倍，你认为自己更可能：",
    options: [
      "直接升级消费水准",
      "消费和储蓄都明显增加",
      "大部分存起来",
      "开始认真规划资产",
      "按已有的分配规则执行，消费变化不大",
    ],
  },
  {
    id: "f08",
    number: 8,
    dimension: "asset",
    type: "single",
    prompt: "你是否拥有\"下金蛋的鹅\"——即使不工作，也能持续带来一点收入的东西？",
    options: [
      "没有",
      "很少（如利息）",
      "有一些",
      "比较明确",
      "已占收入的可观比例",
    ],
  },
  {
    id: "f09",
    number: 9,
    dimension: "values",
    type: "single",
    prompt: "被问到\"你为什么想赚钱\"时，你的答案更接近：",
    options: [
      "没有认真想过",
      "大家都这样，我也一样",
      "为了安全感",
      "为了一些具体的生活目标",
      "很清楚，并且能排出优先级",
    ],
  },
  {
    id: "f10",
    number: 10,
    dimension: "values",
    type: "single",
    prompt: "你的消费更多是在：",
    options: [
      "证明自己，或跟随别人",
      "缓解压力和情绪",
      "满足当下的需要",
      "大多符合自己的真实需要",
      "大部分服务于我认定的长期目标",
    ],
  },
  {
    id: "f11",
    number: 11,
    dimension: "values",
    type: "single",
    prompt: "你心中有没有一个\"足够\"的标准——赚到或存到多少，就够了？",
    options: [
      "从没想过",
      "觉得越多越好",
      "模糊想过",
      "有大致的标准",
      "很明确，并且影响我的选择",
    ],
  },
  {
    id: "f12",
    number: 12,
    dimension: "values",
    type: "single",
    prompt: "看到别人晒收入、晒消费时，你通常：",
    options: [
      "很焦虑，觉得自己落后了",
      "会羡慕，并想跟随",
      "有波动，但能自己平复",
      "基本不受影响",
      "会回过头想自己真正要什么",
    ],
  },
  {
    id: "f13",
    number: 13,
    dimension: "psychology",
    type: "single",
    prompt: "看到别人靠某个项目赚到钱了，你的第一反应更接近：",
    options: [
      "马上想跟上",
      "很心动，想试试",
      "会先关注信息",
      "先问风险是什么",
      "先问\"这适合我吗\"",
    ],
  },
  {
    id: "f14",
    number: 14,
    dimension: "psychology",
    type: "single",
    prompt: "当有人告诉你\"这个项目收益很高\"时，你通常会：",
    options: [
      "尽快投钱，怕错过",
      "很心动，大概率参与",
      "了解清楚再说",
      "先问自己为什么心动",
      "先评估：如果失败，我承担得起吗",
    ],
  },
  {
    id: "f15",
    number: 15,
    dimension: "psychology",
    type: "single",
    prompt: "你有过\"亏了钱，想马上把它赚回来\"的经历吗？",
    options: ["从未有过", "有过一次", "有过几次", "多次", "经常如此"],
    followUp: {
      prompt: "当时你的处理更接近：",
      options: [
        "继续加仓，想尽快回本",
        "情绪化地频繁操作",
        "先停下来观望",
        "复盘亏损的原因",
        "按规则止损，并记录下教训",
      ],
      triggerFromIndex: 1,
      neutralScoreWhenHidden: 2,
    },
  },
  {
    id: "f16",
    number: 16,
    dimension: "psychology",
    type: "single",
    prompt: "过去一年，你有多少次\"买完就后悔\"的消费？",
    options: ["0次", "1～2次", "3～5次", "6～10次", "10次以上"],
    scoreDirection: "descending",
  },
  {
    id: "f17",
    number: 17,
    dimension: "compound",
    type: "single",
    prompt: "你在\"时间越长越值钱\"的东西上（技能、作品、信誉、关系）的投入更接近：",
    options: [
      "几乎没有",
      "偶尔想起来才做",
      "有一些投入",
      "比较稳定",
      "是我投入的重点",
    ],
  },
  {
    id: "f18",
    number: 18,
    dimension: "compound",
    type: "single",
    prompt: "面对一个\"来钱快\"、但需要放弃长期积累的机会，你通常：",
    options: [
      "会抓住，赚钱要紧",
      "很可能动摇",
      "视情况而定",
      "大多会拒绝",
      "有明确原则，基本不动摇",
    ],
  },
  {
    id: "f19",
    number: 19,
    dimension: "compound",
    type: "single",
    prompt: "过去一年，你是否有每周或每月都在坚持做的长期投入？",
    options: [
      "没有",
      "断断续续",
      "基本持续",
      "稳定持续",
      "已经成为生活的一部分",
    ],
  },
  {
    id: "f20",
    number: 20,
    dimension: "compound",
    type: "single",
    prompt: "面对 AI 正在替代越来越多技能的趋势，你更接近：",
    options: [
      "很焦虑，不知道怎么办",
      "有些担心",
      "在观望",
      "在学习使用 AI 工具",
      "在积累 AI 替代不了的东西：判断、信誉、作品",
    ],
  },
  {
    id: "f21",
    number: 21,
    dimension: "judgment",
    type: "single",
    prompt: "当有人告诉你\"这个项目稳赚\"时，你会：",
    options: [
      "很容易相信",
      "看对方是谁再决定信不信",
      "将信将疑",
      "先问风险是什么",
      "先判断：失败了我能不能承受",
    ],
  },
  {
    id: "f22",
    number: 22,
    dimension: "judgment",
    type: "single",
    prompt: "做重要的金钱决定之前，你通常：",
    options: [
      "凭感觉",
      "问朋友的意见",
      "看网上的评价",
      "自己收集信息再决定",
      "有自己的判断清单：适合我吗、还成立吗、输得起吗",
    ],
  },
  {
    id: "f23",
    number: 23,
    dimension: "judgment",
    type: "single",
    prompt: "过去一年，你有没有拒绝过一个\"看起来不错\"的机会？",
    options: [
      "没有",
      "有过，但后来后悔了",
      "有过一次",
      "有过几次",
      "经常能说\"不\"，并且清楚原因",
    ],
  },
  {
    id: "f24",
    number: 24,
    dimension: "judgment",
    type: "single",
    prompt: "你的财务决定，最终通常由谁拍板？",
    options: [
      "别人说什么就是什么",
      "很受他人影响",
      "商量之后决定",
      "参考意见，自己决定",
      "完全自己判断，并自己承担后果",
    ],
  },
  {
    id: "f25",
    number: 25,
    dimension: "judgment",
    type: "multi",
    prompt: "你目前最想改善的金钱问题是什么？",
    helper: "可多选，也可以暂时跳过；这道题不影响财商等级。",
    options: [
      "存不下钱",
      "不懂投资",
      "债务压力",
      "消费冲动",
      "收入来源单一",
      "不敢做决定",
      "被割过韭菜，不敢再信",
      "其他",
    ],
    score: false,
  },
] as const;

export const SCORED_QUESTION_COUNT = FIN_QUESTIONS.filter(
  (question) => question.type === "single",
).length;

export function getFinQuestion(id: string) {
  return FIN_QUESTIONS.find((question) => question.id === id);
}

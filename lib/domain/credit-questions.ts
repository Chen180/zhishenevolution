export const CREDIT_DIMENSION_ORDER = [
  "label",
  "time",
  "environment",
  "personality",
  "social",
  "civilization",
] as const;

export const QUIZ_DIMENSION_ORDER = [
  "personality",
  "time",
  "environment",
  "label",
  "social",
  "civilization",
] as const;

export type CreditDimensionId = (typeof CREDIT_DIMENSION_ORDER)[number];

export interface CreditDimensionDefinition {
  id: CreditDimensionId;
  name: string;
  role: string;
  metric: string;
  chapterTitle: string;
  chapterQuote: string;
  description: string;
  focusDescription: string;
  actions: readonly [string, string, string];
  color: string;
}

export const CREDIT_DIMENSIONS: Record<
  CreditDimensionId,
  CreditDimensionDefinition
> = {
  label: {
    id: "label",
    name: "标签信用",
    role: "叶片",
    metric: "可见度",
    chapterTitle: "接下来，看叶片。",
    chapterQuote: "标签不是你是谁，而是这个世界如何看见你。",
    description: "你的能力是否形成了清晰、独立、可识别的外部标签。",
    focusDescription:
      "你的真实能力还没有被稳定地看见。需要把方向、作品和可迁移能力沉淀为外界能够识别的证据。",
    actions: [
      "用一句话写清你长期解决的具体问题",
      "在未来30天完成一项可公开验证的代表成果",
      "减少频繁更换方向，为一个专业标签持续积累证据",
    ],
    color: "#2f855a",
  },
  time: {
    id: "time",
    name: "时间信用",
    role: "年轮",
    metric: "积累度",
    chapterTitle: "接下来，我们看你的时间。",
    chapterQuote: "真正的积累，不是做过多少事情，而是有多少事情经得起时间。",
    description: "你的投入是否穿越了时间，并从短期努力转化为长期积累。",
    focusDescription:
      "你的努力可能仍然比较分散，尚未形成可复用的长期资产。下一阶段需要减少重新开始，让一件重要的事持续留下痕迹。",
    actions: [
      "选择一个未来12个月不轻易更换的积累方向",
      "把长期目标拆成每周可持续的最小行动",
      "每月盘点一次能力、作品、资源和关系的新增资产",
    ],
    color: "#b7791f",
  },
  environment: {
    id: "environment",
    name: "环境信用",
    role: "土壤与风雨",
    metric: "验证度",
    chapterTitle: "接下来，看风雨。",
    chapterQuote: "一个人的信用，真正进入现实以后，才会接受验证。",
    description: "变化、顺境和逆境是否验证了你的适应力与原则稳定性。",
    focusDescription:
      "环境变化对你的方向和行动影响较大。需要建立不依赖单一平台的能力，并把挫折转化为下一次可使用的方法。",
    actions: [
      "列出离开当前平台后仍然成立的三项能力",
      "为最重要的不确定性准备一个可执行的替代方案",
      "对最近一次挫折做复盘，并形成一条新的行为规则",
    ],
    color: "#287c8e",
  },
  personality: {
    id: "personality",
    name: "人格信用",
    role: "根系",
    metric: "稳定度",
    chapterTitle: "先从你的根开始。",
    chapterQuote: "真正的信用，往往出现在无人监督和需要承担代价的时候。",
    description: "在利益冲突、无人监督和承诺成本上升时，你能否保持选择的一致。",
    focusDescription:
      "当承诺变得昂贵或利益发生冲突时，你的选择还不够稳定。需要先建立清楚的原则和可验证的兑现记录。",
    actions: [
      "写下三条即使有损失也不轻易改变的原则",
      "主动完成一项无人监督但已经承诺的事情",
      "出现失误时先确认责任，再提出修复方案和完成时间",
    ],
    color: "#85543a",
  },
  social: {
    id: "social",
    name: "社会信用",
    role: "树冠",
    metric: "连接度",
    chapterTitle: "接下来，看树冠。",
    chapterQuote: "一个人的价值，最终会进入人与人的关系网络。",
    description: "你的价值是否进入真实关系，并形成合作、推荐和信任网络。",
    focusDescription:
      "你的价值还没有充分进入关系网络。这通常不等于能力不足，而是合作结果和可信赖的连接仍需要主动建立。",
    actions: [
      "主动帮助三位可信赖的人解决一个具体问题",
      "完成合作后沉淀结果，并邀请对方给出真实反馈",
      "定期维护少量长期关系，不只在需要机会时联系",
    ],
    color: "#3269a8",
  },
  civilization: {
    id: "civilization",
    name: "文明信用",
    role: "果实与种子",
    metric: "传承度",
    chapterTitle: "最后，看果实。",
    chapterQuote:
      "真正值得留下的东西，不一定是名字，而是你离开之后仍能继续产生的价值。",
    description: "你创造的作品、方法或影响，是否开始超越个人并继续帮助别人。",
    focusDescription:
      "你已经积累了一些个人价值，但能够脱离本人继续使用和传播的成果还不多。需要开始把经验转化为作品、方法或机制。",
    actions: [
      "把一项个人经验整理成别人可以使用的方法",
      "选择一个超越短期个人回报的长期贡献主题",
      "记录你的方法被谁使用、如何改进以及产生了什么影响",
    ],
    color: "#c24d36",
  },
};

interface QuestionBase {
  id: string;
  number: number;
  dimension: CreditDimensionId;
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

export type CreditQuestion = SingleChoiceQuestion | MultiChoiceQuestion;

export const CREDIT_QUESTIONS: readonly CreditQuestion[] = [
  {
    id: "q01",
    number: 1,
    dimension: "personality",
    type: "single",
    prompt:
      "过去三年，你是否遇到过这样的情况：承认自己的错误，会让你承担明显损失？",
    options: ["从未遇到", "遇到过一次", "遇到过几次", "经常遇到", "很多次"],
    followUp: {
      prompt: "如果遇到，你当时的处理更接近：",
      options: [
        "尽量避免承担",
        "解释原因，承担一部分",
        "与对方协商解决",
        "主动承认并承担后果",
        "承担后果，并主动修复造成的影响",
      ],
      triggerFromIndex: 1,
      neutralScoreWhenHidden: 2,
    },
  },
  {
    id: "q02",
    number: 2,
    dimension: "personality",
    type: "single",
    prompt:
      "过去三年，你有没有做过这样一件事：没有人持续监督，但你仍然兑现了一个对自己有明显成本的承诺？",
    options: ["没有", "有过一次", "有过几次", "经常如此", "已经成为习惯"],
  },
  {
    id: "q03",
    number: 3,
    dimension: "personality",
    type: "single",
    prompt: "过去三年，你是否遇到过“明显利益”与你自己的原则发生冲突的情况？",
    options: ["从未遇到", "遇到过一次", "遇到过几次", "多次", "经常遇到"],
    followUp: {
      prompt: "当时最终的选择更接近：",
      options: [
        "接受利益",
        "接受利益，同时尽量降低影响",
        "协商寻找其他方案",
        "放弃利益",
        "放弃利益，并承担由此产生的损失",
      ],
      triggerFromIndex: 1,
      neutralScoreWhenHidden: 2,
    },
  },
  {
    id: "q04",
    number: 4,
    dimension: "personality",
    type: "single",
    prompt:
      "过去一年，你有没有因为一个真正了解你的人提出的反馈，而改变过自己对自己的判断或行为？",
    options: [
      "从来没有",
      "想过，但没有改变",
      "有过一次",
      "有过几次",
      "已经形成主动寻求反馈的习惯",
    ],
  },
  {
    id: "q05",
    number: 5,
    dimension: "personality",
    type: "single",
    prompt:
      "过去三年，你有没有遇到过这样的情况：继续履行一个承诺的成本，远远超过了最初的预期？",
    options: ["没有", "有过一次", "有过几次", "多次"],
    followUp: {
      prompt: "你最终更接近哪种处理方式？",
      options: [
        "直接放弃，没有进一步沟通",
        "尽量拖延",
        "主动重新协商",
        "尽可能完成",
        "无法完成时主动承担退出成本，并修复影响",
      ],
      triggerFromIndex: 1,
      neutralScoreWhenHidden: 2,
    },
  },
  {
    id: "q06",
    number: 6,
    dimension: "personality",
    type: "single",
    prompt:
      "过去一年，你有没有做过一件事：没有人知道，也不会给你带来直接回报，但你仍然认为自己应该做？",
    options: ["没有", "有过一次", "有过几次", "经常如此", "已经成为习惯"],
  },
  {
    id: "q07",
    number: 7,
    dimension: "personality",
    type: "single",
    prompt: "回看过去三年，你觉得自己的“说过的话”和“真正做出的选择”：",
    options: [
      "经常不一致",
      "有明显差距",
      "大部分情况下基本一致",
      "比较一致",
      "在重要事情上高度一致",
    ],
  },
  {
    id: "q08",
    number: 8,
    dimension: "time",
    type: "single",
    prompt: "过去五年，你最长持续投入一件真正重要的事情多久？",
    options: ["3个月以内", "3～6个月", "6～12个月", "1～3年", "3年以上"],
  },
  {
    id: "q09",
    number: 9,
    dimension: "time",
    type: "single",
    prompt:
      "过去三年，你有没有持续投入过一件长期没有明显回报，但你仍然认为值得做的事情？",
    options: ["没有", "3个月以内", "3～6个月", "6～12个月", "1年以上"],
  },
  {
    id: "q10",
    number: 10,
    dimension: "time",
    type: "single",
    prompt: "过去五年，你是否形成了一个比较稳定的长期积累方向？",
    options: ["没有", "经常变化", "正在形成", "比较明确", "非常明确，并持续多年"],
  },
  {
    id: "q11",
    number: 11,
    dimension: "time",
    type: "single",
    prompt: "过去一年，你有多少件重要事情经历过“开始—放弃—重新开始”？",
    options: ["0件", "1件", "2件", "3～4件", "5件以上"],
    scoreDirection: "descending",
  },
  {
    id: "q12",
    number: 12,
    dimension: "time",
    type: "single",
    prompt:
      "回看过去五年，你现在拥有的能力、作品、资源或关系，有多少明显来自过去的长期积累？",
    options: ["几乎没有", "少量", "一部分", "大部分", "很多核心资产都来自长期积累"],
  },
  {
    id: "q13",
    number: 13,
    dimension: "time",
    type: "single",
    prompt: "如果把过去五年看成一条时间线，你觉得自己的努力更接近：",
    options: [
      "不断重新开始",
      "做了很多事，但比较分散",
      "开始出现稳定积累",
      "已经形成明显复利",
      "今天的自己明显建立在过去的长期积累之上",
    ],
  },
  {
    id: "q14",
    number: 14,
    dimension: "environment",
    type: "single",
    prompt:
      "过去三年，你是否经历过改变原有职业、收入、生活方式或人生计划的重大变化？",
    options: [
      "没有",
      "有，但基本没有行动",
      "正在适应",
      "已经基本适应",
      "已经从变化中建立了新的能力",
    ],
    scores: [2, 1, 2, 3, 4],
  },
  {
    id: "q15",
    number: 15,
    dimension: "environment",
    type: "single",
    prompt: "如果你现在所在的平台、公司或行业明天发生重大变化，你认为自己：",
    options: [
      "很难重新开始",
      "需要较长时间恢复",
      "可以重新寻找方向",
      "有比较明确的替代路径",
      "已经在主动建立不依赖单一平台的能力",
    ],
  },
  {
    id: "q16",
    number: 16,
    dimension: "environment",
    type: "single",
    prompt: "过去三年，当你遭遇失败时，你通常首先做什么？",
    options: [
      "寻找外部原因",
      "先保护自己",
      "分析外部与自身原因",
      "主动复盘自己的责任",
      "把承担的责任进一步转化为新的行为规则",
    ],
  },
  {
    id: "q17",
    number: 17,
    dimension: "environment",
    type: "single",
    prompt: "当你的收入、职位或资源明显增加后，你的核心生活原则：",
    options: [
      "经常发生变化",
      "有较明显变化",
      "有一些变化",
      "基本稳定",
      "核心价值排序基本没有改变",
    ],
  },
  {
    id: "q18",
    number: 18,
    dimension: "environment",
    type: "single",
    prompt: "过去三年，你经历过的最大一次挫折之后，最终留下了什么？",
    options: [
      "主要是损失",
      "一些教训",
      "一些经验",
      "一套新的方法",
      "一套以后遇到类似问题仍然可以使用的原则",
    ],
  },
  {
    id: "q19",
    number: 19,
    dimension: "environment",
    type: "single",
    prompt: "面对无法预测结果的重要选择时，你更接近：",
    options: [
      "尽量不做选择",
      "等别人替我判断",
      "收集足够信息后再行动",
      "接受不确定性并制定应对方案",
      "即使结果未知，也能依据自己的核心原则做决定",
    ],
  },
  {
    id: "q20",
    number: 20,
    dimension: "label",
    type: "single",
    prompt:
      "如果让你用一句话向一个陌生人介绍自己，你能清楚说出自己目前主要在做什么吗？",
    options: ["完全不能", "比较模糊", "能说出大概方向", "比较清楚", "非常清楚，而且容易被记住"],
  },
  {
    id: "q21",
    number: 21,
    dimension: "label",
    type: "single",
    prompt:
      "除了学历、职位、公司名称之外，你有没有可以独立证明自己能力的作品、项目或成果？",
    options: ["没有", "很少", "有一些", "有比较明确的代表成果", "已经形成自己的成果体系"],
  },
  {
    id: "q22",
    number: 22,
    dimension: "label",
    type: "single",
    prompt: "如果明天离开现在的平台，你认为自己仍然拥有多少可以被独立识别的能力？",
    options: ["很少", "比较少", "一部分", "大部分", "核心能力基本不依赖当前平台"],
  },
  {
    id: "q23",
    number: 23,
    dimension: "label",
    type: "single",
    prompt: "过去三年，你是否在一个明确方向上持续建立自己的专业标签？",
    options: ["没有", "经常变化", "正在形成", "已经形成", "已经成为别人对我的稳定认知"],
  },
  {
    id: "q24",
    number: 24,
    dimension: "label",
    type: "single",
    prompt: "你现在拥有的社会标签，与你真正想成为的人，匹配程度如何？",
    options: ["完全不匹配", "不太匹配", "一半左右", "比较匹配", "高度匹配"],
  },
  {
    id: "q25",
    number: 25,
    dimension: "social",
    type: "single",
    prompt: "过去一年，有没有人因为信任你的能力或可靠性，主动把机会介绍给你？",
    options: ["没有", "1次", "2～3次", "4～5次", "5次以上"],
  },
  {
    id: "q26",
    number: 26,
    dimension: "social",
    type: "single",
    prompt: "当别人遇到你擅长的问题时，他们是否会主动来找你？",
    options: ["几乎不会", "很少", "偶尔", "经常", "已经形成稳定认知"],
  },
  {
    id: "q27",
    number: 27,
    dimension: "social",
    type: "single",
    prompt: "你目前是否拥有持续三年以上的稳定合作关系？",
    options: ["没有", "1个", "2～3个", "4～5个", "5个以上"],
  },
  {
    id: "q28",
    number: 28,
    dimension: "social",
    type: "single",
    prompt: "如果你今天不在场，有没有人愿意向别人介绍你，并为你的可靠性作证？",
    options: ["基本没有", "很少", "有一些", "有不少", "有一批人愿意主动为我背书"],
  },
  {
    id: "q29",
    number: 29,
    dimension: "social",
    type: "single",
    prompt: "你是否愿意用自己的信用，为一个你真正信任的人提供推荐、介绍或机会？",
    options: [
      "几乎不会",
      "很少",
      "视情况而定",
      "经常",
      "只要足够信任，就愿意承担信用成本",
    ],
  },
  {
    id: "q30",
    number: 30,
    dimension: "social",
    type: "single",
    prompt: "过去一年，你获得的重要机会主要来自哪里？",
    options: [
      "海投或公开竞争",
      "平台和公司分配",
      "自己主动寻找",
      "熟人介绍",
      "过去合作过的人主动推荐",
    ],
  },
  {
    id: "q31",
    number: 31,
    dimension: "social",
    type: "single",
    prompt:
      "如果你离开当前公司、平台或组织，你认为有多少人仍然愿意与你保持长期合作？",
    options: [
      "几乎没有",
      "少数",
      "一部分",
      "大部分重要关系",
      "已经形成独立于平台的稳定关系网络",
    ],
  },
  {
    id: "q32",
    number: 32,
    dimension: "civilization",
    type: "single",
    prompt: "你是否创造过一种东西，即使你离开，它仍然可以继续被别人使用？",
    options: [
      "没有",
      "有过一次",
      "有几次",
      "有比较明确的作品或方法",
      "已经形成可以持续产生价值的东西",
    ],
  },
  {
    id: "q33",
    number: 33,
    dimension: "civilization",
    type: "single",
    prompt: "有没有人因为你的帮助、作品、方法或思想，而进一步帮助了其他人？",
    options: ["不知道 / 没有", "可能有", "有过一次", "有过几次", "已经形成持续扩散"],
  },
  {
    id: "q34",
    number: 34,
    dimension: "civilization",
    type: "single",
    prompt: "你目前正在做的事情中，有多少已经不只是为了让自己获得更多？",
    options: ["几乎没有", "很少", "一部分", "比较多", "创造和贡献已经成为核心目标之一"],
  },
  {
    id: "q35",
    number: 35,
    dimension: "civilization",
    type: "single",
    prompt: "你有没有认真想过：如果未来没有人记住你的名字，你希望什么东西仍然留下？",
    options: ["从没想过", "偶尔想过", "开始思考", "已经比较明确", "已经开始用行动积累"],
  },
  {
    id: "q36",
    number: 36,
    dimension: "civilization",
    type: "multi",
    prompt: "未来五年，你最希望自己留下什么？",
    helper: "可多选，也可以暂时跳过；这道题不影响六维分数。",
    options: ["作品", "财富", "方法", "企业 / 组织", "思想", "帮助过的人", "家庭 / 下一代", "其他"],
    score: false,
  },
] as const;

export const SCORED_QUESTION_COUNT = CREDIT_QUESTIONS.filter(
  (question) => question.type === "single",
).length;

export function getCreditQuestion(id: string) {
  return CREDIT_QUESTIONS.find((question) => question.id === id);
}

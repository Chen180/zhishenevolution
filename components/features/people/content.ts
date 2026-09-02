/**
 * 「时代人物对照表」页面的全部结构化内容。
 * 文案逐字迁移自 public/six-credit/people.html。
 */

export type DimensionKey =
  | "label"
  | "time"
  | "environment"
  | "persona"
  | "social"
  | "civilization";

/** 评分档位：high 深绿 / mid 暗金 / low 陶土红 */
export type ScoreTone = "high" | "mid" | "low";

/**
 * 判定档位映射品牌色：
 * complete 信用完备/信用高洁 → green-deep
 * rebuilding 修复中/重构中 → gold
 * pure 信用纯净 → dim-social
 * broken 信用击穿 → dim-env
 */
export type VerdictKind = "complete" | "rebuilding" | "pure" | "broken";

export type DimensionLegend = {
  key: DimensionKey;
  icon: string;
  name: string;
  description: string;
};

export type PersonDimension = {
  dimension: DimensionKey;
  /** 维度评述正文 */
  text: string;
  /** 证据小字 */
  evidence: string;
  /** 评分符号，如 ⭐⭐⭐ / ⭐⭐ / ⭐ / ✗ */
  stars: string;
  /** 评分等级文字，如 极高 / 尚短 / 已清零 */
  level: string;
  tone: ScoreTone;
};

export type Person = {
  name: string;
  avatar: string;
  tag: string;
  /** 判定全文，如 "★★★★★ 信用完备" */
  verdict: string;
  verdictKind: VerdictKind;
  dimensions: PersonDimension[];
  /** 何明轩点评 */
  comment: string;
};

export type TableTone = ScoreTone | "mixed" | "rebuild";

export type TableCell = {
  label: string;
  tone: TableTone;
};

export type TableRow = {
  name: string;
  cells: TableCell[];
  overall: TableCell;
};

export type Insight = {
  num: string;
  title: string;
  body: string;
  tag: string;
};

export const PAGE_HEADER = {
  logo: "智神进化纪 · CREDITOSPHERE",
  title: "六维信用体系",
  titleHighlight: "时代人物对照表",
  subtitleLines: [
    "在AI可以伪造一切的时代，什么才是人类最后的\"硬通货\"？",
    "标签 · 时间 · 环境 · 人格 · 社会 · 文明 —— 六维信用，是唯一无法被批量生成的人格资产负债表。",
  ],
  meta: "主理人 何明轩 · 公众号「智神进化纪」 · 视频号「何明轩在进化」",
} as const;

export const MANIFESTO = "「信用即权力，价值即边疆」";

export const DIMENSION_LEGENDS: DimensionLegend[] = [
  { key: "label", icon: "🏷️", name: "标签信用", description: "你在特定领域的专业辨识度" },
  { key: "time", icon: "⏳", name: "时间信用", description: "长期言行一致穿越周期的证明" },
  { key: "environment", icon: "🌐", name: "环境信用", description: "所在圈层的势能反哺" },
  { key: "persona", icon: "💎", name: "人格信用", description: "无人监督时的道德选择" },
  { key: "social", icon: "🤝", name: "社会信用", description: "公共契约精神履约记录" },
  { key: "civilization", icon: "🔥", name: "文明信用", description: "推动普世价值的微进步" },
];

export const PEOPLE: Person[] = [
  {
    name: "于东来",
    avatar: "🏪",
    tag: "胖东来创始人 · 零售文明的\"叛徒与先知\"",
    verdict: "★★★★★ 信用完备",
    verdictKind: "complete",
    dimensions: [
      {
        dimension: "label",
        text: "从\"望月楼胖子店\"到被国务院总理座谈会邀请的零售标杆，标签完成从\"小店主→零售哲学家\"的跃迁。",
        evidence: "2026年7月13日受邀参加李强总理主持的经济形势座谈会；商务部等9部门发文全国推广胖东来模式。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
      {
        dimension: "time",
        text: "30年如一日坚守\"用真品换真心\"，1999年起将50%利润分给员工，2026年仍在执行。",
        evidence: "从2000年至今持续分配利润；2026上半年仅流失52名员工，流失率0.50%，管理层零离职。",
        stars: "⭐⭐⭐",
        level: "极深",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "从许昌、新乡两座城辐射全国，被央视《新闻联播》、人民日报、新华社反复背书。",
        evidence: "2026年7月连获国家级认可：全国超市百强第9→9部门点名→总理座谈会。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "persona",
        text: "\"不上市、不融资、不盲目扩张\"三条铁律，宁可少赚也不降质，主动设营收上限。",
        evidence: "2026年2月退休时公布四条终身铁律；设\"委屈奖\"5000-8000元保护员工尊严；每周二闭店。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "顾客跨省打卡、复购率常年居高、本地近两成消费流向胖东来，社会自发给予信任。",
        evidence: "2026上半年销售额145亿，同比增24%；员工平均月薪9598元，满意度超97%。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "civilization",
        text: "重新定义\"商业的本质是善良\"，为零售文明提供\"向善样本\"，影响一代中国企业家。",
        evidence: "丘成桐、向华强等跨界致敬；\"自由与爱\"成中国企业界罕见的精神纲领。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
    ],
    comment:
      "于东来是六维信用\"全满贯\"的极少数案例。他从没想过\"建体系\"，但他的每一步都在给六维充值：30年不跑路（时间）、分钱不手软（人格）、不上市不割韭菜（文明）。在AI时代，这种\"用一辈子证明自己不是算法\"的人，才是真正的稀缺资源。",
  },
  {
    name: "王虹",
    avatar: "🔬",
    tag: "菲尔兹奖得主 · 百年猜想的终结者",
    verdict: "★★★★★ 信用完备",
    verdictKind: "complete",
    dimensions: [
      {
        dimension: "label",
        text: "从北大本科生到IHES终身教授、纽约大学\"银教授\"，标签链无任何断裂。",
        evidence: "本科北大→巴黎综合理工→MIT博士→普林斯顿博士后→UCLA→NYU银教授→IHES终身教授。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
      {
        dimension: "time",
        text: "十余年深耕调和分析与几何测度论，2025年2月攻克三维挂谷猜想（百年难题）。",
        evidence: "2025年2月与Joshua Zahl合作完成三维挂谷猜想证明，2026年7月获菲尔兹奖。",
        stars: "⭐⭐⭐",
        level: "极深",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "横跨中法美三大学术体系，被全球顶级机构交叉验证。",
        evidence: "北大+巴黎综合理工+MIT+IHES+NYU五重顶级学术环境背书；韦东奕连续三天坐第一排听她讲座。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "persona",
        text: "\"数学没有国界，也没有性别差异\"——不消费女性身份，不民族主义叙事，纯粹以学问立身。",
        evidence: "面对\"首位中国籍女性菲尔兹奖\"标签，她说：\"我不认为男女在科学研究上有什么差别。\"",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "全球数学界共识性认可，菲尔兹奖评审零争议通过。",
        evidence: "2026年7月23日ICM开幕式全票通过；丘成桐评价\"精深的分析功底与几何直觉\"。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "civilization",
        text: "为全人类打开调和分析与几何测度论的全新研究疆域，激励全球女性投身数学。",
        evidence: "\"如果我的获奖能激励更多女性投身数学，我会感到非常荣幸。\"",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
    ],
    comment:
      "王虹的六维信用几乎\"出厂设置就是顶配\"——但她最了不起的一维是人格信用：在铺天盖地的\"女性+中国+菲尔兹\"叙事面前，她选择\"去标签化\"，只用方程说话。这种\"不被流量定义\"的定力，恰恰是AI时代最稀缺的人格资产。",
  },
  {
    name: "邓煜",
    avatar: "📐",
    tag: "菲尔兹奖得主 · 希尔伯特第六问题的征服者",
    verdict: "★★★★★ 信用完备",
    verdictKind: "complete",
    dimensions: [
      {
        dimension: "label",
        text: "北大→MIT→芝加哥大学教授，专攻偏微分方程与统计物理。",
        evidence: "2026年7月获菲尔兹奖；芝加哥大学教授；与马骁、Hani合作攻克希尔伯特第六问题。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
      {
        dimension: "time",
        text: "从2018年Hani在芝加哥会议找到他开始，7年磨一剑，完成125年未解的推导链。",
        evidence: "2018年底启动WKE研究→2024-2025年完成两篇里程碑论文→2026年菲尔兹奖。",
        stars: "⭐⭐⭐",
        level: "极深",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "北大+MIT+芝加哥大学三重顶级学术血统，国际合作网络强大。",
        evidence: "与密歇根大学博士后马骁、密歇根大学Zaher Hani组成跨国三人攻坚组。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "persona",
        text: "\"不能为了拿奖去做研究\"——拒绝功利化科研，坚守学术本真。",
        evidence: "科技日报专访：\"有些工作没得奖，也未必不重要，还是要专注自己喜欢的方向。\"",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "全球数学界对希尔伯特第六问题突破的共识性认可。",
        evidence: "丘成桐评价：\"这项工作源远流长，意义十分重大。\"",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "civilization",
        text: "首次从牛顿力学严格推导出流体方程，为物理定律建立数学公理基础。",
        evidence: "攻克1900年希尔伯特提出的23个问题之一，悬置125年；将影响通信技术、医学成像、AI等领域。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
    ],
    comment:
      "邓煜最打动我的一句——\"不能为了拿奖去做研究\"。在\"一切皆可量化考核\"的今天，他守住了学术最珍贵的一维：为问题本身着迷，而非为奖项打工。这种\"反KPI\"的人格信用，恰恰是AI永远无法生成的——因为AI没有\"热爱\"，只有\"优化\"。",
  },
  {
    name: "王计兵",
    avatar: "📝",
    tag: "外卖诗人 · 鲁迅文学奖得主 · 江苏省劳动模范",
    verdict: "★★★★☆ 信用高洁",
    verdictKind: "complete",
    dimensions: [
      {
        dimension: "label",
        text: "从\"外卖骑手\"到\"鲁迅文学奖诗人\"，标签跨度极大却无一造假。",
        evidence: "1969年生，初中辍学，做过建筑工、挖沙人、小贩、拾荒者，2018年注册外卖骑手，2026年获鲁奖。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
      {
        dimension: "time",
        text: "38年持续写作6000余首诗，从烟盒、废报纸到诗集出版，从未中断。",
        evidence: "1988年开始写作，2026年7月15日凭《低处飞行》获第九届鲁迅文学奖诗歌奖。",
        stars: "⭐⭐⭐",
        level: "极深",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "从底层劳动群体中被发现，被中国作协、央视、人民日报层层验证。",
        evidence: "中国作协会员，2025年央视春晚为王菲报幕，2026年获评江苏省劳动模范。",
        stars: "⭐⭐",
        level: "中等",
        tone: "mid",
      },
      {
        dimension: "persona",
        text: "获奖后说\"我始终是一条安静流淌的河流\"，拒绝被流量裹挟，继续送外卖。",
        evidence: "\"最近的一次外卖是昨天，只要我在昆山生活，就一直送外卖。\"获鲁奖后生活照常。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "社会价值远大于文学价值——他用\"外卖诗人\"身份撬动了文学界的\"新大众文艺\"格局。",
        evidence: "《赶时间的人》加印9次，登顶豆瓣诗歌榜首；2026年获鲁奖时正在送外卖。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "civilization",
        text: "让\"微光也能被看见\"，推动文学从\"皓月当空\"走向\"繁星满天\"的多元格局。",
        evidence: "\"如今的文学夜空，不是皓月当空的单一格局，而是繁星满天的多元图景。\"",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
    ],
    comment:
      "王计兵是六维信用里\"时间\"这一维的极致样本——38年，6000首诗，烟盒上写、等红灯时用语音录。AI能在三秒内生成一首\"像王计兵风格\"的诗，但它永远无法生成\"38年\"这个变量。时间信用，是AI时代人类最后的护城河。",
  },
  {
    name: "李亚鹏",
    avatar: "🦋",
    tag: "嫣然天使基金发起人 · 从\"商业败者\"到\"公益行者\"",
    verdict: "★★★☆☆ 信用修复中",
    verdictKind: "rebuilding",
    dimensions: [
      {
        dimension: "label",
        text: "从\"令狐冲\"到\"王菲前夫\"到\"商业失败者\"再到\"公益坚守者\"，标签经历了过山车式的重构。",
        evidence: "演员→投资人（雪山项目负债4000万）→公益人→2026年\"舆论翻身仗\"。",
        stars: "⭐⭐",
        level: "波动大",
        tone: "mid",
      },
      {
        dimension: "time",
        text: "17年持续投入嫣然天使基金，累计完成超11000台唇腭裂手术，7000名患儿全额免费。",
        evidence: "2006年发起嫣然天使基金→2012年建医院→2026年欠租危机→17年零财务违规。",
        stars: "⭐⭐⭐",
        level: "深厚",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "从被群嘲\"老赖\"到获新华社发文力挺，环境评价经历了剧烈反转。",
        evidence: "2026年1月获新华社评论《生意屡挫的李亚鹏，何以\"嫣然\"而\"天使\"？》肯定。",
        stars: "⭐⭐",
        level: "反转中",
        tone: "mid",
      },
      {
        dimension: "persona",
        text: "\"情怀大于能力\"——坦诚自己的商业短板，但17年从未放弃公益底线。",
        evidence: "2026年1月发31分钟视频《最后的面对》，直面欠租2000万；\"要饭也要做完手术\"。",
        stars: "⭐⭐",
        level: "有瑕疵",
        tone: "mid",
      },
      {
        dimension: "social",
        text: "17年公益零财务违规，但商业债务问题仍存争议，社会信用呈现\"双轨制\"。",
        evidence: "嫣然天使基金17年零财务违规（2014年民政部调查结论）；但个人连带债务270万未清。",
        stars: "⭐⭐",
        level: "分裂",
        tone: "mid",
      },
      {
        dimension: "civilization",
        text: "为7000名贫困唇腭裂患儿提供免费手术，推动中国公益医疗的文明进程。",
        evidence: "2026年8月回应\"地铁吐血女孩\"胡心瑶捐款，个人回捐2×99999元，完成善意闭环。",
        stars: "⭐⭐⭐",
        level: "较高",
        tone: "high",
      },
    ],
    comment:
      "李亚鹏是六维信用\"动态修复\"的经典案例。他的时间信用（17年公益）和文明信用（救助7000名患儿）始终在线，但标签信用和社会信用因商业失败而严重受损。这个故事告诉我们：六维信用不是\"全有或全无\"，它允许修复、允许反转——但前提是，你必须在至少两到三维也上\"经得起审计\"。",
  },
  {
    name: "胡心瑶",
    avatar: "💖",
    tag: "\"地铁吐血女孩\" · 罕见病患者 · 善意传递者",
    verdict: "★★★★☆ 信用纯净",
    verdictKind: "pure",
    dimensions: [
      {
        dimension: "label",
        text: "从\"地铁吐血女孩\"到\"嫣然天使基金捐赠人\"，标签完成了从\"被帮助者\"到\"帮助者\"的逆转。",
        evidence: "2026年3月因地铁吐血后默默擦血迹走红；7月31日收到华西医院病危通知；8月捐99999元。",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
      {
        dimension: "time",
        text: "多次收到病危通知仍坚持帮助他人，时间维度虽短但密度极高。",
        evidence: "收到病危通知当天（7月31日）仍完成捐款；长期运营\"鹿灵瑶病友之家\"帮助其他患者。",
        stars: "⭐⭐",
        level: "尚短",
        tone: "mid",
      },
      {
        dimension: "environment",
        text: "从重庆地铁到全国关注，被李亚鹏、嫣然天使基金、新华社等层层背书。",
        evidence: "李亚鹏个人回捐2×99999元；嫣然天使基金确认收到捐款；全网正能量传播。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "persona",
        text: "把救命钱捐出去、脱下外套擦血迹、对李亚鹏同事说\"没有任何诉求\"——纯粹到让人不安。",
        evidence: "\"如果不处理，别人一踩，会把地板弄得很脏\"；捐款备注\"长长久久\"寓意。",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "选择嫣然而非其他基金会，理由是\"我相信李亚鹏\"——这是社会信用的最高形式：信任传递。",
        evidence: "\"我相信李亚鹏，能守护和帮助更多人。\"",
        stars: "⭐⭐⭐",
        level: "极强",
        tone: "high",
      },
      {
        dimension: "civilization",
        text: "用一己之力完成\"善意接力\"的文明示范：被帮助的人，转身去帮助更弱的人。",
        evidence: "\"曾经大家赠予我的温暖，我想亲手传递给更多身处苦难的人。\"",
        stars: "⭐⭐⭐",
        level: "极高",
        tone: "high",
      },
    ],
    comment:
      "胡心瑶是六维信用里最特殊的一种——\"纯净型信用\"。她没有于东来的体量、王虹的学识、王计兵的38年积累，但她用一次\"把救命钱捐出去\"的选择，同时在六维上完成了\"瞬时满格\"。这说明：信用不一定要\"慢慢攒\"，一个足够纯粹的选择，可以在瞬间击穿所有维度。",
  },
  {
    name: "张国伟",
    avatar: "🦘",
    tag: "跳高名将 · 全网7000万粉 · \"带货养梦\"第一人",
    verdict: "★★★☆☆ 信用重构中",
    verdictKind: "rebuilding",
    dimensions: [
      {
        dimension: "label",
        text: "从\"跳高银牌得主\"到\"全网显眼包\"再到\"直播带货主播\"，标签在\"运动员\"和\"网红\"之间反复横跳。",
        evidence: "2015年北京世锦赛2米33银牌→2020退役→全网7000万粉→2026年7月直播首秀GMV破500万。",
        stars: "⭐⭐",
        level: "有分裂",
        tone: "mid",
      },
      {
        dimension: "time",
        text: "退役6年从未停止训练，2021年自费复出，2025年成都站2米24夺冠。",
        evidence: "\"只有在跳高的时候，我才知道我叫张国伟。\"每年训练开支不低于20万，全部自筹。",
        stars: "⭐⭐⭐",
        level: "深厚",
        tone: "high",
      },
      {
        dimension: "environment",
        text: "从国家队到\"体育圈个体户\"，环境从体制内降维到草根，但反手搭建了36人电商团队。",
        evidence: "2024年签约天津队回归职业赛场；电商团队从数人扩至36人；3万商家主动寻求合作。",
        stars: "⭐⭐",
        level: "中等",
        tone: "mid",
      },
      {
        dimension: "persona",
        text: "\"我是亲眼见过这个工厂、这个冷库，我看到我才敢卖\"——亲自核验选品，不卖惨。",
        evidence: "进零下十几度冷库查验海鲜；账号签名曾写\"不带货\"8年；首秀后说\"隔行如隔山，不拿时间往上砸根本学不到东西\"。",
        stars: "⭐⭐⭐",
        level: "较强",
        tone: "high",
      },
      {
        dimension: "social",
        text: "\"带货养梦\"模式透明度高——收入40%教练、30%康复、20%场地、10%备用金，专款专用。",
        evidence: "首秀GMV超500万；设立\"训练基金\"专款专用；\"厂家不赔，我带粉丝找厂家\"。",
        stars: "⭐⭐",
        level: "上升中",
        tone: "mid",
      },
      {
        dimension: "civilization",
        text: "为退役运动员探索出一条\"半竞技半商业\"的第三条路，改写中国运动员退役生存范式。",
        evidence: "\"拍摄视频是为了价值，直播带货也是为了价值。\"下一个目标：全运会冠军。",
        stars: "⭐⭐",
        level: "潜力大",
        tone: "mid",
      },
    ],
    comment:
      "张国伟最妙的地方在于：他把\"搞笑网红\"和\"严肃运动员\"两个看似矛盾的标签，用一条\"带货养梦\"的逻辑链焊在了一起。这给所有\"被时代抛弃的运动员\"提供了一个六维信用重构模板：时间信用（坚持训练）是锚，人格信用（亲自验货）是桥，社会信用（收入透明）是结果。",
  },
  {
    name: "贾浅浅",
    avatar: "📄",
    tag: "西北大学前副教授 · \"文二代\"信用崩塌样本",
    verdict: "★☆☆☆☆ 信用击穿",
    verdictKind: "broken",
    dimensions: [
      {
        dimension: "label",
        text: "曾经：诗人、副教授、作协候选人。现在：学术不端、撤销学位、开除教职——标签被一键清零。",
        evidence: "2026年7月15日西北大学通报：撤销硕士学位、副教授职称、教师资格，解除聘用关系。",
        stars: "✗",
        level: "已清零",
        tone: "low",
      },
      {
        dimension: "time",
        text: "5年3次翻车（诗歌争议→作协落选→学术实锤），时间维度上只有\"持续的负面记录\"。",
        evidence: "2021年\"屎尿体\"出圈→2022年作协除名→2026年学术不端实锤，时间越长越减分。",
        stars: "✗",
        level: "负值",
        tone: "low",
      },
      {
        dimension: "environment",
        text: "\"文二代\"光环曾是最大助力，如今成为最大反噬——父亲贾平凹的背书反而加重了信用破产。",
        evidence: "贾平凹曾公开夸女儿\"奇思妙想\"，多位文坛大佬写序力捧；翻车后集体沉默。",
        stars: "✗",
        level: "反噬",
        tone: "low",
      },
      {
        dimension: "persona",
        text: "16篇论文9篇抄袭、硕士学位论文抄、连\"米芾\"都能写成\"米蒂\"——态度层面的失守比能力更致命。",
        evidence: "西北大学调查：16篇论文中9篇大段重复未标注，6篇引用不规范，仅1篇清白。",
        stars: "✗",
        level: "击穿",
        tone: "low",
      },
      {
        dimension: "social",
        text: "公众对\"文坛圈层特权\"的愤怒，已从个人延伸到整个文学评价体系。",
        evidence: "网友：\"如果没有贾平凹，谁会看这些分行废话？\"新华社八字点评：\"或可自赏，莫付流觞。\"",
        stars: "✗",
        level: "崩塌",
        tone: "low",
      },
      {
        dimension: "civilization",
        text: "作为\"反面教材\"推动了学术诚信制度建设——以破坏文明的方式，意外促进了文明的自我修复。",
        evidence: "她的案例成为2026年学术诚信大讨论的核心样本，推动高校加强学术审查。",
        stars: "⭐",
        level: "反面教材",
        tone: "mid",
      },
    ],
    comment:
      "贾浅浅是六维信用的\"完美反面教材\"——她不是\"没信用\"，而是\"信用全维度击穿\"。最致命的一点是：她的标签信用完全建立在父亲的环境信用之上，一旦底层的人格信用（学术诚信）被戳破，整个信用大厦瞬间坍塌。这恰恰证明了六维信用的铁律：任何一维的\"0\"，都会让其他维度的\"高分\"全部归零。",
  },
];

export const TABLE_ROWS: TableRow[] = [
  {
    name: "于东来",
    cells: [
      { label: "极高", tone: "high" },
      { label: "极深", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极高", tone: "high" },
    ],
    overall: { label: "★★★★★", tone: "high" },
  },
  {
    name: "王虹",
    cells: [
      { label: "极高", tone: "high" },
      { label: "极深", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极高", tone: "high" },
    ],
    overall: { label: "★★★★★", tone: "high" },
  },
  {
    name: "邓煜",
    cells: [
      { label: "极高", tone: "high" },
      { label: "极深", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极高", tone: "high" },
    ],
    overall: { label: "★★★★★", tone: "high" },
  },
  {
    name: "王计兵",
    cells: [
      { label: "极高", tone: "high" },
      { label: "极深", tone: "high" },
      { label: "中等", tone: "mid" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极高", tone: "high" },
    ],
    overall: { label: "★★★★☆", tone: "high" },
  },
  {
    name: "胡心瑶",
    cells: [
      { label: "极高", tone: "high" },
      { label: "尚短", tone: "mid" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极强", tone: "high" },
      { label: "极高", tone: "high" },
    ],
    overall: { label: "★★★★☆", tone: "rebuild" },
  },
  {
    name: "李亚鹏",
    cells: [
      { label: "波动", tone: "mixed" },
      { label: "深厚", tone: "high" },
      { label: "反转中", tone: "mixed" },
      { label: "有瑕疵", tone: "mid" },
      { label: "分裂", tone: "mixed" },
      { label: "较高", tone: "high" },
    ],
    overall: { label: "★★★☆☆", tone: "mixed" },
  },
  {
    name: "张国伟",
    cells: [
      { label: "有分裂", tone: "mixed" },
      { label: "深厚", tone: "high" },
      { label: "中等", tone: "mid" },
      { label: "较强", tone: "high" },
      { label: "上升中", tone: "mid" },
      { label: "潜力大", tone: "mid" },
    ],
    overall: { label: "★★★☆☆", tone: "mixed" },
  },
  {
    name: "贾浅浅",
    cells: [
      { label: "已清零", tone: "low" },
      { label: "负值", tone: "low" },
      { label: "反噬", tone: "low" },
      { label: "击穿", tone: "low" },
      { label: "崩塌", tone: "low" },
      { label: "反面教材", tone: "mid" },
    ],
    overall: { label: "★☆☆☆☆", tone: "low" },
  },
];

export const INSIGHTS: Insight[] = [
  {
    num: "01",
    title: "信用是\"乘积\"而非\"求和\"",
    body: "于东来六维全满，所以他的品牌价值难以估量。贾浅浅一维归零（人格信用/学术诚信），全盘清零。六维信用的计算方式不是加法，而是乘法——任何一个维度的\"0\"，都会让总分归零。这就是为什么有些\"天才\"一夜之间什么都不是。",
    tag: "公式：信用 = 标签 × 时间 × 环境 × 人格 × 社会 × 文明",
  },
  {
    num: "02",
    title: "AI时代，\"时间\"是唯一无法伪造的维度",
    body: "AI可以生成标签（人设）、模拟人格（数字分身）、甚至制造虚假的社会互动（水军）。但有一样东西它做不了——让时间倒流，去伪造\"30年没跑路\"或\"38年写了6000首诗\"。在深度伪造泛滥的2026年，时间信用是人类最后的、也是最难攻破的堡垒。",
    tag: "于东来30年 · 王计兵38年 · 李亚鹏17年",
  },
  {
    num: "03",
    title: "\"纯净型信用\"可以在瞬间满格",
    body: "胡心瑶没有几十年的积累，但她用一次\"把救命钱捐出去\"的选择，同时在六维上完成了瞬时满格。这说明：信用不一定要\"慢慢攒\"，一个足够纯粹、足够勇敢的选择，可以在瞬间击穿所有维度。给\"普通人\"的希望是——你不需要成为于东来，你只需要做对一件事。",
    tag: "纯净 > 完美",
  },
  {
    num: "04",
    title: "信用可以修复，但有\"最低门槛\"",
    body: "李亚鹏从\"全网群嘲\"到\"新华社力挺\"，靠的不是公关，而是17年公益零违规的硬数据。张国伟从\"退役悲剧\"到\"带货养梦\"，靠的是6年不间断训练的身体证据。信用修复的前提是：你必须在至少两到三维上\"经得起审计\"。没有底线的\"洗白\"，只会加速信用死亡。",
    tag: "修复条件：≥2维可审计 + 时间持续",
  },
  {
    num: "05",
    title: "六维信用是AI时代的\"人格中央银行\"",
    body: "当AI可以伪造面容、声音、文字、甚至情感反应时，人类社会必须有一套\"非AI可生成\"的信任基础设施。六维信用体系就是这套基础设施——它不是道德评判，而是可量化、可审计、可修复的人格资产负债表。谁先建立这套体系，谁就拥有了AI时代最稀缺的\"信任货币发行权\"。",
    tag: "智神进化纪 · 经济建设的前提",
  },
];

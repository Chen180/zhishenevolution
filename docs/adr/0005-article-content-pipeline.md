# ADR 0005：文章内容管线——公众号母版留在 Resource，转换产物入库

- 状态：已接受
- 日期：2026-09-08

## 背景

站点新增「文章」栏目，内容源是公众号「智神进化纪」的历史长文
（`Resource/articles/YYYYMMDD_标题.md`）。按 ADR 0001 的约定，Resource
母版不进入 Git 与生产镜像，但页面内容必须在构建时可获得。这与
ADR 0004 思维模型管线面对的是同一类问题。

## 决策

- 沿用 ADR 0004 的管线模式：Resource 继续作为内容母版，不入 Git、
  不入镜像。
- 新增 `scripts/build-articles.mjs`（纯 Node，无新依赖），将每篇母版
  md 解析为结构化记录（slug、title、date、tags、excerpt、预解析的
  内容块 blocks），输出到 `data/articles.json` 并提交 Git。站点页面
  只读取转换产物，不直接读 Resource。
- 母版变更时手动执行 `npm run build:articles` 重新生成并提交产物。
  与 `build:models` 一致，不挂进 `build` 脚本，Docker 构建不依赖
  Resource。
- slug 直接取文件名（去掉 .md，含日期前缀与中文），保证同名文章
  （如两期《张雪机车创始人张雪》）slug 不冲突，且 URL 自带时序信息。
- 不引入 markdown 渲染器：正文在构建期被解析为 heading/paragraph
  两种内容块，React 直接渲染。公众号配图占位行（`图片`）、话题标签
  行与 END 之后的公众号固定尾注在构建期剥离，不进入产物。

## 备选方案

- 构建期直接读取 Resource：同 ADR 0004，生产镜像构建会失败，且把
  内部资料目录耦合进构建。
- 运行时引入 markdown 渲染器：公众号导出的 md 格式高度规整且混杂
  非 markdown 元素（图片占位行、话题标签行、尾注），构建期一次
  清洗比运行时每次清洗更简单，也省掉一个运行时依赖。
- slug 用拼音或序号：需要额外映射表维护，中文 slug 经 URL 编码后
  可直接路由，且文件名即 slug 可追溯到母版。

## 影响

- `data/articles.json` 是派生产物，手工编辑它无意义，改动应先改
  Resource 母版再重新生成。
- 转换脚本在解析结果不满足完整性断言（标题/摘要/正文块非空、slug
  唯一）时非零退出，防止残缺内容入库。
- 新增公开路由 `/articles`、`/articles/[slug]` 与 `/feed.xml`
  （RSS 2.0），sitemap 同步收录。

## 回滚

删除 `app/articles/`、`app/feed.xml/`、
`components/features/articles/`、`lib/domain/articles.ts`、
`data/articles.json`、`scripts/build-articles.mjs` 及相关测试、
sitemap 与导航入口。

# ADR 0004：思维模型内容管线——母版留在 Resource，转换产物入库

- 状态：已接受
- 日期：2026-09-08

## 背景

站点新增「世界顶尖 100 个思维模型」内容库。原始资料（
`Resource/世界顶尖100个思维模型.md`、
`Resource/思维模型_经典书籍映射表.md`）按 ADR 0001 的约定不进入
Git 与生产镜像，但页面内容必须在构建时可获得。

## 决策

- Resource 继续作为内容母版，不入 Git、不入镜像。
- 新增 `scripts/build-thinking-models.mjs`（纯 Node，无新依赖），
  将母版 md 解析为结构化 JSON，输出到 `data/thinking-models.json`
  并提交 Git。站点页面只读取转换产物，不直接读 Resource。
- 母版变更时手动执行 `npm run build:models` 重新生成并提交产物。
  Docker 构建不依赖 Resource。
- `Resource/世界顶尖100个思维模型.html`（暗色幻灯片）视觉风格与站点
  不一致，不整合；md 是唯一内容源。

## 备选方案

- 构建期直接读取 Resource：本地可行，但 Resource 被 .dockerignore
  排除，生产镜像构建会失败，且把内部资料目录耦合进构建。
- 把母版 md 直接提交进 Git：违背 ADR 0001 对内部资料的边界约定。
- 运行时引入 markdown 渲染器：内容结构高度规整（七个固定字段），
  结构化 JSON + React 渲染更简单，也省掉一个运行时依赖。

## 影响

- `data/thinking-models.json` 是派生产物，手工编辑它无意义，改动应
  先改 Resource 母版再重新生成。
- 转换脚本在解析结果不满足完整性断言（100 个模型、七字段齐全）时
  非零退出，防止残缺内容入库。
- 新增公开路由 `/models` 与 `/models/[id]`（100 个静态详情页）。

## 回滚

删除 `app/models/`、`components/features/thinking-models/`、
`lib/domain/thinking-models.ts`、`data/thinking-models.json`、
`scripts/build-thinking-models.mjs` 及相关测试与导航入口。

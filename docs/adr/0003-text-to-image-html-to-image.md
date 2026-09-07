# ADR 0003：长文转图在浏览器端渲染，引入 html-to-image

- 状态：已接受
- 日期：2026-09-07

## 背景

站点需要「长文转图片」工具：用户粘贴超长文案，生成 PNG 下载，用于
社交平台传播。后续测评结果分享卡片也需要同样的 DOM → 图片能力。

项目是单个全栈 Next.js 公开只读服务，没有用户账户与写操作，不希望
为截图引入服务端渲染进程或新的存储。

## 决策

- 新增 `/text-to-image` 公开页面，全部渲染在浏览器端完成：
  固定宽度排版预览 DOM，用 `html-to-image` 以 `pixelRatio: 2`
  截图生成 PNG，用户本地下载。
- 引入运行时依赖 `html-to-image`（纯 JS，无原生依赖，无服务端
  进程）。这是本决策唯一的依赖变更。
- 超长文案按段落贪心分页成多张图；分页的纯逻辑放在
  `lib/domain/text-pagination.ts`，不依赖 DOM 与框架。
- 用户输入不持久化、不上传，刷新即清空。

## 备选方案

- 服务端 Playwright/Puppeteer 截图：清晰度高、字体可控，但需要
  在镜像中携带浏览器二进制，显著增加镜像体积与 ECS 内存压力。
- 服务端 satori/resvg 渲染：体积小，但排版能力受限（仅 flex 子集），
  且仍需新增 Route Handler 与渲染依赖。
- 手写 canvas 绘制：无依赖，但中文换行、段落排版都要自己实现，
  维护成本高。

## 影响

- 图片质量取决于用户设备的浏览器与系统字体；极端超长内容受浏览器
  canvas 高度上限约束，超出时强制分页。
- `html-to-image` 进入客户端 bundle，仅 `/text-to-image` 页面加载。
- 后续测评分享卡片复用同一渲染方式，不新增截图依赖。

## 回滚

删除 `/text-to-image` 路由、对应 feature 组件与
`lib/domain/text-pagination.ts`，执行 `npm uninstall html-to-image`，
并移除导航入口。

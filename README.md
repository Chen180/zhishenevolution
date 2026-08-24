# 智神项目模板

这是智神体系 Web 应用、AI 工作流和内部工具的统一项目骨架。

模板默认提供：

- Node.js 22、Next.js 16、React 19 和严格 TypeScript
- Next.js App Router 和模块化单体边界
- ESLint、类型检查、Vitest 和生产构建脚本
- Next.js standalone 多阶段 Docker 镜像
- Docker Compose、Caddy、自动 HTTPS 和访问保护
- `/app/data` 持久化契约
- `/api/health` 健康检查
- 架构、部署和后续扩展规范

模板不包含任何具体业务、第三方 API 密钥、数据库或云厂商绑定。

## 创建项目

### 推荐：Gitee 模板功能

将本仓库设置为 Gitee 模板仓库。创建项目时点击“使用模板”或
“从模板创建”，填写新仓库名称即可获得独立项目。

这种方式不会让新项目错误地指向模板仓库。

### 备用：Git 克隆

```bash
git clone https://gitee.com/zhishengevolution/project_template.git my-project
cd my-project
git remote rename origin template
git remote add origin <新项目仓库地址>
git push -u origin HEAD
```

保留名为 `template` 的远程仓库，后续可以查看模板更新，但不要直接
合并所有变更。

## 首次调整

创建项目后依次完成：

1. 修改 `package.json` 中的 `name` 和 `version`。
2. 修改 `app/layout.tsx` 的标题和描述。
3. 用实际业务首页替换 `app/page.tsx`。
4. 修改 `.env.example` 中的镜像名称及业务变量。
5. 更新 README 的业务说明。
6. 上线公开网站前修改 `public/robots.txt`。
7. 在 `ARCHITECTURE.md` 中记录项目特有决策。

## 本地开发

要求 Node.js 22 和 npm。

```bash
nvm use
npm ci
npm run dev
```

Windows 没有 nvm 时，只需确认 `node --version` 为 `v22.x`。

访问 [http://localhost:3000](http://localhost:3000)。

健康检查：

```text
GET http://localhost:3000/api/health
```

## 质量检查

日常检查：

```bash
npm run check
```

发布前：

```bash
npm run verify
```

## 目录职责

```text
app/                 页面、布局和 HTTP API
components/ui/       通用 UI
components/features/ 业务组件
lib/domain/          纯业务规则
lib/application/     用例和流程编排
lib/infrastructure/  外部服务适配器
lib/config/          环境变量解析
tests/               单元、集成和端到端测试
data/                本地持久化数据
deploy/              网关配置
```

目录按业务需要创建。依赖方向和边界见
[ARCHITECTURE.md](./ARCHITECTURE.md)。

## 生产部署

默认使用 Docker Compose 和 Caddy。服务器只需安装 Docker，不需要
单独安装 Node.js、npm 或 Nginx。

```bash
bash docker-deploy.sh
```

脚本首次运行时会创建 `.env`、生成管理员密码哈希、构建镜像并启动服务。

完整操作见 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)。

## 模板更新

模板是创建项目时的快照，不会自动修改已有项目。

查看模板更新：

```bash
git fetch template
git log --oneline HEAD..template/main
```

只挑选适用于当前项目的提交：

```bash
git cherry-pick <commit>
```

涉及框架主版本、存储、认证和部署方式的更新，必须先评估并记录 ADR。

当前模板版本见 [`TEMPLATE_VERSION`](./TEMPLATE_VERSION)。

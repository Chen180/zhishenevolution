# 六维信用生命树

“智神进化纪”六维信用体系的公开展示站。首页呈现金字塔与生命树双模型、
六个信用维度和人物案例，时代人物对照表位于 `/people`，信用生命树测评
位于 `/credit-test`。

## 公开范围

- 主展示页、时代人物对照表和页面所需图片会进入生产镜像。
- `Resource/` 是本地原始资料目录，已被 Git 忽略。
- Markdown 母版、产品定位和其他内部资料不提供网页链接，也不会部署。
- 网站是公开只读入口，不要求账号或密码。
- 测评进度只保存在用户当前浏览器；服务端不持久化答题记录。

## 技术基线

- Node.js 22
- Next.js 16 App Router、React 19、strict TypeScript
- Next.js standalone Docker 镜像
- Docker Compose + Caddy
- `/api/health` 健康检查

架构边界见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 本地开发

本机不要求 Docker，但需要 Node.js 22：

```bash
npm ci
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

发布前运行：

```bash
npm run verify
```

## 大模型解读

测评始终先由本地规则生成六维分数和初步判断。未配置大模型或模型请求
失败时，用户仍可正常查看规则结果。

如需启用大模型辅助解读，在服务器 `.env` 中配置 OpenAI 兼容接口：

```bash
LLM_API_KEY='your-secret-key'
LLM_BASE_URL='https://api.example.com/v1'
LLM_MODEL='your-model-name'
```

密钥只在 Next.js 服务端读取。发送给模型的内容仅包含六维分数、完成度、
阶段和第 36 题的选项，不包含用户填写的补充文字。

## 服务器部署

服务器只需安装 Docker Engine 和 Docker Compose，不需要单独安装
Node.js、npm、Nginx 或 Caddy。

```bash
git clone https://gitee.com/zhishengevolution/zhishenevolution.git
cd zhishenevolution
bash docker-deploy.sh
```

首次运行只会询问：

1. 域名；没有域名时直接回车，使用公网 IP 的 `80` 端口。
2. Docker 镜像名；通常直接回车即可。

使用域名时，先把域名 A 记录解析到服务器公网 IP，并开放 `80/443`。
Caddy 会自动申请和续期 HTTPS 证书。

更新站点：

```bash
git pull --ff-only
docker compose up -d --build --remove-orphans
docker compose ps
```

完整部署和故障排查见 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)。

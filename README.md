# 六维信用生命树

“智神进化纪”六维信用体系的公开展示站。首页呈现金字塔与生命树双模型、
六个信用维度和人物案例，时代人物对照表位于 `/people`。

## 公开范围

- 主展示页、时代人物对照表和页面所需图片会进入生产镜像。
- `Resource/` 是本地原始资料目录，已被 Git 忽略。
- Markdown 母版、产品定位和其他内部资料不提供网页链接，也不会部署。
- 网站是公开只读入口，不要求账号或密码。

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

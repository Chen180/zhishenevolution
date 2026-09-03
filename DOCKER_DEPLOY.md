# Docker 部署说明

本文只说明服务器部署和日常运维。

生产环境运行两个容器：

- `app`：Next.js standalone 应用，只在 Docker 内部监听 `3000`。
- `caddy`：唯一公网入口，负责 HTTPS、安全响应头和反向代理。

应用数据保存在 Docker Volume，并挂载到 `/app/data`。

## 1. 服务器准备

阿里云 ECS 推荐：

- Ubuntu 22.04 或 24.04，x86_64
- 最低 2 核 2 GB，生产建议 2 核 4 GB
- 40 GB 以上系统盘
- 官方 Docker 镜像或干净 Ubuntu 镜像

不要选择预装 WordPress、宝塔、Nginx 或其他占用 `80/443` 端口的应用。

安全组：

| 端口 | 来源 | 用途 |
| --- | --- | --- |
| `22` | 仅可信 IP | SSH |
| `80` | `0.0.0.0/0` | HTTP 和证书签发 |
| `443` | `0.0.0.0/0` | HTTPS |

应用端口 `3000` 不对公网开放。

服务器只需要 Docker Engine 和 Docker Compose，不需要安装 Node.js、
npm、Nginx 或 PM2。镜像不在服务器上构建，对内存要求很低。

### 镜像仓库（ACR）

镜像通过阿里云容器镜像服务（ACR）个人版中转：

1. 开通 ACR 个人版，创建命名空间和镜像仓库，代码源选择「本地仓库」。
2. 在 ACR 控制台「访问凭证」中设置固定密码。
3. 本机和 ECS 分别登录，ECS 与 ACR 选同地域时可走内网地址：

```bash
docker login --username=<ACR账号> registry.cn-<地域>.aliyuncs.com
```

确认 Docker：

```bash
docker --version
docker compose version
```

## 2. 域名准备

使用域名时，将域名的 A 记录指向 ECS 公网 IP，并等待解析生效。
Caddy 会自动申请和续期 HTTPS 证书。

只有 IP 时可以先使用 `:80` 通过 HTTP 访问；配置域名后使用 Caddy
自动签发的 HTTPS 证书。

## 3. 获取项目

```bash
git clone <项目仓库地址>
cd <项目目录>
```

确认仓库中存在：

```text
Dockerfile
compose.yaml
docker-deploy.sh
deploy/Caddyfile
.env.example
```

## 4. 首次部署

先在本机构建并推送镜像（见第 5 节「发布」），再在服务器执行：

```bash
bash docker-deploy.sh
```

脚本会：

1. 检查 Docker 和 Compose。
2. 询问域名或 `:80`。
3. 询问 ACR 镜像地址。
4. 创建权限受限的 `.env`。
5. 拉取镜像并启动容器（服务器不构建）。

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

健康检查：

```bash
curl https://your-domain.example/api/health
```

健康接口只能返回非敏感状态。

## 5. 发布与自动更新

发布在本机完成（一次推送，两处）：

```bash
git push origin main        # 代码到 Gitee（存档）
bash deploy/publish.sh      # 镜像到 ACR（部署）
```

`publish.sh` 会用当前 git 短哈希和 `latest` 两个 tag 推送镜像。

服务器上的 cron 每 2 分钟检测一次 `latest` 镜像，发现新版本会自动
拉取并滚动重启（`deploy/auto-deploy.sh`）：

```bash
chmod +x deploy/auto-deploy.sh
crontab -e
```

```cron
*/2 * * * * /path/to/project/deploy/auto-deploy.sh >> /var/log/zhishenevo-deploy.log 2>&1
```

服务器上的 `APP_IMAGE` 必须与本机推送的 ACR 地址一致。重启过程只有
几十秒，期间服务短暂中断。

需要回滚时，在服务器指定历史版本 tag 重建：

```bash
# .env 中 IMAGE_TAG 改为目标 git 短哈希后：
docker compose pull && docker compose up -d
```

发布后确认健康：

```bash
docker compose ps
curl https://your-domain.example/api/health
```

## 6. 启停

停止：

```bash
docker compose stop
```

启动：

```bash
docker compose start
```

重启：

```bash
docker compose restart
```

删除容器但保留数据卷：

```bash
docker compose down
```

不要执行 `docker compose down -v`，该命令会删除应用数据和 Caddy 数据。

## 7. 配置

部署配置保存在 `.env`，该文件不得提交 Git。

修改配置后重新创建容器：

```bash
docker compose up -d --force-recreate
```

检查最终 Compose 配置：

```bash
docker compose config
```

新增业务环境变量时需要同步完成：

1. 写入 `.env.example`。
2. 在 `compose.yaml` 中传入应用容器。
3. 在应用启动阶段校验。
4. 更新项目文档。

### 可选：启用测评的大模型解读

信用测评不依赖大模型也能完成评分和初步判断。需要启用大模型辅助解读时，
在服务器 `.env` 追加 OpenAI 兼容接口配置（Kimi、DeepSeek 等均兼容）：

```bash
LLM_API_KEY='your-secret-key'
LLM_BASE_URL='https://api.moonshot.cn/v1'
LLM_MODEL='kimi-k2.6'
LLM_TIMEOUT_MS='12000'
LLM_TEMPERATURE='0.6'
LLM_RATE_LIMIT_MAX='5'
LLM_RATE_LIMIT_WINDOW_MS='600000'
```

Kimi 参数说明：代码会为 `kimi-*` 模型自动关闭思考模式（解读是短文本
任务，思考模式容易超过 30 秒超时）。非思考模式下 `kimi-k2.6` 只接受
`temperature=0.6`；DeepSeek 等服务商可用 `0.35` 获得更克制的输出。

可选：配置备用模型。主模型请求失败（超时、限流、服务异常）时自动
切换到备用模型重试一次：

```bash
LLM_BACKUP_API_KEY='your-backup-key'
LLM_BACKUP_BASE_URL='https://api.backup-example.com/v1'
LLM_BACKUP_MODEL='your-backup-model-name'
```

修改后重新创建应用容器：

```bash
docker compose up -d --build --remove-orphans
```

不要把填写了密钥的 `.env` 提交到 Git。公开测评接口会按访问来源限制
大模型调用频率；超出限制时自动返回规则解读。

## 8. 数据备份

创建备份目录并复制应用数据：

```bash
mkdir -p backup/data
docker compose cp app:/app/data/. ./backup/data/
cp .env ./backup/project.env
```

`project.env` 包含敏感配置，必须加密保存并限制访问权限。

恢复数据：

```bash
docker compose up -d app
docker compose cp ./backup/data/. app:/app/data/
docker compose restart app
```

备份必须定期执行恢复演练。只确认备份文件存在并不等于能够恢复。

## 9. 故障排查

容器未启动：

```bash
docker compose ps
docker compose logs --tail=200 app
docker compose logs --tail=200 caddy
```

端口被占用：

```bash
sudo ss -lntp | grep -E ':80|:443'
```

域名证书失败时检查：

- 域名是否解析到当前 ECS。
- 安全组是否开放 `80/443`。
- 服务器防火墙是否放行。
- 是否有其他服务占用端口。
- Caddy 日志中的具体错误。

应用不健康时在容器内检查：

```bash
docker compose exec app \
  node -e "fetch('http://127.0.0.1:3000/api/health').then(async r => {
    console.log(r.status, await r.text())
  })"
```

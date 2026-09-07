# ADR 0002：镜像在本机构建并推送 ACR，服务器只拉取不构建

- 状态：已接受
- 日期：2026-09-04

## 背景

ECS 内存较小（2 GB 级），Next.js 的 Docker 构建在服务器上耗时数分钟，
存在 OOM 风险。此前的流程是服务器从 Gitee 拉源码后本地构建，每次更新
都对 ECS 造成明显的 CPU 与内存压力。

ACR（阿里云容器镜像服务）新版控制台的代码源不再支持 Gitee，无法使用
「推送 Gitee 后云端自动构建」；GitHub 代码源在国内网络环境下不稳定。

## 决策

构建与部署分离：

- 本机通过 `deploy/publish.sh` 构建镜像，以 git 短哈希和 `latest` 双
  tag 推送到 ACR 个人版（代码源为「本地仓库」）。
- ECS 上的 cron 每 2 分钟执行 `deploy/auto-deploy.sh`，检测 `latest`
  镜像版本变化后 `docker compose pull` 并滚动重启，服务器不构建、
  不再依赖 git 仓库。
- `docker-deploy.sh` 首次部署同样改为拉取镜像。
- Gitee 继续作为代码存档与协作入口，发布动作是本机的
  `git push` + `bash deploy/publish.sh` 两步。

## 备选方案

- 服务器构建 + 加 swap：零架构改动，但每次更新仍占用 ECS 资源数分钟。
- GitHub 作为 ACR 构建源：推送与授权在国内网络下不稳定，且要求代码
  同步到境外平台。
- 迁移到云效 Codeup：放弃 Gitee 工作流，迁移成本没有对应收益。
- Gitee Webhook 触发服务器构建：实时但仍占 ECS 资源，且新增公网
  endpoint 扩大攻击面。

## 影响

- ECS 只运行容器，内存与 CPU 占用显著下降，小规格实例即可稳定运行。
- 发布依赖本机 Docker Desktop 与 ACR 访问凭证；换电脑发布需要先完成
  `docker login`。
- ECS 与本机的 `.env` 中 `APP_IMAGE` 必须指向同一个 ACR 镜像地址。
- ACR 个人版仓库默认私有，ECS 必须完成 `docker login` 才能拉取。

## 回滚

恢复服务器本地构建：在服务器仓库执行 `git pull --ff-only` 后运行
`docker compose up -d --build --remove-orphans`，并将
`deploy/auto-deploy.sh` 的 cron 条目移除或改回检测 git 提交的版本。

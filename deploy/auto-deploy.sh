#!/usr/bin/env bash
# 自动部署：检测 ACR 镜像是否有新版本，有则拉取并滚动重启。
# 镜像由本机 deploy/publish.sh 构建推送，服务器不构建、不需要 git 仓库。
# 由 cron 定期执行，例如每 2 分钟一次：
#   */2 * * * * /path/to/project/deploy/auto-deploy.sh >> /var/log/zhishenevo-deploy.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."

image="$(docker compose config --images app | head -1)"
if [ -z "$image" ]; then
  echo "[$(date '+%F %T')] failed to resolve app image from compose config" >&2
  exit 1
fi

before="$(docker image inspect -f '{{.Id}}' "$image" 2>/dev/null || true)"

docker compose pull --quiet app

after="$(docker image inspect -f '{{.Id}}' "$image")"

if [ "$before" = "$after" ]; then
  exit 0
fi

echo "[$(date '+%F %T')] new image detected for $image"

docker compose up -d --remove-orphans
docker image prune -f

echo "[$(date '+%F %T')] deploy finished: $after"

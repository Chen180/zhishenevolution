#!/usr/bin/env bash
# 自动部署：轮询 Gitee 远端，main 有新提交时拉取并滚动重建。
# 由 cron 定期执行，例如每 2 分钟一次：
#   */2 * * * * /path/to/project/deploy/auto-deploy.sh >> /var/log/zhishenevo-deploy.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."

git fetch --quiet origin main

local_rev="$(git rev-parse HEAD)"
remote_rev="$(git rev-parse origin/main)"

if [ "$local_rev" = "$remote_rev" ]; then
  exit 0
fi

echo "[$(date '+%F %T')] new commit detected: $local_rev -> $remote_rev"

git pull --ff-only origin main
docker compose up -d --build --remove-orphans
docker image prune -f

echo "[$(date '+%F %T')] deploy finished: $remote_rev"

#!/usr/bin/env bash
# 本机发布：构建镜像并推送到阿里云 ACR。
# 用法：bash deploy/publish.sh [tag]   （tag 默认为当前 git 短哈希）
# 前置：本机已 docker login 到 ACR（登录地址和账号见 ACR 控制台「访问凭证」）。
set -euo pipefail

cd "$(dirname "$0")/.."

# 读取本机 .env 中的 APP_IMAGE（ACR 镜像地址，不含 tag）
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

image="${APP_IMAGE:?请在 .env 中设置 APP_IMAGE 为 ACR 镜像地址，例如 registry.cn-hangzhou.aliyuncs.com/your-namespace/zhishen-evolution}"
tag="${1:-$(git rev-parse --short HEAD)}"

echo "building ${image}:${tag} ..."
docker build --target runner -t "${image}:${tag}" -t "${image}:latest" .

echo "pushing ${image}:${tag} and :latest ..."
docker push "${image}:${tag}"
docker push "${image}:latest"

echo "published ${image}:${tag} (and :latest)"
echo "服务器上的 cron 会在 2 分钟内自动拉取并重启。"

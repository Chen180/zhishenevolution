#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

require_safe_env_value() {
  local name="$1"
  local value="$2"
  if [[ "$value" == *"'"* || "$value" == *$'\n'* || "$value" == *$'\r'* ]]; then
    fail "$name cannot contain single quotes or line breaks."
  fi
}

command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
docker compose version >/dev/null 2>&1 ||
  fail "Docker Compose is not available."
docker info >/dev/null 2>&1 ||
  fail "Docker is not running or the current user cannot access it."

if [[ ! -f .env ]]; then
  printf 'Creating .env for the first deployment.\n'

  read -r -p 'Public domain, or :80 for IP-only access [:80]: ' site_address
  site_address="${site_address:-:80}"

  default_image="$(
    basename "$ROOT_DIR" |
      tr '[:upper:]_' '[:lower:]-' |
      sed 's/[^a-z0-9.-]/-/g'
  )"
  read -r -p "ACR image address (e.g. registry.cn-hangzhou.aliyuncs.com/ns/$default_image): " app_image
  app_image="${app_image:?ACR image address is required for pull-based deploy.}"
  [[ "$app_image" =~ ^[a-z0-9][a-z0-9._/-]*$ ]] ||
    fail "ACR image address is invalid."

  require_safe_env_value SITE_ADDRESS "$site_address"
  require_safe_env_value APP_IMAGE "$app_image"

  umask 077
  {
    printf "SITE_ADDRESS='%s'\n" "$site_address"
    printf "HTTP_PORT='80'\n"
    printf "HTTPS_PORT='443'\n"
    printf "APP_IMAGE='%s'\n" "$app_image"
    printf "IMAGE_TAG='latest'\n"
    printf "TZ='Asia/Shanghai'\n"
  } >.env
  chmod 600 .env

  printf '.env created with restricted permissions.\n'
else
  printf 'Using the existing .env file.\n'
fi

docker compose config --quiet
docker compose pull
docker compose up -d --remove-orphans
docker compose ps

printf '\nDeployment finished. Run "docker compose logs -f" to follow logs.\n'

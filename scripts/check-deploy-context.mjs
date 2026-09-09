#!/usr/bin/env node
/**
 * 部署上下文一致性检查。
 *
 * 教训来源：data/articles.json 已提交 Git，却被 .dockerignore 的 data/*
 * 排除，导致 ACR 镜像构建时缺失文件、next build 失败。
 *
 * 规则：data/ 下每个被 Git 跟踪的文件，必须在 .dockerignore 中
 * 有对应的 ! 白名单条目，否则以非零码退出。
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const tracked = execFileSync("git", ["ls-files", "data"], {
  encoding: "utf8",
})
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== "" && !line.endsWith(".gitkeep"));

const dockerignore = readFileSync(".dockerignore", "utf8");
const whitelisted = new Set(
  dockerignore
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("!"))
    .map((line) => line.slice(1).replace(/^\//, "")),
);

const missing = tracked.filter((file) => !whitelisted.has(file));

if (missing.length > 0) {
  console.error(
    "以下文件已提交 Git 但未加入 .dockerignore 白名单，ACR 构建将缺失它们：",
  );
  for (const file of missing) console.error(`  - ${file}`);
  console.error("请在 .dockerignore 中补充对应的 ! 条目。");
  process.exit(1);
}

console.log(`部署上下文检查通过：data/ 下 ${tracked.length} 个跟踪文件均已在 .dockerignore 白名单中。`);

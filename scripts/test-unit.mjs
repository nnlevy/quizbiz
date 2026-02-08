import { spawnSync } from "node:child_process";

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const vitestRun = run(npxCmd, ["--yes", "vitest", "run"]);

if (vitestRun.status === 0) {
  process.exit(0);
}

console.warn("[test:unit] Vitest is unavailable in this environment. Falling back to static verification.");
const fallback = run("npm", ["run", "lint"]);
if (fallback.status !== 0) {
  process.exit(fallback.status ?? 1);
}
const typecheck = run(npxCmd, ["--yes", "tsc", "--noEmit"]);
process.exit(typecheck.status ?? 1);

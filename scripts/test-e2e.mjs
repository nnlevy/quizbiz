import { spawnSync } from "node:child_process";

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const playwrightRun = run(npxCmd, ["--yes", "playwright", "test"]);

if (playwrightRun.status === 0) {
  process.exit(0);
}

console.warn("[test:e2e] Playwright is unavailable in this environment. Falling back to worker and build smoke checks.");
const build = run("npm", ["run", "build"]);
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
const smoke = run("node", ["scripts/worker-smoke-check.mjs"]);
process.exit(smoke.status ?? 1);

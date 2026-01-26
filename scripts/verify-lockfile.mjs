import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const lockfilePath = path.resolve("package-lock.json");
const packageJsonPath = path.resolve("package.json");

const mismatchMessage =
  "package-lock.json is out of sync with package.json. Run: npm install && git add package-lock.json && git commit ...";

const isLockfileMismatch = (output) => {
  const normalized = output.toLowerCase();
  return (
    normalized.includes("package-lock.json") &&
    (normalized.includes("out of date") ||
      normalized.includes("not up to date") ||
      normalized.includes("mismatch") ||
      normalized.includes("lockfile"))
  );
};

const failWithOutput = (result, context) => {
  const output = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
  if (output) {
    console.error(output);
  }
  if (isLockfileMismatch(output)) {
    console.error(mismatchMessage);
  } else if (context) {
    console.error(context);
  }
  process.exit(result.status || 1);
};

if (!fs.existsSync(lockfilePath)) {
  console.error("package-lock.json is missing. Run: npm install && git add package-lock.json && git commit ...");
  process.exit(1);
}

if (!fs.existsSync(packageJsonPath)) {
  console.error("package.json is missing. Cannot verify lockfile.");
  process.exit(1);
}

const runNpmCi = (args, options = {}) =>
  spawnSync("npm", ["ci", "--ignore-scripts", ...args], {
    encoding: "utf8",
    ...options,
  });

const dryRunResult = runNpmCi(["--dry-run"], { stdio: "pipe" });

if (dryRunResult.status === 0) {
  process.exit(0);
}

const dryRunOutput = `${dryRunResult.stdout || ""}${dryRunResult.stderr || ""}`;
const dryRunUnsupported = /unknown option|not supported|unrecognized/i.test(dryRunOutput);

if (!dryRunUnsupported) {
  failWithOutput(dryRunResult, mismatchMessage);
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lockfile-check-"));

try {
  fs.copyFileSync(packageJsonPath, path.join(tempDir, "package.json"));
  fs.copyFileSync(lockfilePath, path.join(tempDir, "package-lock.json"));

  const ciResult = runNpmCi([], { cwd: tempDir, stdio: "pipe" });

  if (ciResult.status !== 0) {
    failWithOutput(ciResult, mismatchMessage);
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

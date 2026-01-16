import fs from "node:fs";
import path from "node:path";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX32_REGEX = /^[0-9a-f]{32}$/i;

const isValidCloudflareId = (value) => UUID_REGEX.test(value) || HEX32_REGEX.test(value);

const resolveRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[wrangler] Missing required environment variable ${key}. ` +
        "Set it to the Cloudflare resource ID (UUID), not the display name.",
    );
  }
  if (!isValidCloudflareId(value)) {
    throw new Error(
      `[wrangler] ${key} must be a Cloudflare resource ID (UUID). ` +
        `Received "${value}".`,
    );
  }
  return value;
};

const applyBindingIds = (config) => {
  if (Array.isArray(config.d1_databases)) {
    config.d1_databases = config.d1_databases.map((entry) => {
      if (typeof entry?.database_id === "string" && entry.database_id.includes("${DOMAINS_DB_ID}")) {
        return { ...entry, database_id: resolveRequiredEnv("DOMAINS_DB_ID") };
      }
      if (typeof entry?.database_id === "string" && !isValidCloudflareId(entry.database_id)) {
        throw new Error(
          `[wrangler] D1 database_id must be a Cloudflare resource ID (UUID). ` +
            `Received "${entry.database_id}".`,
        );
      }
      return entry;
    });
  }

  if (Array.isArray(config.kv_namespaces)) {
    config.kv_namespaces = config.kv_namespaces.map((entry) => {
      if (typeof entry?.id === "string" && entry.id.includes("${USER_SESSIONS_ACROSS_DOMAINS_ID}")) {
        return { ...entry, id: resolveRequiredEnv("USER_SESSIONS_ACROSS_DOMAINS_ID") };
      }
      if (typeof entry?.id === "string" && !isValidCloudflareId(entry.id)) {
        throw new Error(
          `[wrangler] KV namespace id must be a Cloudflare resource ID (UUID). ` +
            `Received "${entry.id}".`,
        );
      }
      return entry;
    });
  }

  return config;
};

const updateConfig = (configPath) => {
  if (!fs.existsSync(configPath)) return;
  const raw = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(raw);
  const nextConfig = applyBindingIds(config);
  fs.writeFileSync(configPath, JSON.stringify(nextConfig, null, 2) + "\n");
};

const rootConfigPath = path.resolve("wrangler.json");
const distConfigPath = path.resolve("dist", "watershortcut", "wrangler.json");

updateConfig(rootConfigPath);
updateConfig(distConfigPath);

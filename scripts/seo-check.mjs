import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalUrl, pages } from "../src/seo/seoConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist", "client");

async function readHtml(route) {
  const filePath = route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.slice(1), "index.html");
  return fs.readFile(filePath, "utf8");
}

function assert(condition, failures, route, message) {
  if (!condition) {
    failures.push({ route, message });
  }
}

async function checkRoute(route, failures) {
  const html = await readHtml(route);
  const page = pages[route];
  const expectedCanonical = canonicalUrl(page.canonicalPath);

  assert(/<title>[^<]+<\/title>/i.test(html), failures, route, "Missing <title>");
  assert(/<meta[^>]+name=["']description["'][^>]*>/i.test(html), failures, route, "Missing meta description");
  assert(new RegExp(`<link[^>]+rel=["']canonical["'][^>]+${expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^>]*>`, "i").test(html), failures, route, "Missing canonical link");
  assert(/<meta[^>]+property=["']og:title["'][^>]*>/i.test(html), failures, route, "Missing OG title");
  assert(/<meta[^>]+property=["']og:description["'][^>]*>/i.test(html), failures, route, "Missing OG description");
  assert(/<meta[^>]+name=["']twitter:title["'][^>]*>/i.test(html), failures, route, "Missing Twitter title");
  assert(/<meta[^>]+name=["']twitter:description["'][^>]*>/i.test(html), failures, route, "Missing Twitter description");
  const h1Matches = html.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi) || [];
  assert(h1Matches.length === 1, failures, route, `Expected exactly one H1, found ${h1Matches.length}`);
}

async function main() {
  try {
    await fs.access(distDir);
  } catch {
    throw new Error("dist directory not found. Run `npm run build` before seo:check.");
  }

  const failures = [];
  const routes = Object.keys(pages);

  for (const route of routes) {
    await checkRoute(route, failures);
  }

  if (failures.length) {
    console.error("SEO checks failed:");
    failures.forEach((f) => console.error(`- ${f.route}: ${f.message}`));
    process.exit(1);
  }

  console.log(`All ${routes.length} prerendered routes contain required SEO tags.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

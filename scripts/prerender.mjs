import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { buildTitle, canonicalUrl, clampDescription, pages, site } from "../src/seo/seoConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist", "client");

async function ensureDist() {
  try {
    await fs.access(distDir);
  } catch (error) {
    throw new Error("dist directory not found. Run `npm run build` first.");
  }
}

function stripExistingSeo(head) {
  return head
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi, "");
}

function buildHead(pagePath, headShell) {
  const page = pages[pagePath];
  if (!page) {
    throw new Error(`Unknown page path: ${pagePath}`);
  }

  const title = buildTitle(page.title);
  const description = clampDescription(page.description);
  const canonical = canonicalUrl(page.canonicalPath);
  const og = page.og || {};
  const robots = page.robots || "index,follow";
  const structuredBlocks = page.structuredData || [];

  const seoTags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:title" content="${og.title || title}" />`,
    `<meta property="og:description" content="${og.description || description}" />`,
    `<meta property="og:type" content="${og.type || "website"}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${og.image || site.defaultOgImage}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${og.title || title}" />`,
    `<meta name="twitter:description" content="${og.description || description}" />`,
    `<meta name="twitter:image" content="${og.image || site.defaultOgImage}" />`,
  ];

  if (site.twitterHandle) {
    seoTags.push(`<meta name="twitter:site" content="${site.twitterHandle}" />`);
  }

  if (structuredBlocks.length) {
    structuredBlocks.forEach((block) => {
      seoTags.push(`<script type="application/ld+json">${JSON.stringify(block)}</script>`);
    });
  }

  return `<head>\n${seoTags.join("\n")}\n${headShell.trim()}\n</head>`;
}

function buildBody(pagePath) {
  const page = pages[pagePath];
  const heading = page.h1 || page.title;
  const intro = page.intro ? `<p class="seo-intro">${page.intro}</p>` : "";
  const pageBody = page.bodyHtml || "";

  return `<body>\n  <div id="root">\n    <main class="seo-prerender">\n      <header class="seo-hero">\n        <h1>${heading}</h1>\n        ${intro}\n      </header>\n      ${pageBody}\n    </main>\n  </div>\n</body>`;
}

async function loadTemplate() {
  const html = await fs.readFile(path.join(distDir, "index.html"), "utf8");
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    throw new Error("Unable to locate <head> in dist/index.html");
  }
  const headShell = stripExistingSeo(headMatch[1]);
  return { head: headShell };
}

async function writeHtml(pagePath, headShell) {
  const head = buildHead(pagePath, headShell);
  const body = buildBody(pagePath);
  const html = `<!doctype html>\n<html lang="en">\n${head}\n${body}\n</html>`;
  const outputPath = pagePath === "/" ? path.join(distDir, "index.html") : path.join(distDir, pagePath.slice(1), "index.html");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");
}

function buildSitemap() {
  const lastmod = new Date().toISOString().split("T")[0];
  const urls = Object.values(pages)
    .filter((page) => (page.robots || "index,follow").includes("index"))
    .map((page) => `<url><loc>${canonicalUrl(page.canonicalPath)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

async function writeRobots() {
  const robots = `User-agent: *\nAllow: /\nSitemap: https://${site.canonicalHost}/sitemap.xml`;
  await fs.writeFile(path.join(distDir, "robots.txt"), robots, "utf8");
}

async function writeSitemap() {
  const xml = buildSitemap();
  await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
}

async function main() {
  await ensureDist();
  const { head } = await loadTemplate();
  const pagePaths = Object.keys(pages);
  await Promise.all(pagePaths.map((p) => writeHtml(p, head)));
  await writeRobots();
  await writeSitemap();
  console.log(`Prerendered ${pagePaths.length} routes with SEO metadata.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

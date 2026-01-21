import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Critters from "critters";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist", "client");

const CRITICAL_SCRIPT_TAG = '<script src="/critical-css-loader.js" defer></script>';

const ensureDist = async () => {
  try {
    await fs.access(distDir);
  } catch (error) {
    throw new Error("dist directory not found. Run `npm run build` first.");
  }
};

const listHtmlFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listHtmlFiles(fullPath);
      }
      return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
    }),
  );
  return files.flat();
};

const injectNonBlockingStyles = (html) => {
  const stylesheetRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css)["'][^>]*>/gi;
  const replacements = [];

  let match;
  while ((match = stylesheetRegex.exec(html)) !== null) {
    const beforeMatch = html.slice(0, match.index);
    const lastNoscriptOpen = beforeMatch.lastIndexOf("<noscript");
    const lastNoscriptClose = beforeMatch.lastIndexOf("</noscript>");
    if (lastNoscriptOpen > lastNoscriptClose) {
      continue;
    }
    replacements.push({
      original: match[0],
      href: match[1],
    });
  }

  let nextHtml = html;
  replacements.forEach(({ original, href }) => {
    const preload = `<link rel="preload" href="${href}" as="style" />`;
    const asyncSheet = `<link rel="stylesheet" href="${href}" media="print" data-ws-preload="style" />`;
    const noscript = `<noscript><link rel="stylesheet" href="${href}" /></noscript>`;
    nextHtml = nextHtml.replace(original, `${preload}\n      ${asyncSheet}\n      ${noscript}`);
  });

  if (!nextHtml.includes(CRITICAL_SCRIPT_TAG)) {
    nextHtml = nextHtml.replace(/<\/head>/i, `  ${CRITICAL_SCRIPT_TAG}\n  </head>`);
  }

  return nextHtml;
};

const inlineCriticalCss = async (htmlPath, critters) => {
  const html = await fs.readFile(htmlPath, "utf8");
  const critical = await critters.process(html);
  const updated = injectNonBlockingStyles(critical);
  await fs.writeFile(htmlPath, updated, "utf8");
};

const main = async () => {
  await ensureDist();
  const critters = new Critters({
    path: distDir,
    publicPath: "/",
    inlineThreshold: 10 * 1024,
    preload: false,
    compress: true,
    pruneSource: false,
  });

  const htmlFiles = await listHtmlFiles(distDir);
  await Promise.all(htmlFiles.map((file) => inlineCriticalCss(file, critters)));
  console.log(`Inlined critical CSS for ${htmlFiles.length} HTML files.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

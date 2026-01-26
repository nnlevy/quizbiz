# Deployment

## Cloudflare build behavior

Cloudflare Pages and Workers build pipelines run a clean install (`npm ci`) before running your build command. That means `package-lock.json` must exist and be in sync with `package.json` or the build will fail before any project scripts run.

Cloudflare currently uses Node 22.16.0 with npm 10.9.2 for builds, so keep local tooling aligned to avoid lockfile version drift.

If this project is ever moved into a subdirectory (monorepo), ensure Cloudflare’s Root directory setting points at the folder containing `package.json` and `package-lock.json`.

## If a build fails

Run the following locally:

```sh
npm install && npm run build
```

Then commit the lockfile updates:

```sh
git add package-lock.json
```

## What to commit

- `package-lock.json` any time `package.json` changes.
- Any build configuration changes made to keep Cloudflare installs reliable.

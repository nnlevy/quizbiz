# Deployment

## Cloudflare build behavior

Cloudflare Pages and Workers build pipelines run a clean install (`npm ci`) before running your build command. That means `package-lock.json` must exist and be in sync with `package.json` or the build will fail before any project scripts run.

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

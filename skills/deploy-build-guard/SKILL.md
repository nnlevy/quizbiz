---
name: deploy-build-guard
description: Prevent and troubleshoot frontend build/deployment failures (especially TSX/JSX syntax errors) in this repo. Use when fixing build errors, updating React components, or preparing changes that could break the build pipeline (npm run build/tsc/vite).
---

# Deploy Build Guard

## Overview

Harden changes against build failures by checking for JSX/TSX structural issues, duplicate blocks, and running the same build steps used in deployment.

## Workflow

1. **Scan for merge artifacts or duplication**
   - Look for duplicated imports, repeated component blocks, or nested JSX that indicates a merge conflict.
   - Remove duplicate reducers, types, or component definitions before continuing.

2. **Validate JSX/TSX structure**
   - Ensure every JSX element has a matching closing tag.
   - Avoid nested `<button>` or conflicting interactive elements.
   - Keep prop typings in sync with component usage (required vs optional props).

3. **Align with build pipeline**
   - Run the same commands the deployment uses (e.g., `npm run build`).
   - If the build is too heavy, run `tsc -b` to catch type/TSX syntax errors early.

4. **Update summary/utility components carefully**
   - When refactoring shared components, consolidate to a single definition.
   - Verify all usages pass required props, and remove unused imports.

5. **Re-run checks after cleanup**
   - Re-run `npm run build` (or `tsc -b`) to confirm the fix.
   - Address any new diagnostics before committing.

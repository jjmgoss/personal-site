# Agent Instructions For This Repository

This repository contains the personal/project website.

The site is intended to be a static-first hub for side projects, project documentation, writing, deployment notes, and links to live demos. It should help organize and present work without merging every side project into this codebase.

For shared issue, branch, pull request, and review workflow conventions, see `docs/github-workflow.md`.

## Current Project Direction

The planned baseline is:

- Next.js
- TypeScript
- Markdown or MDX content
- Static-first rendering
- Dockerized production build
- Caddy or reverse-proxy-friendly deployment
- Synology-first hosting
- Portability to a VPS or cloud host later

The MVP should be content-driven and simple.

Do not add a database, authentication, CMS, comments, analytics pipeline, background jobs, admin dashboard, or dynamic server features unless a specific issue requests it.

## Repository Boundaries

This repo owns the main personal/project site.

Other projects should remain separate repos and services. This site may document them, link to them, and eventually route users to them through subdomains or external links.

Examples of separate projects this site may document:

- HN Trend Tracker
- repo-rails
- future AI-assisted software experiments
- future research/product-discovery projects

Do not copy full project code from other repositories into this repo unless a human explicitly asks for it.

## Files Agents Should Read First

Before making changes, read:

1. `README.md`
2. `docs/architecture.md`
3. `docs/implementation-plan.md`
4. `docs/deployment-strategy.md`
5. `docs/github-workflow.md`
6. The GitHub issue being implemented

## Working Style

Work one issue at a time.

Prefer small PRs. Do not combine unrelated work.

For each PR:

- Keep the scope narrow.
- Explain what changed.
- Link the issue with `Refs #...`, `Closes #...`, or equivalent.
- Include verification commands and results.
- Call out deployment impact.
- Call out follow-up work.

## Documentation Style

Docs should be public-safe.

Do not include:

- Internal IP addresses
- Private Synology hostnames
- Personal deployment paths
- SSH usernames
- SSH keys
- Tokens
- API keys
- `.env` contents
- Real secrets
- Anything that would make home infrastructure easier to target

Use placeholders such as:

```text
example.com
app.example.com
<synology-host>
<deploy-user>
<app-directory>
```

## Runtime And Deployment Boundaries

The expected deployment path is:

1. Local development
2. Local production build
3. Local Docker run
4. Synology LAN deployment
5. Public routing through a domain and HTTPS
6. Optional future migration to VPS/cloud

Deployment should remain portable. Avoid Synology-only assumptions where generic Docker/Caddy patterns would work.

## Safety Constraints

Do not run destructive commands against persistent environments.

Avoid commands such as:

```text
docker compose down -v
docker volume rm
docker volume prune
rm -rf
```

Only use destructive commands when a human explicitly approves the exact target.

Do not modify GitHub Actions workflows unless the issue explicitly asks for workflow changes.

Do not create deployment scripts that assume real infrastructure values unless the issue explicitly asks for that and placeholders are used.

## Expected Future Local Commands

After the Next.js app is scaffolded, expected commands will likely include:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Do not invent final commands until the scaffold exists. Keep README and docs updated as the actual project shape becomes real.

## Validation Expectations

For docs-only changes:

```powershell
git diff --stat
git status
```

For app changes after the scaffold exists, run the relevant commands documented in `README.md`, likely including lint and build.

For repo-rails verification, from the separate `repo-rails` repository:

```powershell
uv run repo-rails check jjmgoss/personal-site
```

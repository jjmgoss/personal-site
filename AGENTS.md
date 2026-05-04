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

## Start-of-Task Repo Sync

Before making a new branch or editing files, agents should start from the latest `main`.

For the normal local Windows checkout, run:

```powershell
cd C:\Users\jjmgo\coding_projects\personal-site
git checkout main
git pull --ff-only origin main
```

## Content Ownership

- `content/projects/*.md`: Jason owns project body copy. Do not rewrite project descriptions unless an issue explicitly asks for project copy edits. Only change factual frontmatter when the issue explicitly requires it.
- `content/writing/*.md`: writing posts must include `author`. If `author: Jason Goss` or `author` is missing, treat the body as protected. Agent-authored posts may be edited within issue scope.
- `content/site/home.md`, `content/site/projects.md`, `content/site/notes.md`, and `content/site/site.json`: Jason-owned site copy. Do not rewrite for polish, refactor, testing, deployment, or infrastructure tasks.
- `content/site/now.md`: agent-maintained and public-safe. Update it when a PR changes public routes, project status or live URLs, deployment posture, active project list, or next priorities. Keep private infrastructure details, secrets, and local-only values out of it.
- Agent-maintained public copy may be lightly droll and understated when the agent is the acknowledged author of a file or other copy, but must remain factual, useful, public-safe, and credibility-preserving. Prefer dry understatement over jokes. Never insult the human, the reader, or the work. Only do this sparingly, and only when it's clear that it is the agent speaking, not a human.
- Agent-maintained or AI-authored public copy may use a dry, understated voice, but it should be used sparingly. Most archival notes should be straightforward and useful. Reserve droll asides for facts that actually warrant them, and do not apply the bit uniformly across all agent-authored notes.
- Human-written docs, code comments, and implementation choices outside the issue scope should also be preserved. Put non-essential rewrite suggestions in the PR body instead of applying them.

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

## Local Commands

The current scaffold supports:

```powershell
npm install
npm run dev
npm run build
npm run start
```

Keep README and docs updated as the project shape evolves.

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


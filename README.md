# personal-site

Personal/project website for cataloging side projects, writing, deployment notes, and live demos.

This repository is intended to become the public home base for ongoing AI-assisted software projects. It should document what each project is, how it works, what state it is in, and where to find the source code or live demo.

## Current Status

This repo now has a minimal Next.js + TypeScript scaffold using the App Router.

The current goal is to keep the site static-first and content-oriented while future issues add the content model, project entries, writing pages, and deployment packaging.

## Product Shape

The site should eventually include:

- A homepage explaining the overall project/lab.
- A projects index with cards for each active project.
- Project detail pages with status, architecture, screenshots, roadmap, repo links, and live demo links.
- A writing/log section for project notes and implementation writeups.
- Deployment notes and public documentation for selected projects.
- Links to separately deployed live apps.

The site should start static-first and content-driven. It should not require a database, authentication, CMS, comments, analytics pipeline, or admin dashboard for the MVP.

## Baseline Technical Direction

The planned stack is:

- Next.js
- TypeScript
- Markdown or MDX content
- Static-first rendering
- Docker for portable deployment
- Caddy or another reverse proxy for routing and HTTPS
- Synology-first hosting, with portability to a VPS or cloud host later

## Repository Role

This repo owns the personal/project website.

It should not absorb the code for every side project. Other projects, such as HN Trend Tracker or repo-rails, should remain independent repositories and services. This site should document them, link to them, and eventually route users to their live deployments.

## Initial Development Workflow

Development should be issue-driven and PR-based.

General flow:

1. Create or select a GitHub issue.
2. Create a focused branch for that issue.
3. Make the smallest coherent change.
4. Open a PR with clear verification notes.
5. Review before merging.
6. Treat deployment as an explicit follow-up, not an automatic side effect of every merge.

See:

- `AGENTS.md`
- `docs/github-workflow.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/deployment-strategy.md`

## Local Development

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Create a production build:

```powershell
npm run build
```

Start the production server after a build:

```powershell
npm run start
```
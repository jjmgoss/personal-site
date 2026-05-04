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

Validate content frontmatter, screenshot references, and simple internal content links:

```powershell
npm run validate:content
```

Run the public-route smoke tests:

```powershell
npm run test:site
```

For a line-by-line test report:

```powershell
npm run test:site -- --reporter=list
```

Start the production server after a build:

```powershell
npm run start
```

## Local Docker Test

Build the local production image:

```powershell
docker build -t personal-site:local .
```

Run the local production container with Compose:

```powershell
docker compose up --build
```

Then verify:

```text
http://localhost:3001
http://localhost:3001/projects
http://localhost:3001/writing
```

Stop the local production container cleanly with Ctrl+C in the compose terminal,
or run:

```powershell
docker compose stop
```

For the first Synology LAN deployment path, see `docs/synology-lan-deployment.md`.

After SSHing into the Synology repo checkout, the normal LAN update command is `./scripts/deploy-synology-lan.sh`.

## Project Content

Project entries live in `content/projects/` as Markdown files with frontmatter.

Each project entry should define metadata such as title, slug, status, summary,
stack, next milestone, and public-safe repository or docs URLs.

Optional project screenshots should live under `public/projects/<project-slug>/` and
be referenced from the `screenshots` frontmatter field using public-safe assets only.

## Writing Content

Writing and log posts live in `content/writing/` as Markdown files with frontmatter.

Each post should define metadata such as title, slug, date, summary, tags, and
related projects.

## Editing Copy

Common public site copy now lives under `content/site/`.

- Edit project pages in `content/projects/`.
- Edit notes and writing entries in `content/writing/`.
- Edit site-level copy such as the homepage, shared header/footer text, projects intro, notes intro, and `/now` page in `content/site/`.

After editing content, run:

```powershell
npm run validate:content
npm run build
```

## Route Smoke Tests

The repository includes lightweight Playwright smoke tests for the main public routes.

The tests use the built app with Playwright `webServer`, so the normal local flow is:

```powershell
npm run build
npm run test:site
```

If Playwright browsers are not installed yet on the local machine, install Chromium once with:

```powershell
npx playwright install chromium
```

These smoke tests are intended to catch route render failures, broken primary navigation,
and broken image loading on public pages. They are not screenshot-diff or visual regression tests.
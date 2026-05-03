# Implementation Plan

## Overview

This project should be built in small, issue-driven phases.

The first objective is not to build a complex website. The first objective is to create a durable, agent-friendly project workspace and then build a static-first MVP that can be deployed cheaply.

## Guiding Principles

- Prefer small PRs.
- Keep the MVP static-first.
- Avoid adding infrastructure before it is needed.
- Keep side projects as separate repos/services.
- Make the site easy for coding agents to update.
- Keep deployment portable between Synology and generic Docker hosts.
- Do not commit secrets or private infrastructure details.

## Phase 0: Repository Rails And Planning

Goal: establish the repository as an agent-friendly project workspace.

Status: complete.

Tasks:

1. Apply repo-rails setup.
2. Create project-specific `AGENTS.md`.
3. Create `docs/architecture.md`.
4. Create `docs/implementation-plan.md`.
5. Create `docs/deployment-strategy.md`.
6. Update `README.md`.
7. Create initial GitHub issue backlog.

Acceptance criteria:

- Repo has issue templates and PR template.
- Repo has project-specific architecture docs.
- Repo has implementation phases.
- Repo has safe agent instructions.
- Repo is ready for the first app scaffold PR.

## Phase 1: Minimal Next.js Scaffold

Goal: create the smallest working Next.js site.

Status: in progress.

Tasks:

1. Scaffold Next.js with TypeScript.
2. Add basic app routes.
3. Add simple homepage.
4. Add placeholder projects page.
5. Add placeholder writing page.
6. Add local development commands to `README.md`.
7. Add lint/build verification.
8. Ensure CI matches the actual project structure.

Acceptance criteria:

- `npm install` works.
- `npm run dev` starts the site locally.
- `npm run lint` works, if configured.
- `npm run build` succeeds.
- Homepage renders.
- Projects route renders.
- Writing route renders.
- README contains accurate commands.

## Phase 2: Content Model

Goal: make projects and writing pages content-driven.

Tasks:

1. Choose Markdown or MDX approach.
2. Add `content/projects`.
3. Add `content/writing`.
4. Add project frontmatter schema.
5. Add writing frontmatter schema.
6. Add content loader utilities.
7. Add validation for required fields.
8. Add sample project entries.

Initial project entries:

- `personal-site`
- `hn-trend-tracker`
- `repo-rails`

Acceptance criteria:

- Project pages are generated from content files.
- Writing pages are generated from content files.
- Invalid or missing required fields fail clearly.
- Adding a project does not require editing app layout code.

## Phase 3: Project Pages

Goal: make the project catalog useful.

Tasks:

1. Build project index page.
2. Build project detail page template.
3. Add project status labels.
4. Add project stack display.
5. Add repo/demo/docs links.
6. Add next milestone field.
7. Add screenshot support.
8. Add initial real content for known projects.

Acceptance criteria:

- `/projects` lists projects.
- `/projects/personal-site` renders.
- `/projects/hn-trend-tracker` renders.
- `/projects/repo-rails` renders.
- Each project page explains purpose, status, architecture, and next step.
- Missing optional links are handled cleanly.

## Phase 4: Writing/Log Section

Goal: support public writeups and project notes.

Tasks:

1. Build writing index page.
2. Build writing detail page.
3. Add tags.
4. Add related projects.
5. Add first real post about creating the project site.
6. Add RSS only if it is simple and does not distract from the MVP.

Acceptance criteria:

- `/writing` lists posts.
- Individual posts render.
- Posts can link to related projects.
- Date and tags display cleanly.

## Phase 5: Visual Design And Navigation

Goal: make the site feel like a coherent project studio.

Tasks:

1. Add global layout.
2. Add header navigation.
3. Add footer.
4. Add responsive project cards.
5. Add typography defaults.
6. Add simple status badges.
7. Add basic dark/light handling only if straightforward.
8. Add screenshot/image styling.

Acceptance criteria:

- Site is usable on desktop and mobile.
- Navigation is clear.
- The site feels finished enough to share.
- Design does not depend on complex animation or heavy client-side JavaScript.

## Phase 6: Dockerized Production Build

Goal: make the site portable to Synology and future VPS/cloud hosts.

Tasks:

1. Add production Dockerfile.
2. Add `.dockerignore`.
3. Add `docker-compose.yml` for local production testing.
4. Document local Docker build/run commands.
5. Ensure Docker build works from a clean checkout.
6. Keep secrets out of the image.

Acceptance criteria:

- `docker build` succeeds.
- Container runs locally.
- Site is reachable locally from the container.
- README documents Docker commands.
- No private values are committed.

## Phase 7: Synology LAN Deployment

Goal: run the site on Synology inside the local network.

Tasks:

1. Decide Synology deployment layout.
2. Add public-safe Synology deployment notes.
3. Add placeholder Caddy/reverse proxy examples.
4. Add deployment checklist.
5. Document manual deployment process.
6. Do not expose publicly yet unless separately approved.

Acceptance criteria:

- Site can run on Synology LAN.
- Deployment notes are public-safe.
- No internal hostnames or IPs are committed.
- Rollback process is documented.

## Phase 8: Public Routing And HTTPS

Goal: make the site publicly accessible safely.

Tasks:

1. Choose public access model:
   - Cloudflare Tunnel
   - DDNS + Caddy
   - VPS
2. Configure DNS outside the repo.
3. Configure HTTPS outside the repo or through Caddy.
4. Add public-safe docs.
5. Verify no private operational details are exposed.
6. Add public URL to README only when ready.

Acceptance criteria:

- Site is reachable at a public domain.
- HTTPS works.
- No private admin surfaces are exposed.
- Live side projects are linked, not merged.

## Phase 9: Live Project Integration

Goal: connect the site to separately deployed projects.

Tasks:

1. Add project live URL fields.
2. Add subdomain routing strategy.
3. Add HN Trend Tracker project page.
4. Add repo-rails project page.
5. Add status/roadmap fields.
6. Add screenshots.

Acceptance criteria:

- Main site links to live projects.
- Project pages clearly distinguish docs, repo, and live demo.
- Broken/missing live links are handled gracefully.

## Phase 10: Polish And Automation

Goal: make the site easy to maintain over time.

Tasks:

1. Add content validation.
2. Add link checking if simple.
3. Add screenshot conventions.
4. Add issue template examples.
5. Add agent prompt examples.
6. Add optional RSS.
7. Add optional lightweight search.
8. Add optional deployment status page.

Acceptance criteria:

- Adding a new project is easy.
- Adding a new post is easy.
- Agents have clear instructions.
- CI catches common mistakes.

## Initial Issue Backlog

Suggested initial issues:

1. `[agent-task] Bootstrap personal-site architecture docs and MVP plan`
2. `[agent-task] Scaffold minimal Next.js TypeScript app`
3. `[agent-task] Align CI with actual Next.js project structure`
4. `[agent-task] Add Markdown/MDX content model for projects`
5. `[agent-task] Build projects index and project detail pages`
6. `[agent-task] Add initial project content for personal-site, HN Trend Tracker, and repo-rails`
7. `[agent-task] Build writing/log section`
8. `[agent-task] Add global layout, navigation, and basic visual design`
9. `[agent-task] Add Dockerfile and local docker-compose production test`
10. `[deployment] Document Synology LAN deployment process`
11. `[deployment] Run first Synology LAN deployment`
12. `[deployment] Decide public routing model`
13. `[agent-task] Add public-safe deployment status/now page`
14. `[agent-task] Add screenshots and polish project pages`
15. `[agent-task] Add content validation and link checks`

## First Coding-Agent Task After Docs

After the docs-only bootstrap PR merges, the next implementation issue should be:

```text
[agent-task] Scaffold minimal Next.js TypeScript app
```

Expected scope:

- Create a minimal Next.js app.
- Add TypeScript.
- Add homepage.
- Add `/projects` placeholder.
- Add `/writing` placeholder.
- Add accurate local development commands.
- Ensure build succeeds.
- Do not add MDX/content system yet unless it is trivial and explicitly accepted.

This should be the first code-producing PR.

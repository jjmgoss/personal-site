# Architecture

## Purpose

`personal-site` is the main website for cataloging side projects, project documentation, writing, deployment notes, and links to live demos.

The site should act as a public project hub and lightweight lab notebook. It should explain what projects exist, why they exist, how they work, what state they are in, and where to find their source or live deployment.

This repo should stay focused on the website itself. Individual side projects should remain separate repos and services.

## Product Goals

The site should eventually provide:

- A homepage that explains the overall project/lab.
- A projects index showing active, paused, and completed projects.
- Project detail pages with architecture, status, roadmap, screenshots, repo links, and live demo links.
- A writing/log section for project notes and implementation writeups.
- Deployment notes and public documentation for selected projects.
- A stable place to link together separately deployed side projects.

## Non-Goals For MVP

The MVP should not include:

- User accounts
- Authentication
- Database
- CMS
- Comments
- Newsletter system
- Analytics pipeline
- Admin dashboard
- Payments
- Background jobs
- Multi-tenant features
- Complex server-side APIs

These may become useful later, but they should not be part of the first version.

## Baseline Stack

The planned stack is:

- Next.js
- TypeScript
- Markdown or MDX content
- Static-first rendering
- Docker for portable deployment
- Caddy or reverse-proxy-friendly deployment
- Synology-first hosting
- Future portability to VPS/cloud hosting

## Static-First Principle

The site should start as static-first content.

Most pages should be generated from files in the repo, such as Markdown, MDX, YAML, JSON, or TypeScript data files.

This keeps the project:

- Easy for agents to edit
- Easy to review in PRs
- Cheap to host
- Simple to back up
- Portable across Synology, static hosting, VPS, or cloud platforms

## Repository Boundary

This repository owns:

- The main website
- Site-level layout and navigation
- Project catalog content
- Writing/log content
- Public docs for the website itself
- Deployment configuration for the website

This repository should not own:

- The full source code for HN Trend Tracker
- The full source code for repo-rails
- The full source code for unrelated services
- Private deployment secrets
- Private operational dashboards

Other projects should remain independent repositories. This site should document them and link to them.

## Expected Site Structure

Expected first route shape:

```text
/                         Homepage
/projects                 Project index
/projects/[slug]          Project detail page
/writing                  Writing/log index
/writing/[slug]           Writing/log post
/status                   Public project status or now page
/about                    Optional background/context page
```

The exact route structure can evolve, but the MVP should keep navigation simple.

## Content Model

The initial content model should support project pages and writing pages.

A project should include fields like:

```text
title
slug
status
summary
description
repo_url
live_url
docs_url
stack
started_at
updated_at
phase
priority
screenshots
next_milestone
```

Project statuses may include:

```text
idea
planning
active
paused
shipped
archived
```

A writing/log post should include fields like:

```text
title
slug
date
summary
tags
related_projects
```

Markdown or MDX should be preferred over a database for the MVP.

## Suggested Repository Layout

The future app may use a structure like:

```text
personal-site/
  app/
    page.tsx
    projects/
      page.tsx
      [slug]/
        page.tsx
    writing/
      page.tsx
      [slug]/
        page.tsx
  content/
    projects/
      hn-trend-tracker.md
      repo-rails.md
      personal-site.md
    writing/
      2026-05-03-building-the-project-site.md
  lib/
    content/
      projects.ts
      writing.ts
  public/
    images/
      projects/
  docs/
    architecture.md
    implementation-plan.md
    deployment-strategy.md
```

This is an intended shape, not a requirement for the docs-only bootstrap PR.

## Service Architecture

For the MVP, the main website should be a single service.

Live side projects should remain separate services.

Expected future public routing shape:

```text
example.com                 Main personal/project site
hn.example.com              HN Trend Tracker live app
repo-rails.example.com      repo-rails docs or demo, if exposed
status.example.com          Optional public status page
```

Prefer subdomains for separately deployed apps. Avoid path-based routing for live apps until there is a clear reason to accept the added complexity.

## Deployment Architecture

The intended deployment progression is:

```text
Local dev
  -> local production build
  -> local Docker container
  -> Synology LAN deployment
  -> public domain + HTTPS
  -> optional VPS/cloud migration
```

The production app should be able to run behind a reverse proxy.

Expected reverse proxy choices:

- Caddy for portable self-hosting
- Synology reverse proxy for DSM-native routing
- Cloudflare Tunnel if avoiding inbound home-network port exposure
- VPS reverse proxy later if the site moves off Synology

## Security And Privacy

The repo may be public. Treat all docs and examples as public.

Do not commit:

- Internal IP addresses
- Private Synology hostnames
- SSH usernames
- SSH keys
- Real deployment directories
- Tokens
- API keys
- `.env` files with private values
- Personal operational details

Use placeholder examples instead.

## Deployment Secrets

Deployment secrets should live in GitHub Actions secrets, Synology configuration, local `.env` files, or other secret stores.

They should not live in committed files.

Likely future GitHub Actions secrets may include:

```text
SYNOLOGY_HOST
SYNOLOGY_USER
SYNOLOGY_SSH_KEY
SYNOLOGY_APP_DIR
```

These are placeholder names only. Do not document real values.

## Design Direction

The first design should be clean and simple.

Suggested tone:

- Project studio
- Public lab notebook
- Technical but approachable
- Not overly personal
- Focused on experiments, artifacts, and lessons learned

The site should make it easy to answer:

- What is this project?
- Why does it exist?
- What does it do today?
- How does it work?
- What is next?
- Where is the code?
- Is there a live demo?

## Future Extensions

Possible future additions:

- Screenshots and demo videos
- RSS feed
- Search
- Tags
- Project timeline
- Deployment status page
- Uptime monitoring link
- Cross-project dependency map
- Public project roadmap
- Private admin section
- Newsletter/Substack cross-posting
- Lightweight analytics

These should be added only after the static MVP is useful.

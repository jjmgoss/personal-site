---
title: Building the Personal Site
slug: building-the-personal-site
date: 2026-05-03
summary: Notes on building this site as a static-first project hub with Next.js, Markdown content, GitHub issues, and small agent-executed pull requests.
tags:
  - site-building
  - nextjs
  - markdown
  - agent-workflow
related_projects:
  - personal-site
---

This site is being built as a static-first project hub rather than a heavy web
application with a database or CMS.

The goal is to keep the content easy to review, easy to update in pull requests,
and easy to evolve one issue at a time. Project entries and writing posts live
in Markdown files so the site can be generated from the repository itself.

The implementation approach is intentionally small and incremental:

- use Next.js App Router with TypeScript
- store content in Markdown with frontmatter
- plan work in GitHub issues
- ship changes as focused, agent-executed pull requests

That approach keeps the site public-safe and maintainable while it grows into a
better catalog of projects, notes, and deployment writeups.
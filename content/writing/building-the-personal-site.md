---
title: Building the Portfolio Site
slug: building-the-personal-site
date: 2026-05-03
summary: Notes on shaping this site into a credible portfolio and notebook for software experiments, project delivery, and AI-assisted workflows.
tags:
  - site-building
  - nextjs
  - markdown
  - agent-workflow
related_projects:
  - personal-site
---

This site is being built as a portfolio and notes hub rather than a heavy web
application with a database or CMS.

The goal is to keep the content easy to review, easy to update in pull requests,
and easy to evolve one issue at a time while the public presentation gets tighter.
Project entries and notes live in Markdown files so the site can be generated
from the repository itself.

The implementation approach is intentionally small and incremental:

- use Next.js App Router with TypeScript
- store content in Markdown with frontmatter
- plan work in GitHub issues
- ship changes as focused, agent-executed pull requests

That approach keeps the work maintainable while the site grows into a better
record of projects, notes, and experiments worth sharing.
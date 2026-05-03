---
title: HN Trend Tracker
slug: hn-trend-tracker
status: active
summary: Hacker News data pipeline and read-only app for tracking stories, score changes, comment changes, and trend-oriented analytics over time.
stack:
  - Python
  - Next.js
  - SQLAlchemy
  - Postgres
  - Plotly
  - Docker
  - dbt
next_milestone: Add richer trend views and continue improving the historical analytics pipeline.
repo_url: https://github.com/jjmgoss/hn-trend-tracker
live_url:
docs_url: https://github.com/jjmgoss/hn-trend-tracker/tree/main/docs
---

`hn-trend-tracker` is a Hacker News data project focused on collecting useful
story history and turning it into a read-only analysis surface.

Today the project combines a Python backend and ingestion pipeline with a
Next.js frontend. It stores the latest known state for items and users, appends
historical story observations during refresh cycles, and uses supporting docs and
analytics models to make the system easier to extend.

The project is intentionally practical rather than overbuilt. It is aimed at
capturing enough structured data to answer questions about story momentum,
comment growth, repost patterns, and broader trend behavior without adding
unnecessary product complexity.

No public live deployment is linked here yet because this site should only point
to real public URLs when they actually exist.
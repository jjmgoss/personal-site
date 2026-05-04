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


This was me flailing around for an idea, any idea, that could be worth a Saturday. Staring at Hacker News posts,
desperately inviting inspiration, it struck me: I could be a copycat. Easy enough. 

Hacker News provides a publicly accessible API with all their posts, and they invite the general public to trawl
through the contents of their entire history. So, I can just set up a little service to pull from their API, fill
in a database with all the posts, comments, etc that have ever been on the site, and then use that data for my own
devices. My own devices are boring and derivative, but at least I could exercise instructing agents to do
literally anything. 

---
title: Autonomous Product Development
slug: autonomous-product-development
status: active
summary: AI-assisted research and build workflow for generating, evaluating, documenting, and selectively prototyping small product ideas.
stack:
  - Python
  - FastAPI
  - SQLite
  - Jinja
  - Markdown
  - Agent workflows
next_milestone: Tighten the discovery-to-prototype workflow and keep improving the evidence, review, and planning surfaces for small product experiments.
repo_url: https://github.com/jjmgoss/autonomous-product-development
live_url:
docs_url: https://github.com/jjmgoss/autonomous-product-development/tree/main/docs
---

While devloping HN-trends-tracker, I had it in the back of my head that this was a toy, 
this likely wouldn't go anywhere, almost certanily wouldn't be monetizable, and HN might not even
take kindly to me cloning their site, and might want me to take it down.

So what else could I try to do? I had no idea. But I did have a GPU that could fit a local LLM on it,
and maybe I could turn to it for cheaper advice than I could get from one of the big names.

The trick though is that I don't actually want to do any product research to find out what's a good
thing to spend time on. But we could train my local LLM to give it a shot. 

That's what this project is: a harness for a local LLM to encourage it to do autonomous product research
into a specified field.
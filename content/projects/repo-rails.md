---
title: repo-rails
slug: repo-rails
status: active
summary: Reusable setup and compliance toolkit for agent-friendly GitHub repositories using issue-driven, PR-first workflows.
stack:
  - Python
  - uv
  - GitHub CLI
  - GitHub Actions
  - Repository templates
next_milestone: Expand reusable profiles and continue tightening setup and compliance checks for target repositories.
repo_url: https://github.com/jjmgoss/repo-rails
live_url:
docs_url: https://github.com/jjmgoss/repo-rails/tree/main/docs
---

A standardized way of initializing a github repo to support a new project, in a way that's friendly to
the way I've landed on working with agents.

While getting the machines to code up hn-trends-tracker, it became clear that the only easy way
to orhcestrate agents is to instruct them to do things in a highly structured way. Unfortunately for
them, I don't like doing things in a highly structured way, so I get another agent to intermediate. 

I landed on telling them what to do using a github-centric workflow that revolves around
trying to keep some agent with high-level context doing most of the paperwork, passing off tasks to agents in
Codex or the Copilot chat interface in VS Code, then getting my co-conspirator to review their code. 

The workflow goes like this
- I talk to an agent in a chat window. They pretend to understand my motivation, and will spit out very detailed
prompts to the implementer agent, telling them what to do, in the form of a Github Issue.
- I get the confidante agent to give me a prompt telling the implementor agent where to find the issue, and instructions
for implementing the issue.
- The implementer agent pushes up a PR on a new branch of the repo, following some guidelines around PR formatting,
describing what it's done.
- The confidante agent reads the PR, reviews, and will tell me whether i should merge it.

This repo-rails project is all in service of getting the initial repo set up to support this workflow when I set
up a new project.
# Synology LAN Deployment

## Overview

This guide documents the first manual deployment path for running the existing Dockerized `personal-site` app on a Synology system inside the local network.

The scope is intentionally narrow:

- LAN-only deployment
- public-safe placeholders only
- manual operator steps
- reuse of the existing `Dockerfile` and `docker-compose.yml`

This guide does not change app behavior, container behavior, public routing, or deployment automation.

## Current Deployment Goal

The current goal is to run the site on a Synology host so it is reachable from devices on the same LAN at:

```text
http://<synology-host>:3001
```

This is the first hosted deployment step after local Docker verification.

## Non-Goals

This guide does not cover:

- public internet exposure
- Caddy setup
- Cloudflare Tunnel
- DDNS
- router port forwarding
- public DNS
- HTTPS certificates
- auto-deploy workflows
- secrets management beyond placeholder-safe guidance

Those belong to later deployment issues.

## Prerequisites

Before starting, confirm the following:

- the repository has been pushed to a reachable Git host
- Synology has Docker Engine support available through Docker or Container Manager
- `docker-compose` or a Container Manager-compatible compose workflow is available on Synology
- the deploy operator can access the Synology host through a normal, approved admin path
- the chosen Synology destination has enough space for the repository, image layers, and logs
- the local machine has already verified the app with `npm run build`
- the local machine has already verified the Docker configuration with `docker compose config`
- the Synology SSH user can run the required Docker commands, which may mean using `sudo docker-compose`

## Expected Deployment Shape

The expected shape is a single application container built from this repository:

```text
Git checkout on Synology
  -> docker-compose build
  -> personal-site container
  -> port 3001 exposed on the LAN
```

Expected runtime characteristics:

- one service: `personal-site`
- one exposed port: `3001`
- no database
- no persistent application volume required for normal operation
- no committed secrets

## Public-Safe Placeholders

Use placeholders like these in local notes, checklists, or commands:

```text
<synology-host>
<deploy-user>
<app-directory>
<repo-url>
http://<synology-host>:3001
```

Do not commit or publish:

- internal IP addresses
- private hostnames
- real usernames
- real deployment paths
- tokens or secrets
- SSH keys
- `.env` contents

## Step 1: Verify Locally

Before touching Synology, verify the current checkout locally:

```powershell
npm install
npm run build
docker compose config
docker compose up --build
```

Verify these routes locally:

```text
http://localhost:3001
http://localhost:3001/projects
http://localhost:3001/writing
```

Stop the local compose run cleanly when finished:

```powershell
docker compose stop
```

If the local Docker flow is not healthy, do not proceed to Synology yet.

## Step 2: Prepare Synology Destination

Choose or create a deployment directory on Synology using a placeholder-safe path convention:

```text
<app-directory>
```

The directory should be used for:

- the git checkout
- the compose file
- Docker build context
- normal operator access for updates and rollback

Keep the path stable so update and rollback steps stay simple.

## Step 3: Get The Repo Onto Synology

Clone the repository onto Synology, or update an existing checkout.

Fresh checkout example:

```bash
git clone <repo-url> <app-directory>
cd <app-directory>
```

Existing checkout example:

```bash
cd <app-directory>
git pull
```

Optional safety check:

```bash
git status
sudo docker-compose config
```

The working tree should be clean before starting or updating the deployment.

## Step 4: Build And Start With Docker Compose

From the Synology checkout directory, the normal update flow is:

```bash
cd <app-directory>
./scripts/deploy-synology-lan.sh
```

The script performs the safe update sequence for the current Synology environment:

- `git fetch origin`
- `git checkout main`
- `git pull --ff-only origin main`
- `sudo docker-compose config`
- `sudo docker-compose up --build -d`
- `sudo docker-compose ps`
- `sudo docker-compose logs --tail=100 personal-site`

By default the script uses:

```bash
sudo docker-compose
```

If the Synology shell environment differs, the compose command can be overridden briefly for one run:

```bash
COMPOSE_CMD="docker-compose" ./scripts/deploy-synology-lan.sh
```

or:

```bash
COMPOSE_CMD="sudo docker-compose" ./scripts/deploy-synology-lan.sh
```

If the script is not available yet and you need the equivalent manual flow, run:

```bash
cd <app-directory>
git fetch origin
git checkout main
git pull --ff-only origin main
sudo docker-compose config
sudo docker-compose up --build -d
sudo docker-compose ps
sudo docker-compose logs --tail=100 personal-site
```

Then confirm the service is running:

```bash
sudo docker-compose ps
```

If Synology Container Manager is being used instead of a raw shell session, use the same repository files and equivalent compose-project actions:

- select the repo checkout as the compose project source
- review the rendered compose configuration
- build the image from the current checkout
- start the `personal-site` service
- confirm port `3001` is published

The guide still assumes the committed `docker-compose.yml` remains the source of truth.

## Step 5: Verify On The LAN

From another device on the same network, or from the Synology host itself, verify:

```text
http://<synology-host>:3001
http://<synology-host>:3001/projects
http://<synology-host>:3001/writing
```

Confirm:

- the homepage loads
- the projects page loads
- the writing page loads
- the site is not being treated as a public deployment

## Step 6: Inspect Logs

If the service is up but the site is not behaving as expected, inspect logs:

```bash
cd <app-directory>
sudo docker-compose logs --tail=100 personal-site
```

Useful checks:

- start-up errors
- container exit loops
- missing files in the build context
- port binding failures

## Updating The Deployment

Use a safe, manual update path:

```bash
cd <app-directory>
./scripts/deploy-synology-lan.sh
```

Then re-run the LAN verification URLs.

Update only after the new revision has already passed local verification.

If needed, the script can use an alternate compose command for one run:

```bash
COMPOSE_CMD="docker-compose" ./scripts/deploy-synology-lan.sh
```

## Rollback

If a newly deployed revision fails, return to the last known good revision:

```bash
cd <app-directory>
git checkout <previous-known-good-commit>
sudo docker-compose up --build -d
sudo docker-compose ps
```

Then verify again on the LAN:

```text
http://<synology-host>:3001
```

Record which revision failed and what was observed before trying another update.

## Troubleshooting

If the site does not come up cleanly, check the following:

- `sudo docker-compose config` does not report config errors
- the Synology host has enough free space for the image build
- port `3001` is not already occupied by another service
- the checkout contains the expected `Dockerfile` and `docker-compose.yml`
- the checkout contains `scripts/deploy-synology-lan.sh`
- the container is still running after start-up
- the LAN client can resolve or reach `<synology-host>`

If local Docker verification worked but Synology fails, compare:

- Docker version
- Compose support
- checkout state on Synology
- published port configuration

## Safety Checklist

Before considering this deployment ready, confirm:

- only placeholder values appear in docs or saved notes meant for the repo
- no internal IPs or private hostnames were committed
- no secrets were added to tracked files
- the site is reachable only on the LAN deployment path described here
- no reverse proxy, tunnel, public DNS, or router exposure was added as part of this guide
- rollback steps have been tested or at least walked through on paper

## Future Public Deployment Work

Later deployment issues may add:

- reverse proxy configuration
- public DNS and routing
- HTTPS
- selective exposure of additional services
- deployment automation

Those steps should be documented separately so the first LAN-only deployment path stays simple and public-safe.
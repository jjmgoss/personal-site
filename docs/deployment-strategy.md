# Deployment Strategy

## Overview

The deployment strategy is Synology-first, but not Synology-only.

The site should be built so it can run locally, on Synology, on a cheap VPS, or on a cloud platform with minimal changes.

The first public version should be cheap, simple, and safe.

## Deployment Goals

The deployment approach should:

- Be cheap to operate.
- Work on local hardware first.
- Support Synology hosting.
- Avoid hard-coding Synology-specific assumptions.
- Keep the app portable to a generic Docker host.
- Support HTTPS when public.
- Keep secrets out of the repo.
- Allow live side projects to run as separate services.

## Deployment Non-Goals For MVP

Do not add the following in the initial deployment work:

- Kubernetes
- Complex CI/CD
- Multi-environment promotion
- Blue/green deployments
- Managed database
- Authentication
- Admin dashboard
- Public operational dashboards
- Auto-deploy to home infrastructure without human review

These may be useful later, but the first deployment should be simple.

## Target Progression

The intended progression is:

```text
1. Local development
2. Local production build
3. Local Docker run
4. Synology LAN deployment
5. Public domain and HTTPS
6. Optional VPS/cloud migration
```

Each stage should work before moving to the next.

## Local Development

The current local commands are:

```powershell
npm install
npm run dev
npm run build
```

Use `npm run start` to launch the production server locally after a successful build.

## Local Production Build

Before deploying anywhere, the app should support a local production build.

Expected future command:

```powershell
npm run build
```

If the site uses static export, document the output directory clearly.

If the site uses a Next.js server runtime, document the production start command clearly.

The project should choose one deployment mode explicitly when the scaffold is created.

## Docker Strategy

Docker should be used to make the deployment portable.

Expected future artifacts:

```text
Dockerfile
.dockerignore
docker-compose.yml
```

The Docker setup should:

- Build from a clean checkout.
- Not require secrets at build time.
- Expose a single app port.
- Work behind a reverse proxy.
- Run locally before being copied to Synology.
- Avoid persistent volumes unless they are truly required.

Since the MVP is static-first, the container should be simple.

## Synology LAN Deployment

The first self-hosted target is Synology on the local network.

The first Synology deployment should be LAN-only. Public access should be a separate step.

Synology deployment options may include:

- Synology Container Manager / Docker Compose project
- Manual Docker Compose over SSH
- GitHub Actions manual workflow over SSH
- Pulling the repo on Synology and running deploy commands locally

The initial preference is:

```text
Build and test locally
  -> push to GitHub
  -> manually deploy to Synology
  -> verify on LAN
```

The current LAN-only deployment guide lives in `docs/synology-lan-deployment.md`.

Only after LAN deployment works should public routing be configured.

## Public Access Options

There are three likely public access models.

The current public routing decision is documented in `docs/public-routing-decision.md`.

The chosen first public routing model is Cloudflare Tunnel for `lab.jjmgoss.com`.

The current LAN-only Synology deployment remains the baseline until that later implementation work is explicitly approved.

Before enabling any future Cloudflare Tunnel route, use `docs/cloudflare-tunnel-rollback.md` as the planning reference for temporary disablement and full rollback back to LAN-only operation.

### Option 1: Cloudflare Tunnel

Cloudflare Tunnel avoids direct inbound port forwarding to the home network.

Pros:

- No router port forwarding required.
- Can be safer and easier for home hosting.
- Supports HTTPS through Cloudflare.
- Useful for exposing specific services selectively.

Cons:

- Adds dependency on Cloudflare.
- Requires tunnel process/configuration.
- Slightly less generic than plain reverse proxy hosting.

### Option 2: DDNS + Caddy

This uses DNS or DDNS pointing to the home network, with Caddy handling HTTPS and reverse proxying.

Pros:

- Portable to VPS later.
- Common reverse proxy pattern.
- Caddy can automate HTTPS.
- Clear mental model.

Cons:

- Requires inbound network exposure.
- Requires router/firewall care.
- Home IP/network reliability matters.
- Must avoid exposing private services accidentally.

### Option 3: Cheap VPS

This moves hosting away from the home network.

Pros:

- Cleaner public hosting environment.
- No home network exposure.
- Easier public availability.
- Often simpler DNS and HTTPS story.

Cons:

- Monthly cost.
- Another server to maintain.
- Less aligned with Synology-first goal.

## Recommended Initial Path

Recommended order:

1. Build static-first site locally.
2. Add Docker production build.
3. Run Docker container locally.
4. Deploy to Synology on LAN.
5. Decide public access model.
6. Implement Cloudflare Tunnel for `lab.jjmgoss.com` only after separate approval.
7. Add side-project subdomains later.

Do not start with public exposure.

## Reverse Proxy Strategy

The app should be reverse-proxy-friendly.

Expected public routing shape:

```text
example.com                 Main personal/project site
hn.example.com              HN Trend Tracker live app
repo-rails.example.com      repo-rails docs or demo, if exposed
status.example.com          Optional status page
```

Prefer subdomains for separately deployed apps.

Avoid path-based routing for live apps at first because many frameworks require extra base-path configuration.

## Placeholder Caddy Shape

A future Caddy config may look like this:

```text
example.com {
  reverse_proxy personal-site:3000
}

hn.example.com {
  reverse_proxy hn-trend-tracker-frontend:3000
}

api.hn.example.com {
  reverse_proxy hn-trend-tracker-backend:8000
}
```

This is only a placeholder. Do not commit real domains or internal hostnames unless they are intentionally public.

## Secrets And Configuration

Do not commit secrets.

Possible future deployment secrets:

```text
SYNOLOGY_HOST
SYNOLOGY_USER
SYNOLOGY_SSH_KEY
SYNOLOGY_APP_DIR
```

Use GitHub Actions secrets, local `.env` files, Synology configuration, or another secret store.

Never commit:

```text
.env
*.pem
*.key
id_rsa
id_ed25519
```

## GitHub Actions Deployment

The repo-rails deploy workflow is a manual-only skeleton.

Before using it:

- Confirm the app can build locally.
- Confirm the app can run locally in Docker.
- Confirm Synology SSH access manually.
- Confirm the deployment directory exists.
- Confirm secrets are configured.
- Confirm the command is safe.
- Confirm rollback steps.

Do not enable automatic deployment until manual deployment is reliable.

## Rollback Strategy

The initial rollback strategy can be simple:

1. Keep the previous working image or checkout available.
2. Stop the new container.
3. Restart the previous container or previous compose version.
4. Verify the site is reachable.
5. Document what failed.

A more formal rollback process can be added later.

For the planned Cloudflare Tunnel public-routing path, the current rollback planning doc is `docs/cloudflare-tunnel-rollback.md`.

## Public Safety Checklist

Before exposing the site publicly:

- Confirm no secrets are committed.
- Confirm docs do not include private hostnames or IPs.
- Confirm no admin services are publicly routed.
- Confirm only intended ports/services are exposed.
- Confirm HTTPS works.
- Confirm the site has no private content.
- Confirm project pages are intentionally public.
- Confirm robots/indexing posture is acceptable.
- Confirm contact information, if any, is intentional.

## Future VPS/Cloud Migration

The project should remain portable.

If moving to a VPS later, the likely migration path is:

```text
Copy repo
Install Docker
Copy environment config
Run docker compose
Point DNS to VPS
Configure Caddy/HTTPS
Verify public routing
```

Avoid Synology-only assumptions in app code.

## Open Decisions

These decisions should be made later, after the static app runs locally:

1. Use static export or Next.js server runtime?
2. When should the Cloudflare Tunnel decision be implemented for `lab.jjmgoss.com`?
3. Keep public hosting on Synology or move to cheap VPS?
4. Add RSS?
5. Add analytics?
6. Add status monitoring?
7. Add deployment automation?
8. Add private admin surfaces?

Do not resolve these before the MVP needs them.

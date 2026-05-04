# Cloudflare Tunnel Rollback And Disable

## Purpose

This guide documents how to disable or roll back a future Cloudflare Tunnel public route for the site while preserving the current Synology LAN deployment.

The goal is to return safely to LAN-only operation without deleting the local app, local content, or the working Synology deployment unnecessarily.

## Scope

This document is planning and rollback guidance only.

For the corresponding setup-side planning guide, see `docs/cloudflare-tunnel-setup.md`.

It does not:

- create a Cloudflare Tunnel
- create DNS records
- enable public access
- change Docker or Synology deployment behavior
- include real secrets, account IDs, internal hostnames, or internal IPs

Use placeholders only:

```text
<tunnel-name>
<cloudflare-account>
<public-hostname>
<origin-service>
<synology-host>
<app-port>
```

## Current Baseline

The current baseline is LAN-only Synology hosting.

Public-safe shape:

```text
http://<synology-host>:<app-port>
```

The LAN deployment is the fallback path.

If a future Cloudflare Tunnel route is disabled or removed, the expected end state is:

- the site is no longer reachable at `<public-hostname>`
- the site is still reachable on the LAN at `http://<synology-host>:<app-port>`
- the Synology-hosted app and Docker deployment remain intact unless there is a separate reason to change them

## Quick Stop / Temporary Disable

Use this path when public access should stop quickly but the future tunnel setup may be needed again later.

Safest first-line actions:

1. Disable the Cloudflare Tunnel process or connector that serves `<tunnel-name>`.
2. Or remove/disable the public hostname route that maps `<public-hostname>` to the tunnel.
3. Leave the Synology app, Docker Compose deployment, and LAN path running.

The temporary-disable mindset is:

```text
stop public ingress first
keep local origin running
verify LAN access still works
```

When documenting future operator steps or runbooks, prefer examples like:

```text
Disable tunnel: <tunnel-name>
Disable public hostname mapping: <public-hostname>
Keep origin service unchanged: <origin-service>
```

Do not make deleting the local app the emergency stop.

## Full Rollback / Remove Public Route

Use this path when the decision is to remove the public route entirely rather than pause it.

Recommended order:

1. Disable public routing first.
2. Confirm `<public-hostname>` is no longer routed to the tunnel.
3. Confirm the local origin on Synology is still healthy.
4. Remove tunnel-specific configuration only after the public route is confirmed inactive.

At a practical level, a full rollback should usually mean removing or disabling only the public-facing pieces such as:

- the hostname route for `<public-hostname>`
- the tunnel definition for `<tunnel-name>`
- any tunnel-specific runtime or service definition that exists solely for public routing

It should not mean deleting:

- the application repository checkout
- the Docker Compose deployment for the site
- the Synology LAN deployment itself
- project content or app data that is unrelated to the public route

## Return To LAN-Only Operation

The rollback target is the already working LAN-only deployment.

After disabling or removing the public route, confirm the site still works at:

```text
http://<synology-host>:<app-port>
http://<synology-host>:<app-port>/projects
http://<synology-host>:<app-port>/writing
```

If LAN access fails after public-route rollback, investigate the local app or Docker deployment separately.

Do not assume the tunnel rollback itself requires rebuilding or deleting the local container.

## Verification Checklist

After any disable or rollback action, confirm:

- `<public-hostname>` no longer serves the app
- the LAN URL still serves the homepage
- the LAN projects route still loads
- the LAN writing route still loads
- the Synology deployment still reports the app container as healthy
- no unrelated services were exposed or changed during the rollback

If a future tunnel implementation adds health checks or logging, include those in the operator checklist rather than replacing the LAN verification steps.

## Safety Notes

Prefer reversible actions first.

In an emergency, the safest stop is usually to disable the tunnel or disable the public hostname route, not to delete the origin app.

Avoid first-line cleanup actions such as:

- deleting the Synology checkout
- deleting the local Docker image cache as a rollback shortcut
- deleting compose files
- deleting the entire tunnel configuration before verifying LAN access

Rollback should reduce public exposure while preserving the known-good LAN fallback.

## What Not To Delete Casually

Do not casually delete any of the following during a rollback:

- the working Synology application checkout
- the committed `docker-compose.yml`
- the current LAN deployment documentation
- the deploy helper script
- any future secret references stored outside the repo without first confirming what depends on them

If later implementation introduces a dedicated tunnel container or service, treat it as removable only after the hostname route is disabled and LAN access is verified.

## What Not To Commit

Never commit:

- Cloudflare tunnel tokens
- Cloudflare account IDs
- real DNS record IDs
- internal IP addresses
- private hostnames
- usernames
- local filesystem paths
- Synology DSM URLs
- screenshots of Cloudflare or Synology dashboards
- `.env` contents or secrets of any kind

Keep examples placeholder-safe.

## Future Implementation Notes

When Cloudflare Tunnel is implemented in a later issue, the implementation should also document:

- where the tunnel process runs
- how `<public-hostname>` maps to `<origin-service>`
- the exact temporary-disable action
- the exact full-removal action
- how to verify the site has returned to LAN-only operation

That later implementation should preserve this principle:

```text
public routing is optional
LAN operation is the fallback baseline
```
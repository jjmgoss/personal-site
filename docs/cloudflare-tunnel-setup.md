# Cloudflare Tunnel Setup For lab.jjmgoss.com

## Goal And Scope

This guide documents the intended setup shape for exposing the `personal-site` app publicly at `lab.jjmgoss.com` through Cloudflare Tunnel.

The goal is to prepare the repository for safe human execution without committing secrets or changing the existing Synology LAN deployment baseline.

This guide does not:

- create a real Cloudflare Tunnel
- create DNS records
- enter a tunnel token
- expose the site publicly from this repository change
- modify the working LAN deployment behavior by default

## Baseline

The current baseline remains the existing Synology LAN deployment.

Public-safe current shape:

```text
http://<synology-host>:<app-port>
```

The Cloudflare Tunnel path should be treated as a separate runtime concern layered on top of that working baseline.

The fallback remains LAN-only operation.

If public routing is disabled, the expected fallback is still:

```text
http://<synology-host>:<app-port>
```

For rollback and disable steps, see `docs/cloudflare-tunnel-rollback.md`.

## Intended Hostname

The first intended public hostname is:

```text
lab.jjmgoss.com
```

This guide is scoped only to that hostname.

It does not decide or route:

- `jjmgoss.com`
- other project subdomains
- Synology DSM
- any unrelated app or admin surface

## Recommended Tunnel Shape

The preferred setup is:

```text
Public browser
  -> https://lab.jjmgoss.com
  -> Cloudflare
  -> Cloudflare Tunnel
  -> http://<origin-service>:<app-port>
  -> personal-site app
```

The tunnel should map only the intended public hostname to only the `personal-site` origin.

Do not route:

- Synology DSM
- SSH
- admin interfaces
- databases
- other containers
- development servers

## Where The Tunnel Should Run

The recommended posture is to run the tunnel as a separate runtime concern from the app itself.

That means:

- keep the existing `personal-site` app container responsible only for the site
- run `cloudflared` separately, such as a sidecar container or equivalent Synology-managed runtime
- keep the tunnel token and any Cloudflare-specific values outside the repo

This keeps public routing easier to disable without changing the app container itself.

## How The Tunnel Should Reach The Local App Origin

The tunnel should point to the existing app origin, not to Synology DSM and not to a development server.

Public-safe placeholder shape:

```text
http://<origin-service>:<app-port>
```

Examples of acceptable placeholder meanings:

- `<origin-service>` could be the compose service name for the site
- `<app-port>` should be the app's internal or intended origin port

Do not commit the real internal hostname, container IP, Synology LAN hostname, or any other private network detail if it is not already intentionally public.

## Human-Gated Setup Steps

The following steps require a human operator and should not be treated as completed by this repository change:

1. Create or select the Cloudflare Tunnel for `<tunnel-name>`.
2. Create or confirm the hostname route for `lab.jjmgoss.com`.
3. Obtain the tunnel token or credentials outside the repo.
4. Install or run `cloudflared` in the approved Synology/runtime location.
5. Enter the real token or credentials outside the repository.
6. Verify public routing from outside the LAN.
7. Disable public access immediately if the result is not as expected.

These are operator actions, not repository-side automated steps.

## Human-Only Cloudflare Dashboard Actions

Use Cloudflare dashboard actions only as a human-gated deployment step.

Expected operator responsibilities include:

- choosing or confirming `<cloudflare-account>`
- creating or selecting `<tunnel-name>`
- adding the hostname route for `lab.jjmgoss.com`
- confirming the tunnel points only to the `personal-site` origin
- verifying HTTPS at the public hostname

Do not commit screenshots, copied dashboard values, tunnel IDs, or account IDs.

## Safe Placeholder CLI Examples

If a human later uses CLI-based setup, examples must remain placeholder-safe.

Example placeholder-only shapes:

```text
cloudflared tunnel create <tunnel-name>
cloudflared tunnel route dns <tunnel-name> lab.jjmgoss.com
cloudflared tunnel run <tunnel-name>
```

These are documentation examples only.

Do not commit real tokens, IDs, or generated config values.

## Safe Template Files

This repository includes example-only templates under `docs/examples/`.

Use them as references only:

- `docs/examples/cloudflared-compose.example.yml`
- `docs/examples/cloudflared-config.example.yml`

They are intentionally non-runnable until a human fills in real values outside the repository.

## Verification Checklist

Before enabling public exposure, confirm:

- the LAN app is healthy before tunnel setup
- the tunnel maps only `lab.jjmgoss.com`
- the tunnel origin points only to the `personal-site` app
- no DSM, admin, or unrelated service ports are routed
- HTTPS works at the public hostname
- the homepage loads publicly
- `/projects` loads publicly
- `/writing` loads publicly
- `/now` loads publicly
- the theme toggle works publicly
- no private LAN URLs appear in rendered pages
- the rollback path is understood before exposing

## Rollback Checklist

Before enabling the tunnel, review the rollback guide:

- `docs/cloudflare-tunnel-rollback.md`

At minimum, the operator should know how to:

- temporarily disable public exposure
- fully remove the public hostname route later if needed
- confirm the site still works on the LAN

## What Not To Commit

Never commit:

- Cloudflare tunnel tokens
- tunnel IDs
- Cloudflare account IDs
- real DNS record IDs
- internal IP addresses
- private hostnames
- usernames
- local filesystem paths
- Synology DSM URLs
- screenshots of Cloudflare or Synology dashboards
- `.env` contents or secrets of any kind

Keep all examples placeholder-safe.

## Future Follow-Ups

Later work may add:

- a human-approved runtime recipe for `cloudflared` on Synology
- exact operator commands once the runtime location is chosen
- public verification notes after the first exposure is intentionally enabled
- route-specific troubleshooting if the first public hostname behaves differently than LAN access

This guide should remain aligned with the rollback model in `docs/cloudflare-tunnel-rollback.md`.
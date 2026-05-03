# Public Routing Decision

## Status

Accepted for planning.

This document records the chosen first public routing model for the site.

It does not implement public exposure.

## Decision Summary

The first public routing model should be Cloudflare Tunnel.

The intended first public hostname is:

```text
lab.jjmgoss.com
```

The root domain should remain unused or parked for now:

```text
jjmgoss.com
```

The current Synology LAN deployment remains the baseline runtime.

This decision does not create tunnel configuration, DNS records, public routes, HTTPS configuration, or deployment automation.

## Decision

Choose Cloudflare Tunnel as the first public exposure model for the existing Synology-hosted site.

Keep the current LAN deployment intact:

- Synology remains the application host
- Docker Compose remains the LAN deployment shape
- the app continues to run behind the current LAN-only setup first
- public exposure is a later follow-up, not part of this PR

## Current State

The current deployment baseline is:

- Synology hosts the app
- Docker Compose is used on Synology with `sudo docker-compose`
- the current LAN host port is `3001`
- the manual LAN update helper is `scripts/deploy-synology-lan.sh`
- local production verification exists before Synology deployment

Public-safe current LAN shape:

```text
http://<synology-lan-host>:<configured-lan-port>
```

In the current checked-in compose file, the configured Synology-facing port is `3001`.

## Intended First Public Hostname

The first intended public hostname is:

```text
lab.jjmgoss.com
```

Intended meaning:

- `lab.jjmgoss.com` is for the public project lab and personal project site
- `jjmgoss.com` remains unused or parked for now
- future subdomains may be added later for specific apps or services

This PR does not create DNS records, tunnel routes, or origin mappings.

## Chosen Public Routing Model

The chosen first model is Cloudflare Tunnel.

Planned future routing shape, still placeholder-safe:

```text
lab.jjmgoss.com
  -> Cloudflare Tunnel
  -> http://<synology-lan-host>:<configured-lan-port>
```

## Options Considered

### Option 1: Cloudflare Tunnel

Summary:

- keeps Synology as the host
- publishes only the intended app hostname
- avoids router port forwarding
- can be disabled quickly if needed

Assessment:

- Cost: low, aligns with the current cheap/self-hosted goal
- Security posture: strong for a first public step because it avoids direct inbound exposure to the home network
- Operational complexity: moderate, because Cloudflare-specific setup is required, but the network story is simpler than exposing the home network directly
- Fit with Synology-first hosting: strong, because the app can stay on the current Synology deployment target
- Portability: moderate, because the public entry path depends on Cloudflare, but the app itself remains portable
- Reversibility: strong, because the public route can be disabled without redesigning the Synology deployment
- Risk of exposing private infrastructure: lower than direct home-network exposure if configured to publish only the intended hostname

### Option 2: DDNS Plus Caddy

Summary:

- keeps Synology as the host
- uses direct public ingress to the home network
- uses a more traditional reverse proxy setup

Assessment:

- Cost: low
- Security posture: weaker as a first step because it increases responsibility for router, firewall, port exposure, and reverse-proxy hardening
- Operational complexity: moderate to high for a home-hosted first public deployment because networking and HTTPS become immediate operator concerns
- Fit with Synology-first hosting: good, but it asks the Synology environment to absorb public ingress concerns immediately
- Portability: strong, because Caddy-style reverse proxy patterns transfer well to VPS hosting later
- Reversibility: moderate, but disabling exposure may involve undoing multiple network-facing pieces
- Risk of exposing private infrastructure: higher than Cloudflare Tunnel because direct ingress to the home network must be configured correctly

### Option 3: Cheap VPS

Summary:

- moves public hosting away from the home network entirely
- avoids public ingress to Synology
- adds a separate server to operate

Assessment:

- Cost: higher than the current Synology-first path because it adds ongoing hosting spend
- Security posture: potentially strong, but it introduces a separate publicly reachable server that still needs maintenance and hardening
- Operational complexity: moderate, because public hosting becomes cleaner but another deployment target must be managed
- Fit with Synology-first hosting: weak for the first public step because it moves away from the currently working host
- Portability: strong, because VPS deployment is broadly portable
- Reversibility: moderate, because a migration path is needed if the VPS is abandoned later
- Risk of exposing private infrastructure: lower for the home network, but the project gains another public system to operate

## Why Cloudflare Tunnel First

Cloudflare Tunnel is the best first public model for this repository because:

- it avoids router port forwarding
- it keeps Synology as the host
- it does not require exposing Synology DSM directly
- it can publish only `lab.jjmgoss.com`
- it can be turned off quickly if the public setup is not ready
- it fits the current cheap/self-hosted goal
- it lets the current LAN deployment remain the operational baseline

This is the most conservative step from a working LAN deployment toward public access.

## Why Not DDNS Plus Caddy Yet

DDNS plus Caddy remains a viable future option, but not the first one.

Reasons to defer it:

- it would require direct inbound exposure to the home network
- router and firewall correctness would immediately matter
- HTTPS and public ingress hardening would become first-step concerns
- it creates more opportunities to expose unintended services if the setup is incomplete

This option may become more attractive later if the site moves to a more traditional reverse-proxy deployment shape.

## Why Not VPS Yet

A cheap VPS remains a viable later option, but it is not the best first public step.

Reasons to defer it:

- it adds recurring cost earlier than necessary
- it bypasses the current working Synology-first deployment path
- it introduces another system to manage before the public routing model is proven useful

The VPS path is still useful as a later portability option if home hosting becomes a constraint.

## Tradeoffs

The main tradeoffs of choosing Cloudflare Tunnel first are:

- lower home-network exposure in exchange for a Cloudflare dependency
- simpler public exposure in exchange for less provider neutrality
- keeping the current Synology deployment in place in exchange for not validating a VPS path yet

These are acceptable tradeoffs for the first public hostname.

## Non-Goals

This decision does not:

- create a Cloudflare Tunnel
- create DNS records
- configure public hostnames
- add Cloudflare tokens
- add a `cloudflared` container
- add Caddy
- add router port forwarding
- add HTTPS configuration
- add deployment automation
- expose the site publicly
- change app code
- change Docker runtime behavior

## Safety Requirements

Any later implementation work should keep the following boundaries:

- do not commit tunnel tokens, secrets, account IDs, or private infrastructure values
- do not commit LAN IP addresses, private Synology hostnames, usernames, or private paths
- do not expose Synology DSM or unrelated services
- expose only the intended hostname and application
- keep the current LAN deployment usable even if public routing is disabled
- require explicit human approval before enabling public exposure

Use placeholders for future implementation notes such as:

```text
<synology-lan-host>
<configured-lan-port>
<cloudflare-tunnel-name>
<public-hostname>
http://<synology-lan-host>:<configured-lan-port>
```

## Rollback Or Disablement Considerations

The first public routing model should be easy to disable.

Desired rollback posture:

- disable the public tunnel route
- stop or disable the tunnel process if needed
- confirm the Synology LAN deployment still works at the local network address
- verify that only the LAN path remains active

The rollback target is the already working LAN-only deployment.

## Future Implementation Plan

Implementation should happen in separate follow-up issues:

1. prepare the Cloudflare Tunnel configuration approach for the site
2. document rollback and disable steps for the public route
3. decide later what `jjmgoss.com` should do at the root domain

No implementation happens in this PR.

## Follow-Up Issues

Planned follow-up issues:

1. `#27 [deployment] Configure Cloudflare Tunnel for lab.jjmgoss.com`
2. `#28 [deployment] Document Cloudflare Tunnel rollback and disable process`
3. `#29 [deployment] Decide future root-domain behavior for jjmgoss.com`

## Open Questions

The following questions remain open for later implementation work:

1. Should the tunnel run directly on Synology or through a dedicated sidecar/container approach?
2. What is the safest minimal scope for the first public route beyond the app hostname itself?
3. Should the root domain later become a simple landing page, redirect, or separate static site?
4. When public exposure is enabled, what monitoring or health checks are necessary?
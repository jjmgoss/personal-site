#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_CMD_STRING="${COMPOSE_CMD:-sudo docker-compose}"

read -r -a COMPOSE_CMD_ARR <<< "${COMPOSE_CMD_STRING}"

step() {
  printf '\n==> %s\n' "$1"
}

run_compose() {
  "${COMPOSE_CMD_ARR[@]}" "$@"
}

step "Changing to repository root"
cd "${REPO_ROOT}"

step "Fetching latest changes from origin"
git fetch origin

step "Checking out main"
git checkout main

step "Pulling latest main with fast-forward only"
git pull --ff-only origin main

step "Validating Docker Compose configuration with: ${COMPOSE_CMD_STRING}"
run_compose config

step "Rebuilding and restarting the personal-site service"
run_compose up --build -d

step "Showing service status"
run_compose ps

step "Showing recent personal-site logs"
run_compose logs --tail=100 personal-site
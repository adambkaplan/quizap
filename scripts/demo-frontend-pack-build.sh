#!/usr/bin/env bash

###############################################################################
#
# demo-frontend-pack-build.sh
#
# Demo script showing how to build the frontend container with Pack CLI
#
###############################################################################

# Source the demo-magic script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/demo-magic.sh"

# Configuration variables matching the Makefile
IMAGE_REPO="ghcr.io/adambkaplan/quizap"
IMAGE_TAG="latest"
IMAGE_PUSH="false"
CONTAINER_ENGINE="podman"
FRONTEND_DIR="frontend"
BUILDER="docker.io/paketobuildpacks/builder-jammy-base:0.4.479"

# Set PACK_DOCKER_HOST when using podman
if [[ "$CONTAINER_ENGINE" == "podman" ]]; then
  PACK_DOCKER_HOST="inherit"
else
  PACK_DOCKER_HOST=""
fi

# Clear screen
clear

# Build the pack command
PACK_CMD="pack build \"$IMAGE_REPO/frontend:$IMAGE_TAG\""
PACK_CMD="$PACK_CMD --path $FRONTEND_DIR"
PACK_CMD="$PACK_CMD --builder $BUILDER"
if [[ -n "$PACK_DOCKER_HOST" ]]; then
  PACK_CMD="$PACK_CMD --docker-host $PACK_DOCKER_HOST"
fi
PACK_CMD="$PACK_CMD --publish=$IMAGE_PUSH"
PACK_CMD="$PACK_CMD --network host"
PACK_CMD="$PACK_CMD --verbose"

# Execute the build
p "# Let's build the frontend container..."
pe "$PACK_CMD"
NO_WAIT_CMD=true p ""

# Show completion
NO_WAIT=true p "# Build complete!"
NO_WAIT=true p "# The frontend container image has been built:"
NO_WAIT=true p "# $IMAGE_REPO/frontend:$IMAGE_TAG"

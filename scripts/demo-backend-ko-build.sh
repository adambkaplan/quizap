#!/usr/bin/env bash

###############################################################################
#
# demo-backend-ko-build.sh
#
# Demo script showing how to build the backend container with ko
#
###############################################################################

# Source the demo-magic script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/demo-magic.sh"

# Configuration variables matching the Makefile
IMAGE_REPO="ghcr.io/adambkaplan/quizap"
IMAGE_TAG="latest"
IMAGE_PUSH="false"
INSECURE_REGISTRY="false"
BACKEND_DIR="backend"

# Clear screen
clear

# Build the ko command
KO_CMD="cd $BACKEND_DIR && go clean -cache && KO_DOCKER_REPO=\"$IMAGE_REPO\" ko build ."
KO_CMD="$KO_CMD --base-import-paths"
KO_CMD="$KO_CMD --push=$IMAGE_PUSH"
KO_CMD="$KO_CMD --tags=$IMAGE_TAG"
KO_CMD="$KO_CMD --insecure-registry=$INSECURE_REGISTRY"

# Execute the build
p "# Let's build the backend container..."
pe "$KO_CMD"
NO_WAIT_CMD=true p ""

# Show completion
NO_WAIT=true p "# Build complete!"
NO_WAIT=true p "# The backend container image has been built:"
NO_WAIT=true p "# $IMAGE_REPO/backend:$IMAGE_TAG"


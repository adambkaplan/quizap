#!/usr/bin/env bash

###############################################################################
#
# demo-backend-shipwright-build.sh
#
# Demo script showing how to build the backend container with Shipwright
#
###############################################################################

# Source the demo-magic script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/demo-magic.sh"

# Configuration variables
BUILD_MANIFEST="shipwright/quizap/backend-build.yaml"
BUILD_NAME="quizap-backend"
NAMESPACE="quizap-dev"

# Clear screen
clear

# Apply the Build manifest
p "# First, let's apply the Build manifest..."
pe "kubectl apply -f $BUILD_MANIFEST"

# Start the build and follow logs
p "# Now let's start the build and follow the logs..."
pe "shp build run $BUILD_NAME -n $NAMESPACE -F"
NO_WAIT_CMD=true p ""

# Show completion
NO_WAIT=true p "# Build complete!"
NO_WAIT=true p "# The backend container image has been built and pushed to:"
NO_WAIT=true p "# harbor-core.harbor.svc.cluster.local/quizap/backend:latest"



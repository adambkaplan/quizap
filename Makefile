# Copyright Adam B Kaplan
#
# SPDX-License-Identifier: MIT

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Project directories
FRONTEND_DIR := frontend
BACKEND_DIR := backend

# Backend configuration
BACKEND_BINARY := quizap-backend
BACKEND_PORT := 8080

# Frontend configuration
FRONTEND_PORT := 9000

# CONTAINER_ENGINE for running containers
# Defaults to "podman", set to "docker" to use docker
CONTAINER_ENGINE := "podman"

# DOCKER_HOST for pack
# Automatically set to "inherit" when using podman
ifeq ($(CONTAINER_ENGINE),"podman")
PACK_DOCKER_HOST := "inherit"
else
PACK_DOCKER_HOST := ""
endif

# Image repository options
# IMAGE_REPO: registry to push container images to
IMAGE_REPO := ghcr.io/adambkaplan/quizap
# IMAGE_TAG: tag to use for container images
IMAGE_TAG := "latest"
# IMAGE_PUSH: push container images to the registry during the build
IMAGE_PUSH := "false"

##@ Development Commands

.PHONY: help
help: ## Display this help message
	@echo "$(GREEN)Quizap Development Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##.*backend/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Frontend Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##.*frontend/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Development Workflow:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##.*dev/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)KIND Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##.*kind/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Utility Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##.*utility/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

##@ Backend Commands

.PHONY: backend-install
backend-install: ## Install backend dependencies
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd $(BACKEND_DIR) && go mod download
	cd $(BACKEND_DIR) && go mod verify

.PHONY: backend-build
backend-build: ## Build the backend binary
	@echo "$(GREEN)Building backend...$(NC)"
	cd $(BACKEND_DIR) && go build -o $(BACKEND_BINARY) main.go
	@echo "$(GREEN)Backend built successfully: $(BACKEND_DIR)/$(BACKEND_BINARY)$(NC)"

.PHONY: backend-build-container
backend-build-container: ## Build the backend container with ko
	@echo "$(GREEN)Building backend container with ko...$(NC)"
	cd backend && KO_DOCKER_REPO="$(IMAGE_REPO)" ko build . --base-import-paths --push=$(IMAGE_PUSH)

.PHONY: backend-run
backend-run: ## Run the backend server
	@echo "$(GREEN)Starting backend server on port $(BACKEND_PORT)...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	cd $(BACKEND_DIR) && go run main.go

.PHONY: backend-run-container
backend-run-container: ## Run the backend container
	@echo "$(GREEN)Starting backend server on port $(BACKEND_PORT)...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	$(CONTAINER_ENGINE) run -d -p $(BACKEND_PORT):8080 --name quizap-backend "$(IMAGE_REPO)/backend:$(IMAGE_TAG)"

.PHONY: backend-test
backend-test: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	cd $(BACKEND_DIR) && go test -v ./...

.PHONY: backend-test-coverage
backend-test-coverage: ## Run backend tests with coverage
	@echo "$(GREEN)Running backend tests with coverage...$(NC)"
	cd $(BACKEND_DIR) && go test -v -cover ./...

.PHONY: backend-clean
backend-clean: ## Clean backend build artifacts
	@echo "$(GREEN)Cleaning backend build artifacts...$(NC)"
	cd $(BACKEND_DIR) && rm -f $(BACKEND_BINARY)

##@ Frontend Commands

.PHONY: frontend-install
frontend-install: ## Install frontend dependencies
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd $(FRONTEND_DIR) && npm install

.PHONY: frontend-run
frontend-run: ## Run the frontend development server
	@echo "$(GREEN)Starting frontend development server on port $(FRONTEND_PORT)...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	cd $(FRONTEND_DIR) && npm run start:dev

.PHONY: frontend-build
frontend-build: ## Build the frontend for production
	@echo "$(GREEN)Building frontend for production...$(NC)"
	cd $(FRONTEND_DIR) && npm run build

.PHONY: frontend-build-container
frontend-build-container: ## Build the frontend container with pack
	@echo "$(GREEN)Building frontend container with pack...$(NC)"
	pack build "$(IMAGE_REPO)/frontend:$(IMAGE_TAG)" --path $(FRONTEND_DIR) --builder docker.io/paketobuildpacks/builder-jammy-base:latest --docker-host $(PACK_DOCKER_HOST)

.PHONY: frontend-run-container
frontend-run-container: ## Run the frontend in a container
	@echo "$(GREEN)Running frontend container...$(NC)"
	$(CONTAINER_ENGINE) run -d -p $(FRONTEND_PORT):8080 --name quizap-frontend "$(IMAGE_REPO)/frontend:$(IMAGE_TAG)"

.PHONY: frontend-test
frontend-test: ## Run frontend tests
	@echo "$(GREEN)Running frontend tests...$(NC)"
	cd $(FRONTEND_DIR) && npm test

.PHONY: frontend-test-watch
frontend-test-watch: ## Run frontend tests in watch mode
	@echo "$(GREEN)Running frontend tests in watch mode...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	cd $(FRONTEND_DIR) && npm run test:watch

.PHONY: frontend-lint
frontend-lint: ## Run frontend linting
	@echo "$(GREEN)Running frontend linting...$(NC)"
	cd $(FRONTEND_DIR) && npm run lint

.PHONY: frontend-format
frontend-format: ## Format frontend code
	@echo "$(GREEN)Formatting frontend code...$(NC)"
	cd $(FRONTEND_DIR) && npm run format

.PHONY: frontend-clean
frontend-clean: ## Clean frontend build artifacts
	@echo "$(GREEN)Cleaning frontend build artifacts...$(NC)"
	cd $(FRONTEND_DIR) && npm run clean

##@ Development Workflow

.PHONY: install
install: backend-install frontend-install ## Install all dependencies

.PHONY: dev
dev: ## Start both frontend and backend in development mode (requires two terminals)
	@echo "$(GREEN)Development mode setup$(NC)"
	@echo "$(YELLOW)To run both services, open two terminals and run:$(NC)"
	@echo "$(GREEN)Terminal 1:$(NC) make backend-run"
	@echo "$(GREEN)Terminal 2:$(NC) make frontend-run"
	@echo ""
	@echo "$(YELLOW)Or use the following commands in separate terminals:$(NC)"
	@echo "  Backend:  $(GREEN)make backend-run$(NC)"
	@echo "  Frontend: $(GREEN)make frontend-run$(NC)"

.PHONY: test
test: backend-test frontend-test ## Run all tests

.PHONY: test-coverage
test-coverage: backend-test-coverage ## Run all tests with coverage

.PHONY: lint
lint: frontend-lint ## Run all linting

.PHONY: build
build: backend-build frontend-build ## Build both frontend and backend

.PHONY: build-containers
build-containers: backend-build-container frontend-build-container ## Build both frontend and backend containers

.PHONY: run-containers
run-containers: backend-run-container frontend-run-container ## Run both frontend and backend containers

.PHONY: clean
clean: backend-clean frontend-clean ## Clean all build artifacts

##@ Utility Commands

.PHONY: check-backend
check-backend: ## Check if backend is running
	@echo "$(GREEN)Checking if backend is running...$(NC)"
	@curl -s http://localhost:$(BACKEND_PORT)/hello > /dev/null && echo "$(GREEN)✓ Backend is running$(NC)" || echo "$(RED)✗ Backend is not running$(NC)"

.PHONY: check-frontend
check-frontend: ## Check if frontend is running
	@echo "$(GREEN)Checking if frontend is running...$(NC)"
	@curl -s http://localhost:$(FRONTEND_PORT) > /dev/null && echo "$(GREEN)✓ Frontend is running$(NC)" || echo "$(RED)✗ Frontend is not running$(NC)"

.PHONY: check-services
check-services: check-backend check-frontend ## Check if both services are running

.PHONY: logs-backend
logs-backend: ## Show backend logs (if running in background)
	@echo "$(GREEN)Backend logs:$(NC)"
	@ps aux | grep -E "(go run main.go|$(BACKEND_BINARY))" | grep -v grep || echo "$(YELLOW)Backend is not running$(NC)"

.PHONY: stop-backend
stop-backend: ## Stop backend server
	@echo "$(GREEN)Stopping backend server...$(NC)"
	@pkill -f "go run main.go" || echo "$(YELLOW)No backend process found$(NC)"
	@pkill -f "$(BACKEND_BINARY)" || echo "$(YELLOW)No backend binary found$(NC)"

.PHONY: stop-frontend
stop-frontend: ## Stop frontend server
	@echo "$(GREEN)Stopping frontend server...$(NC)"
	@pkill -f "webpack serve" || echo "$(YELLOW)No frontend process found$(NC)"

.PHONY: stop-frontend-container
stop-frontend-container: ## Stop frontend container
	@echo "$(GREEN)Stopping frontend container...$(NC)"
	$(CONTAINER_ENGINE) stop quizap-frontend || echo "$(YELLOW)No frontend container found$(NC)"
	$(CONTAINER_ENGINE) rm quizap-frontend || echo "$(YELLOW)No frontend container found$(NC)"

.PHONY: stop-backend-container
stop-backend-container: ## Stop backend container
	@echo "$(GREEN)Stopping backend container...$(NC)"
	$(CONTAINER_ENGINE) stop quizap-backend || echo "$(YELLOW)No backend container found$(NC)"
	$(CONTAINER_ENGINE) rm quizap-backend || echo "$(YELLOW)No backend container found$(NC)"

.PHONY: stop-all
stop-all: stop-backend stop-frontend ## Stop all services

.PHONY: stop-containers
stop-containers: stop-backend-container stop-frontend-container ## Stop both frontend and backend containers

.PHONY: restart-backend
restart-backend: stop-backend backend-run ## Restart backend server

.PHONY: restart-frontend
restart-frontend: stop-frontend frontend-run ## Restart frontend server

.PHONY: setup
setup: install ## Complete setup for new contributors
	@echo "$(GREEN)Setup complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "1. Start backend:  $(GREEN)make backend-run$(NC)"
	@echo "2. Start frontend: $(GREEN)make frontend-run$(NC)"
	@echo "3. Open browser:   $(GREEN)http://localhost:$(FRONTEND_PORT)$(NC)"

##@ KIND Commands

.PHONY: kind-deploy
kind-deploy: ## Deploy KIND cluster using deploy/kind/config.yaml ##kind
	@echo "$(GREEN)Deploying KIND cluster...$(NC)"
	@if kind get clusters | grep -q "^kind$$"; then \
		echo "$(YELLOW)KIND cluster 'kind' already exists. Use 'make kind-cleanup' to remove it first.$(NC)"; \
		exit 1; \
	fi
	kind create cluster --config deploy/kind/config.yaml --name kind
	@echo "$(YELLOW)Applying Gateway APIs...$(NC)"
	kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.4.0/standard-install.yaml
	@echo "$(YELLOW) Installing cert-manager...$(NC)"
	helm install \
  		cert-manager oci://quay.io/jetstack/charts/cert-manager \
  		--version v1.19.0 \
  		--namespace cert-manager \
  		--create-namespace \
  		--values deploy/cert-manager/helm-values.yaml
	helm install \
	  ngninx-gateway-fabric oci://ghcr.io/nginx/charts/nginx-gateway-fabric \
	  --namespace nginx-gateway \
	  --create-namespace \
	  --values deploy/nginx-gateway-fabric/helm-values.yaml
	@echo "$(YELLOW)Deploying k8s.local certificate authority...$(NC)"
	helm install \
		k8s-local-ca deploy/charts/k8s-local-ca \
		--namespace cert-manager \
		--create-namespace
	@echo "$(YELLOW)Waiting for CA certificate to be ready...$(NC)"
	kubectl wait --for=condition=Ready --timeout=300s certificate/k8s-local-ca -n cert-manager
	@echo "$(YELLOW)Deploying Quizap application...$(NC)"
	helm install \
		quizap deploy/charts/quizap \
		--namespace quizap \
		--create-namespace
	@echo "$(GREEN)KIND cluster 'kind' with Quizap application deployed successfully!$(NC)"

.PHONY: kind-cleanup
kind-cleanup: ## Remove KIND cluster ##kind
	@echo "$(GREEN)Removing KIND cluster...$(NC)"
	@if ! kind get clusters | grep -q "^kind$$"; then \
		echo "$(YELLOW)KIND cluster 'kind' does not exist.$(NC)"; \
		exit 0; \
	fi
	kind delete cluster --name kind
	@echo "$(GREEN)KIND cluster 'kind' removed successfully!$(NC)"

.PHONY: kind-kubeconfig
kind-kubeconfig: ## Show KIND kubeconfig export command ##kind
	@echo "$(GREEN)To use KIND cluster with kubectl:$(NC)"
	@echo "$(YELLOW)kubectl cluster-info --context kind-kind$(NC)"

##@ CI/CD Commands

.PHONY: ci-backend
ci-backend: backend-install backend-test backend-build ## Run backend CI pipeline

.PHONY: ci-frontend
ci-frontend: frontend-install frontend-lint frontend-test frontend-build ## Run frontend CI pipeline

.PHONY: ci
ci: ci-backend ci-frontend ## Run full CI pipeline

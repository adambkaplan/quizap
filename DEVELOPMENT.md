# Development Guide

This guide helps contributors get started with the Quizap project quickly and efficiently.

## Quick Start

### Prerequisites

- **Go 1.21+** for backend development
- **Node.js 18+** and **npm** for frontend development
- **Make** (usually pre-installed on Linux/macOS)
- **Docker** or **Podman** for containerization
- **pack CLI** for building frontend containers with Cloud Native Buildpacks
- **ko CLI** for building backend containers

### Installing pack CLI

The project uses Cloud Native Buildpacks to build container images. Install the pack CLI:

#### Linux/macOS (using Homebrew)
```bash
brew install buildpacks/tap/pack
```

#### Linux (using package manager)
```bash
# Ubuntu/Debian
curl -sSL "https://github.com/buildpacks/pack/releases/latest/download/pack-v0.32.0-linux.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack

# Or download from GitHub releases
wget https://github.com/buildpacks/pack/releases/latest/download/pack-v0.32.0-linux.tgz
tar -xzf pack-v0.32.0-linux.tgz
sudo mv pack /usr/local/bin/
```

#### Windows
```powershell
# Using Chocolatey
choco install pack

# Or download from GitHub releases
# Download pack-v0.32.0-windows.zip from https://github.com/buildpacks/pack/releases
# Extract and add to PATH
```

#### Verify Installation
```bash
pack version
```

### Installing ko CLI

The project uses [ko](https://ko.build/) to build Go container images. Install the ko CLI:

#### Linux/macOS (using Homebrew)
```bash
brew install ko
```

#### Linux (using GitHub Releases)
```bash
# Set version and architecture
VERSION=0.15.0  # choose the latest version (without v prefix)
OS=Linux
ARCH=x86_64  # or arm64, i386, s390x

# Download and install
curl -sSfL "https://github.com/ko-build/ko/releases/download/v${VERSION}/ko_${VERSION}_${OS}_${ARCH}.tar.gz" > ko.tar.gz
tar xzf ko.tar.gz ko
chmod +x ./ko
sudo mv ko /usr/local/bin/
```

#### macOS (using GitHub Releases)
```bash
# Set version and architecture
VERSION=0.15.0  # choose the latest version (without v prefix)
OS=Darwin
ARCH=x86_64  # or arm64

# Download and install
curl -sSfL "https://github.com/ko-build/ko/releases/download/v${VERSION}/ko_${VERSION}_${OS}_${ARCH}.tar.gz" > ko.tar.gz
tar xzf ko.tar.gz ko
chmod +x ./ko
sudo mv ko /usr/local/bin/
```

#### Windows (using Scoop)
```powershell
scoop install ko
```

#### Build from Source (Go 1.16+)
```bash
go install github.com/google/ko@latest
```

#### Verify Installation
```bash
ko version
```

### First Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd quizap

# Complete setup (installs all dependencies)
make setup
```

### Development Workflow

The project consists of two services that need to run simultaneously:

#### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
make backend-run
```

**Terminal 2 - Frontend:**
```bash
make frontend-run
```

#### Option 2: Using the Makefile

```bash
# Get help and see all available commands
make help

# Check if services are running
make check-services

# Run tests
make test

# Build everything
make build
```

## Available Commands

### Backend Commands

| Command | Description |
|---------|-------------|
| `make backend-install` | Install Go dependencies |
| `make backend-build` | Build the backend binary |
| `make backend-run` | Start the backend server (port 8080) |
| `make backend-test` | Run backend tests |
| `make backend-test-coverage` | Run tests with coverage report |
| `make backend-clean` | Clean build artifacts |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `make frontend-install` | Install npm dependencies |
| `make frontend-run` | Start development server (port 3000) |
| `make frontend-build` | Build for production |
| `make frontend-test` | Run frontend tests |
| `make frontend-test-watch` | Run tests in watch mode |
| `make frontend-lint` | Run ESLint |
| `make frontend-format` | Format code with Prettier |
| `make frontend-clean` | Clean build artifacts |

### Container Commands

| Command | Description |
|---------|-------------|
| `make backend-build-container` | Build backend container with ko |
| `make backend-run-container` | Run backend in a container |
| `make stop-backend-container` | Stop backend container |
| `make frontend-build-container` | Build frontend container with pack CLI |
| `make frontend-run-container` | Run frontend in a container |
| `make stop-frontend-container` | Stop frontend container |
| `make build-containers` | Build both frontend and backend containers |
| `make run-containers` | Run both frontend and backend containers |
| `make stop-containers` | Stop both frontend and backend containers |

### Development Workflow

| Command | Description |
|---------|-------------|
| `make dev` | Show instructions for running both services |
| `make install` | Install all dependencies |
| `make test` | Run all tests |
| `make build` | Build both frontend and backend |
| `make clean` | Clean all build artifacts |

### Utility Commands

| Command | Description |
|---------|-------------|
| `make check-backend` | Check if backend is running |
| `make check-frontend` | Check if frontend is running |
| `make check-services` | Check both services |
| `make stop-backend` | Stop backend server |
| `make stop-frontend` | Stop frontend server |
| `make stop-all` | Stop all services |
| `make restart-backend` | Restart backend server |
| `make restart-frontend` | Restart frontend server |

## Project Structure

```
quizap/
├── backend/                 # Go backend service
│   ├── hello/              # Hello handler package
│   ├── middleware/         # CORS middleware
│   ├── main.go            # Backend entry point
│   └── go.mod             # Go module file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── Dashboard/ # Main dashboard component
│   │   │   └── config/    # API configuration
│   │   └── ...
│   └── package.json       # Frontend dependencies
├── .github/workflows/      # CI/CD workflows
├── Makefile               # Development commands
└── README.md              # Project overview
```

## Container Development

The project supports building and running both frontend and backend as containers using Cloud Native Buildpacks and ko respectively.

### Building the Backend Container

```bash
# Build the backend container using ko
make backend-build-container

# This command:
# - Uses the ko CLI to build a Go container image
# - Automatically detects the Go application in the backend directory
# - Creates an optimized production-ready container
# - Tags the image as ghcr.io/adambkaplan/quizap/backend:latest
```

### Running the Backend Container

```bash
# Run the backend in a container
make backend-run-container

# This command:
# - Runs the container on port 8080
# - Maps container port 8080 to host port 8080
# - Names the container 'quizap-backend'
```

### Building the Frontend Container

```bash
# Build the frontend container using pack CLI
make frontend-build-container

# This command:
# - Uses the pack CLI to build a container image
# - Automatically detects the Node.js application
# - Creates an optimized production-ready container
# - Tags the image as ghcr.io/adambkaplan/quizap/frontend:latest
```

### Running the Frontend Container

```bash
# Run the frontend in a container
make frontend-run-container

# This command:
# - Runs the container on port 9000
# - Maps container port 8080 to host port 9000
# - Names the container 'quizap-frontend'
```

### Container Management

```bash
# Stop individual containers
make stop-backend-container
make stop-frontend-container

# Stop all containers
make stop-containers

# Check if containers are running
podman ps | grep quizap
# or with docker
docker ps | grep quizap
```

### Container Configuration

The Makefile includes configuration options for different container environments:

- **Podman**: Default container engine.
- **Docker**: Set `CONTAINER_ENGINE=docker` when running make commands. Example:

```sh
make frontend-build-container CONTAINER_ENGINE=docker
```

Use the following procedure to push the images to your own container registry/repo:

1. Log into your container registry with your container engine of choice (podman or docker).
2. When invoking make commands, set the following make variables
   1. `IMAGE_REPO` - set to your repository. Example: `quay.io/adambkaplan/quizap`.
   2. `IMAGE_PUSH` - set to `true`
   3. `IMAGE_TAG` (optional) - set to any value you wish. Defaults to `latest`.

Example:

```sh
make frontend-build-container IMAGE_REPO=docker.io/myusername/myrepo IMAGE_TAG="v0.0.1" IMAGE_PUSH=true
```

### Container vs Development Mode

| Service | Mode | Command | Port | Use Case |
|---------|------|---------|------|----------|
| Backend | Development | `make backend-run` | 8080 | Hot reload, debugging |
| Backend | Container | `make backend-run-container` | 8080 | Production-like testing |
| Frontend | Development | `make frontend-run` | 9000 | Hot reload, debugging |
| Frontend | Container | `make frontend-run-container` | 9000 | Production-like testing |

## KIND Cluster Deployment

This section covers deploying quizap on a local Kubernetes cluster using KIND (Kubernetes in Docker). This approach provides a production-like environment for testing and development.

### Prerequisites for KIND Deployment

Before deploying to KIND, you need to install the following command-line tools:

#### Installing KIND

**Linux/macOS (using Homebrew):**
```bash
brew install kind
```

**Linux (using package manager):**
```bash
# Ubuntu/Debian
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Or download from GitHub releases
wget https://github.com/kubernetes-sigs/kind/releases/download/v0.20.0/kind-linux-amd64
chmod +x kind-linux-amd64
sudo mv kind-linux-amd64 /usr/local/bin/kind
```

**macOS (using GitHub Releases):**
```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-darwin-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

**Windows:**
```powershell
# Using Chocolatey
choco install kind

# Or download from GitHub releases
# Download kind-windows-amd64.exe from https://github.com/kubernetes-sigs/kind/releases
# Rename to kind.exe and add to PATH
```

#### Installing kubectl

**Linux/macOS (using Homebrew):**
```bash
brew install kubectl
```

**Linux:**
```bash
# Ubuntu/Debian
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Or using package manager
sudo apt-get update && sudo apt-get install -y kubectl
```

**macOS:**
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**Windows:**
```powershell
# Using Chocolatey
choco install kubernetes-cli

# Or download from GitHub releases
# Download kubectl.exe from https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
# Add to PATH
```

#### Installing Shipwright CLI (shp)

The Shipwright CLI (shp) is only available via GitHub releases. Download and install the appropriate binary for your platform:

**Linux:**
```bash
# Download the latest release
curl -sSL "https://github.com/shipwright-io/cli/releases/latest/download/shp-linux-amd64" -o shp
chmod +x shp
sudo mv shp /usr/local/bin/

# Verify installation
shp version
```

**macOS:**
```bash
# Download the latest release
curl -sSL "https://github.com/shipwright-io/cli/releases/latest/download/shp-darwin-amd64" -o shp
chmod +x shp
sudo mv shp /usr/local/bin/

# Verify installation
shp version
```

**Windows:**
```powershell
# Download from GitHub releases
# Visit https://github.com/shipwright-io/cli/releases/latest
# Download shp-windows-amd64.exe
# Rename to shp.exe and add to PATH

# Or using PowerShell
Invoke-WebRequest -Uri "https://github.com/shipwright-io/cli/releases/latest/download/shp-windows-amd64.exe" -OutFile "shp.exe"
# Move shp.exe to a directory in your PATH
```

#### Installing Helm

**Linux/macOS (using Homebrew):**
```bash
brew install helm
```

**Linux:**
```bash
# Download and install
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Or using package manager
# Ubuntu/Debian
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

**macOS:**
```bash
# Using curl
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Or using Homebrew
brew install helm
```

**Windows:**
```powershell
# Using Chocolatey
choco install kubernetes-helm

# Or download from GitHub releases
# Download helm-v3.x.x-windows-amd64.zip from https://github.com/helm/helm/releases
# Extract and add to PATH
```

#### Verify All Installations

```bash
kind version
kubectl version --client
shp version
helm version
```

### KIND Cluster Setup

#### 1. Configure Host for KIND

Before creating the KIND cluster, you need to configure your host system:

**Configure DNS Resolution:**

For Linux users, add the following entry to your `/etc/hosts` file:
```
127.0.0.1 registry.k8s.local
```

<!-- HELP WANTED: instructions for Docker on Windows + macOS -->

#### 2. Special Configuration for Podman and nerdctl Users

If you're using Podman or nerdctl as your container runtime, you need additional configuration for rootless mode. Please follow the comprehensive guidelines in the [KIND rootless documentation](https://kind.sigs.k8s.io/docs/user/rootless/) which covers:

- Host requirements (cgroup v2, systemd configuration)
- Provider-specific setup for Docker, Podman, and nerdctl
- Required system configurations and kernel parameters
- Troubleshooting common issues

The documentation provides detailed instructions for each container runtime and includes important system-level configurations that must be completed before creating a KIND cluster.

#### 3. Create KIND Cluster

```bash
# Create KIND cluster with the project configuration
make kind-setup
```

This command will:
- Create a KIND cluster using the configuration in `deploy/kind/config.yaml`
- Set up the necessary networking for the registry
- Configure the cluster for Harbor and Shipwright deployment

### Harbor Registry Setup

#### 1. Deploy Harbor

```bash
# Deploy Harbor registry to the KIND cluster
make kind-deploy-harbor
```

This command will:
- Install Harbor using Helm
- Configure Harbor with the necessary settings
- Set up the registry at `registry.k8s.local`

#### 2. Access Harbor Web UI

Once Harbor is deployed, you can access the web interface at:
- **URL**: https://registry.k8s.local
- **Username**: admin
- **Password**: Harbor12345 (default password)

#### 3. Create Project and Robot Account

1. **Log into Harbor Web UI** using the credentials above
2. **Create a new project**:
   - Go to "Projects" → "New Project"
   - Project name: `quizap`
   - Set as public or private as needed
3. **Create a Robot Account**:
   - Go to "Projects" → "quizap" → "Robot Accounts"
   - Click "New Robot Account", then follow the on screen instructions. Use the following:
     - Name: `quizap-robot`
     - Permissions: Grant all permissions
   - **Save the generated credentials** (username and token)

#### 4. Configure Kubernetes Secret

Create a docker-registry secret in the `quizap-dev` namespace:

```bash
# Create the namespace if it doesn't exist
kubectl create namespace quizap-dev

# Create the Harbor secret
kubectl create secret docker-registry harbor \
  --docker-server=harbor-core.harbor.svc.cluster.local \
  --docker-username=<ROBOT_ACCOUNT_USERNAME> \
  --docker-password=<ROBOT_ACCOUNT_TOKEN> \
  --namespace=quizap-dev
```

Replace `<ROBOT_ACCOUNT_USERNAME>` and `<ROBOT_ACCOUNT_TOKEN>` with the credentials from the Harbor robot account.

### Shipwright Setup

#### 1. Deploy Shipwright

```bash
# Deploy Shipwright to the KIND cluster
make kind-deploy-shipwright
```

This command will:
- Install Shipwright using the project's configuration
- Set up the necessary CRDs and controllers
- Configure Shipwright to work with the KIND cluster

#### 2. Verify Shipwright Installation

```bash
# Check if Shipwright is running
kubectl get pods -n shipwright-build

# Check Shipwright resources
kubectl get clusterbuildstrategies
```

### Build Quizap with Shipwright

#### 1. Apply Quizap Manifests

```bash
# Apply the quizap manifests to the cluster
kubectl apply -f shipwright/quizap/
```

This will create the necessary Build configurations for the frontend and backend applications.

#### 2. Run the Build

```bash
shp build run quizap-backend -n quizap-dev
shp build run quizap-frontend -n quizap-dev
```

#### 3. Monitor the Build

```bash
# Watch build progress
shp buildrun list -n quizap-dev

# Check build logs
shp buildrun logs <buildrun-name> -n quizap-dev

# List all resources
kubectl get all -n quizap-dev
```


### Cleanup

To clean up the KIND cluster and all resources:

```bash
# Delete the entire KIND cluster
make kind-cleanup

# This will remove:
# - The KIND cluster
# - All deployed applications (Harbor, Shipwright, Quizap)
# - All container images
# - All persistent volumes
```

## Development URLs

- **Frontend**: http://localhost:9000
- **Backend API**: http://localhost:8080
- **Backend Health Check**: http://localhost:8080/hello

## Testing

### Backend Tests
```bash
# Run all backend tests
make backend-test

# Run with coverage
make backend-test-coverage

# Run specific package tests
cd backend && go test -v ./hello
cd backend && go test -v ./middleware
```

### Frontend Tests
```bash
# Run all frontend tests
make frontend-test

# Run in watch mode
make frontend-test-watch

# Run with coverage
cd frontend && npm run test:coverage
```

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
make stop-backend
make backend-run
```

**Go module issues:**
```bash
cd backend
go mod tidy
go mod download
```

### Frontend Issues

**Port 3000 already in use:**
```bash
make stop-frontend
make frontend-run
```

**Node modules issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

The backend includes CORS middleware for development. If you encounter CORS errors:

1. Ensure backend is running: `make check-backend`
2. Ensure frontend is running: `make check-frontend`
3. Check browser developer tools for specific error messages

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Run tests**: `make test`
5. **Run linting**: `make lint`
6. **Commit your changes**: `git commit -m "Add your feature"`
7. **Push to your fork**: `git push origin feature/your-feature-name`
8. **Create a Pull Request**

## CI/CD

The project includes GitHub Actions workflows:

- **Frontend CI**: Runs on frontend changes
- **Backend CI**: Runs on backend changes

Both workflows run automatically on pull requests and pushes to main branch.

## Need Help?

- Check the `make help` command for all available options
- Review the test files for usage examples
- Check the GitHub Issues for known problems

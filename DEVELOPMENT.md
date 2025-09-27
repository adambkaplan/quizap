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

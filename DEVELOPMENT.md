# Development Guide

This guide helps contributors get started with the Quizap project quickly and efficiently.

## Quick Start

### Prerequisites

- **Go 1.21+** for backend development
- **Node.js 18+** and **npm** for frontend development
- **Make** (usually pre-installed on Linux/macOS)
- **Docker** or **Podman** for containerization
- **pack CLI** for building containers with Cloud Native Buildpacks

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
| `make frontend-build-container` | Build frontend container with pack CLI |
| `make frontend-run-container` | Run frontend in a container |
| `make stop-frontend-container` | Stop frontend container |

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

The project supports building and running the frontend as a container using Cloud Native Buildpacks.

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
# Stop the frontend container
make stop-frontend-container

# Check if container is running
docker ps | grep quizap-frontend
# or with podman
podman ps | grep quizap-frontend
```

### Container Configuration

The Makefile includes configuration options for different container environments:

- **Docker**: Default container engine
- **Podman**: Set `CONTAINER_ENGINE=podman` in Makefile
- **Rootless Podman**: Set `PACK_DOCKER_HOST=inherit` in Makefile

### Container vs Development Mode

| Mode | Command | Port | Use Case |
|------|---------|------|----------|
| Development | `make frontend-run` | 9000 | Hot reload, debugging |
| Container | `make frontend-run-container` | 9000 | Production-like testing |

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

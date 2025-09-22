# Quizap Backend

A simple Go microserver using the [Gin framework](https://github.com/gin-gonic/gin) for building REST APIs.

## Features

- High-performance HTTP web framework
- Simple JSON API endpoints
- Built with Go and Gin

## Getting Started

### Prerequisites

- Go 1.24 or later
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adambkaplan/quizap.git
cd quizap/backend
```

2. Install dependencies:
```bash
go mod download
```

3. Run the server:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### GET /hello

Returns a simple "Hello World" JSON response.

**Request:**
```bash
curl http://localhost:8080/hello
```

**Response:**
```json
{
  "message": "Hello World"
}
```

## Development

### Running the server

```bash
go run main.go
```

### Building the binary

```bash
go build -o quizap-backend main.go
```

### Running tests

```bash
go test ./...
```

## Dependencies

- [gin-gonic/gin](https://github.com/gin-gonic/gin) - HTTP web framework

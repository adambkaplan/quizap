// Copyright Adam B Kaplan
//
// SPDX-License-Identifier: MIT

package main

import (
	"github.com/gin-gonic/gin"

	"github.com/adambkaplan/quizap/backend/hello"
	"github.com/adambkaplan/quizap/backend/middleware"
)

func main() {
	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()

	// Add CORS middleware
	// TODO: Gate this behind a "dev mode" flag
	r.Use(middleware.InsecureCORSAllowAll)

	// Define a simple GET endpoint
	r.GET("/hello", hello.HelloHandler)

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run()
}

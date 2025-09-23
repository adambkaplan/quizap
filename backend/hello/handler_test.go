// Copyright Adam B Kaplan
//
// SPDX-License-Identifier: MIT

package hello

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHelloHandler(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.New()
	router.GET("/hello", HelloHandler)

	// Create a test request
	req, err := http.NewRequest("GET", "/hello", nil)
	assert.NoError(t, err)

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "application/json; charset=utf-8", w.Header().Get("Content-Type"))
	assert.JSONEq(t, `{"message": "Hello, World!"}`, w.Body.String())
}

func TestHelloHandler_ResponseFormat(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.New()
	router.GET("/hello", HelloHandler)

	// Create a test request
	req, err := http.NewRequest("GET", "/hello", nil)
	assert.NoError(t, err)

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert the response status
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert the response body contains the expected message
	assert.Contains(t, w.Body.String(), "Hello, World!")
	assert.Contains(t, w.Body.String(), "message")
}

func TestHelloHandler_MethodNotAllowed(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.New()
	router.GET("/hello", HelloHandler)

	// Test with POST method (should return 404 since only GET is defined)
	req, err := http.NewRequest("POST", "/hello", nil)
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Should return 404 for unsupported method
	assert.Equal(t, http.StatusNotFound, w.Code)
}

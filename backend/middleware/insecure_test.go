// Copyright Adam B Kaplan
//
// SPDX-License-Identifier: MIT

package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestInsecureCORSAllowAll(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		method         string
		origin         string
		expectedStatus int
		expectHeaders  map[string]string
	}{
		{
			name:           "GET request with origin",
			method:         "GET",
			origin:         "http://localhost:3000",
			expectedStatus: http.StatusOK,
			expectHeaders: map[string]string{
				"Access-Control-Allow-Origin":      "*",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods":     "POST, OPTIONS, GET, PUT, DELETE",
				"Access-Control-Max-Age":           "86400",
			},
		},
		{
			name:           "POST request with origin",
			method:         "POST",
			origin:         "https://example.com",
			expectedStatus: http.StatusOK,
			expectHeaders: map[string]string{
				"Access-Control-Allow-Origin":      "*",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods":     "POST, OPTIONS, GET, PUT, DELETE",
				"Access-Control-Max-Age":           "86400",
			},
		},
		{
			name:           "OPTIONS preflight request",
			method:         "OPTIONS",
			origin:         "http://localhost:3000",
			expectedStatus: http.StatusNoContent,
			expectHeaders: map[string]string{
				"Access-Control-Allow-Origin":      "*",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods":     "POST, OPTIONS, GET, PUT, DELETE",
				"Access-Control-Max-Age":           "86400",
			},
		},
		{
			name:           "Request without origin",
			method:         "GET",
			origin:         "",
			expectedStatus: http.StatusOK,
			expectHeaders: map[string]string{
				"Access-Control-Allow-Origin":      "*",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods":     "POST, OPTIONS, GET, PUT, DELETE",
				"Access-Control-Max-Age":           "86400",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a new Gin router
			router := gin.New()

			// Add the middleware
			router.Use(InsecureCORSAllowAll)

			// Add a test route
			router.GET("/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "test"})
			})
			router.POST("/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "test"})
			})
			router.OPTIONS("/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "test"})
			})

			// Create a test request
			req, err := http.NewRequest(tt.method, "/test", nil)
			assert.NoError(t, err)

			if tt.origin != "" {
				req.Header.Set("Origin", tt.origin)
			}

			// Create a response recorder
			w := httptest.NewRecorder()

			// Perform the request
			router.ServeHTTP(w, req)

			// Assert the response status
			assert.Equal(t, tt.expectedStatus, w.Code)

			// Assert the CORS headers
			for header, expectedValue := range tt.expectHeaders {
				actualValue := w.Header().Get(header)
				assert.Equal(t, expectedValue, actualValue, "Header %s should match", header)
			}

			// Assert the Access-Control-Allow-Headers header contains expected headers
			allowHeaders := w.Header().Get("Access-Control-Allow-Headers")
			expectedHeaders := []string{
				"Content-Type",
				"Content-Length",
				"Accept-Encoding",
				"X-CSRF-Token",
				"Authorization",
				"accept",
				"origin",
				"Cache-Control",
				"X-Requested-With",
			}

			for _, expectedHeader := range expectedHeaders {
				assert.Contains(t, allowHeaders, expectedHeader, "Access-Control-Allow-Headers should contain %s", expectedHeader)
			}
		})
	}
}

func TestInsecureCORSAllowAll_OPTIONSAborts(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.New()

	// Add the middleware
	router.Use(InsecureCORSAllowAll)

	// Add a test route that should not be called for OPTIONS
	router.OPTIONS("/test", func(c *gin.Context) {
		t.Error("OPTIONS handler should not be called when middleware aborts")
		c.JSON(http.StatusOK, gin.H{"message": "should not reach here"})
	})

	// Create an OPTIONS request
	req, err := http.NewRequest("OPTIONS", "/test", nil)
	assert.NoError(t, err)
	req.Header.Set("Origin", "http://localhost:3000")

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert the response status is 204 (No Content)
	assert.Equal(t, http.StatusNoContent, w.Code)

	// Assert the response body is empty
	assert.Empty(t, w.Body.String())
}

func TestInsecureCORSAllowAll_RegularRequestContinues(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a new Gin router
	router := gin.New()

	// Add the middleware
	router.Use(InsecureCORSAllowAll)

	// Add a test route that should be called for regular requests
	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Create a GET request
	req, err := http.NewRequest("GET", "/test", nil)
	assert.NoError(t, err)
	req.Header.Set("Origin", "http://localhost:3000")

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert the response status
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert the response body
	assert.JSONEq(t, `{"message":"success"}`, w.Body.String())

	// Assert CORS headers are still present
	assert.Equal(t, "*", w.Header().Get("Access-Control-Allow-Origin"))
	assert.Equal(t, "true", w.Header().Get("Access-Control-Allow-Credentials"))
}

func TestInsecureCORSAllowAll_AllMethods(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	methods := []string{"GET", "POST", "PUT", "DELETE", "PATCH"}

	for _, method := range methods {
		t.Run("Method_"+method, func(t *testing.T) {
			// Create a new Gin router
			router := gin.New()

			// Add the middleware
			router.Use(InsecureCORSAllowAll)

			// Add a test route for the method
			router.Handle(method, "/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"method": method})
			})

			// Create a request
			req, err := http.NewRequest(method, "/test", nil)
			assert.NoError(t, err)
			req.Header.Set("Origin", "http://localhost:3000")

			// Create a response recorder
			w := httptest.NewRecorder()

			// Perform the request
			router.ServeHTTP(w, req)

			// Assert the response status
			assert.Equal(t, http.StatusOK, w.Code)

			// Assert CORS headers are present
			assert.Equal(t, "*", w.Header().Get("Access-Control-Allow-Origin"))
			assert.Equal(t, "true", w.Header().Get("Access-Control-Allow-Credentials"))
			assert.Equal(t, "POST, OPTIONS, GET, PUT, DELETE", w.Header().Get("Access-Control-Allow-Methods"))
			assert.Equal(t, "86400", w.Header().Get("Access-Control-Max-Age"))
		})
	}
}

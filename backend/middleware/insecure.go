// Copyright Adam B Kaplan
//
// SPDX-License-Identifier: MIT

package middleware

import "github.com/gin-gonic/gin"

// InsecureCORSAllowAll allows all origins for development. This is not suitable for production environments.
func InsecureCORSAllowAll(c *gin.Context) {
	// Allow all origins for development (change this for production)
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
	c.Header("Access-Control-Max-Age", "86400") // 24 hours

	// Handle preflight requests
	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}

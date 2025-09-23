package hello

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HelloHandler is a handler for the GET /hello endpoint
func HelloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, World!",
	})
}

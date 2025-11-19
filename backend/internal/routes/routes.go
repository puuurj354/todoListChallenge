package routes

import (
	"todoListChallenge/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up all routes for the application
func SetupRoutes(router *gin.Engine, todoHandler *handlers.TodoHandler, categoryHandler *handlers.CategoryHandler) {
	// API group
	api := router.Group("/api")
	{
		// Todo routes
		todos := api.Group("/todos")
		{
			todos.GET("", todoHandler.GetTodos)           // GET /api/todos - List todos with pagination and filters
			todos.POST("", todoHandler.CreateTodo)        // POST /api/todos - Create new todo
			todos.GET("/:id", todoHandler.GetTodo)        // GET /api/todos/:id - Get specific todo
			todos.PUT("/:id", todoHandler.UpdateTodo)     // PUT /api/todos/:id - Update todo
			todos.DELETE("/:id", todoHandler.DeleteTodo)  // DELETE /api/todos/:id - Delete todo
			todos.PATCH("/:id/complete", todoHandler.ToggleComplete) // PATCH /api/todos/:id/complete - Toggle completion status
		}

		// Category routes
		categories := api.Group("/categories")
		{
			categories.GET("", categoryHandler.GetCategories)        // GET /api/categories - List all categories
			categories.POST("", categoryHandler.CreateCategory)      // POST /api/categories - Create new category
			categories.GET("/:id", categoryHandler.GetCategory)      // GET /api/categories/:id - Get specific category
			categories.PUT("/:id", categoryHandler.UpdateCategory)   // PUT /api/categories/:id - Update category
			categories.DELETE("/:id", categoryHandler.DeleteCategory) // DELETE /api/categories/:id - Delete category
		}
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Server is running"})
	})
}

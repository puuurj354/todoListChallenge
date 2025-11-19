package main

import (
	"log"
	"os"
	"todoListChallenge/internal/db"
	"todoListChallenge/internal/handlers"
	"todoListChallenge/internal/repository"
	"todoListChallenge/internal/routes"
	"todoListChallenge/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default environment variables")
	}

	// Initialize database connection
	db.InitDB()
	log.Println("Database connected successfully!")

	// Initialize repositories
	todoRepo := repository.NewTodoRepository(db.DB)
	categoryRepo := repository.NewCategoryRepository(db.DB)

	// Initialize services
	todoService := services.NewTodoService(todoRepo)
	categoryService := services.NewCategoryService(categoryRepo)

	// Initialize handlers
	todoHandler := handlers.NewTodoHandler(todoService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)

	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000"} // React dev server
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// Setup routes
	routes.SetupRoutes(router, todoHandler, categoryHandler)

	// Get port from environment or use default
	port := getEnv("PORT", "8080")
	
	log.Printf("Server is running on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
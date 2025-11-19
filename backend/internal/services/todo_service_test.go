package services

import (
	"testing"
	"todoListChallenge/internal/models"
	"todoListChallenge/internal/repository"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.Todo{}, &models.Category{})
	return db
}

func TestTodoService_CreateTodo(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	t.Run("success", func(t *testing.T) {
		todo := &models.Todo{Title: "Test Todo", Completed: false}

		err := service.CreateTodo(todo)

		assert.NoError(t, err)
		assert.NotZero(t, todo.ID)
	})

	t.Run("validation error - empty title", func(t *testing.T) {
		todo := &models.Todo{Title: "", Completed: false}

		err := service.CreateTodo(todo)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "title is required")
	})

	t.Run("validation error - title too long", func(t *testing.T) {
		todo := &models.Todo{Title: string(make([]byte, 256)), Completed: false}

		err := service.CreateTodo(todo)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "title must be less than 255 characters")
	})

	t.Run("validation error - invalid priority", func(t *testing.T) {
		todo := &models.Todo{Title: "Test", Priority: "invalid"}

		err := service.CreateTodo(todo)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "invalid priority value")
	})
}

func TestTodoService_GetTodoByID(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	// Create a todo first
	todo := &models.Todo{Title: "Test Todo"}
	service.CreateTodo(todo)

	t.Run("success", func(t *testing.T) {
		found, err := service.GetTodoByID(todo.ID)

		assert.NoError(t, err)
		assert.Equal(t, todo.ID, found.ID)
		assert.Equal(t, "Test Todo", found.Title)
	})

	t.Run("not found", func(t *testing.T) {
		found, err := service.GetTodoByID(999)

		assert.Error(t, err)
		assert.Nil(t, found)
	})
}

func TestTodoService_GetTodos(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	// Create some todos
	service.CreateTodo(&models.Todo{Title: "First Todo"})
	service.CreateTodo(&models.Todo{Title: "Second Todo"})

	t.Run("success with defaults", func(t *testing.T) {
		todos, total, err := service.GetTodos(1, 10, "", "created_at", "desc")

		assert.NoError(t, err)
		assert.Equal(t, int64(2), total)
		assert.Len(t, todos, 2)
	})

	t.Run("with search", func(t *testing.T) {
		todos, total, err := service.GetTodos(1, 10, "First", "created_at", "desc")

		assert.NoError(t, err)
		assert.Equal(t, int64(1), total)
		assert.Len(t, todos, 1)
		assert.Equal(t, "First Todo", todos[0].Title)
	})
}

func TestTodoService_UpdateTodo(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	// Create a todo first
	todo := &models.Todo{Title: "Original Todo"}
	service.CreateTodo(todo)

	t.Run("success", func(t *testing.T) {
		todo.Title = "Updated Todo"
		err := service.UpdateTodo(todo)

		assert.NoError(t, err)

		// Verify update
		updated, _ := service.GetTodoByID(todo.ID)
		assert.Equal(t, "Updated Todo", updated.Title)
	})

	t.Run("validation error", func(t *testing.T) {
		todo.Title = ""
		err := service.UpdateTodo(todo)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "title is required")
	})
}

func TestTodoService_DeleteTodo(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	// Create a todo first
	todo := &models.Todo{Title: "Test Todo"}
	service.CreateTodo(todo)

	t.Run("success", func(t *testing.T) {
		err := service.DeleteTodo(todo.ID)

		assert.NoError(t, err)

		// Verify deletion
		found, err := service.GetTodoByID(todo.ID)
		assert.Error(t, err)
		assert.Nil(t, found)
	})
}

func TestTodoService_ToggleComplete(t *testing.T) {
	db := setupTestDB()
	repo := repository.NewTodoRepository(db)
	service := NewTodoService(repo)

	// Create a todo first
	todo := &models.Todo{Title: "Test Todo", Completed: false}
	service.CreateTodo(todo)

	t.Run("success", func(t *testing.T) {
		err := service.ToggleComplete(todo.ID)

		assert.NoError(t, err)

		// Verify toggle
		updated, _ := service.GetTodoByID(todo.ID)
		assert.True(t, updated.Completed)
	})
}
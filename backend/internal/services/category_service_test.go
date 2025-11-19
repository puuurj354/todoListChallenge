package services

import (
	"testing"
	"todoListChallenge/internal/models"
	"todoListChallenge/internal/repository"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupCategoryTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.Category{})
	return db
}

func TestCategoryService_CreateCategory(t *testing.T) {
	db := setupCategoryTestDB()
	repo := repository.NewCategoryRepository(db)
	service := NewCategoryService(repo)

	t.Run("success", func(t *testing.T) {
		category := &models.Category{Name: "Work", Color: "#3B82F6"}

		err := service.CreateCategory(category)

		assert.NoError(t, err)
		assert.NotZero(t, category.ID)
	})

	t.Run("validation error - empty name", func(t *testing.T) {
		category := &models.Category{Name: "", Color: "#3B82F6"}

		err := service.CreateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "name is required")
	})

	t.Run("validation error - name too long", func(t *testing.T) {
		category := &models.Category{Name: string(make([]byte, 256)), Color: "#3B82F6"}

		err := service.CreateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "name must be less than 255 characters")
	})

	t.Run("validation error - invalid color format", func(t *testing.T) {
		category := &models.Category{Name: "Work", Color: "invalid"}

		err := service.CreateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "color must be a valid hex color")
	})

	t.Run("validation error - color without hash", func(t *testing.T) {
		category := &models.Category{Name: "Work", Color: "3B82F6"}

		err := service.CreateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "color must be a valid hex color")
	})

	t.Run("validation error - color too short", func(t *testing.T) {
		category := &models.Category{Name: "Work", Color: "#3B82"}

		err := service.CreateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "color must be a valid hex color")
	})
}

func TestCategoryService_GetCategories(t *testing.T) {
	db := setupCategoryTestDB()
	repo := repository.NewCategoryRepository(db)
	service := NewCategoryService(repo)

	// Create some categories
	service.CreateCategory(&models.Category{Name: "Work", Color: "#3B82F6"})
	service.CreateCategory(&models.Category{Name: "Personal", Color: "#10B981"})

	t.Run("success", func(t *testing.T) {
		categories, err := service.GetCategories()

		assert.NoError(t, err)
		assert.Len(t, categories, 2)
	})
}

func TestCategoryService_GetCategoryByID(t *testing.T) {
	db := setupCategoryTestDB()
	repo := repository.NewCategoryRepository(db)
	service := NewCategoryService(repo)

	// Create a category first
	category := &models.Category{Name: "Work", Color: "#3B82F6"}
	service.CreateCategory(category)

	t.Run("success", func(t *testing.T) {
		found, err := service.GetCategoryByID(category.ID)

		assert.NoError(t, err)
		assert.Equal(t, category.ID, found.ID)
		assert.Equal(t, "Work", found.Name)
	})

	t.Run("not found", func(t *testing.T) {
		found, err := service.GetCategoryByID(999)

		assert.Error(t, err)
		assert.Nil(t, found)
	})
}

func TestCategoryService_UpdateCategory(t *testing.T) {
	db := setupCategoryTestDB()
	repo := repository.NewCategoryRepository(db)
	service := NewCategoryService(repo)

	// Create a category first
	category := &models.Category{Name: "Work", Color: "#3B82F6"}
	service.CreateCategory(category)

	t.Run("success", func(t *testing.T) {
		category.Name = "Work Updated"
		category.Color = "#EF4444"
		err := service.UpdateCategory(category)

		assert.NoError(t, err)

		// Verify update
		updated, _ := service.GetCategoryByID(category.ID)
		assert.Equal(t, "Work Updated", updated.Name)
		assert.Equal(t, "#EF4444", updated.Color)
	})

	t.Run("validation error", func(t *testing.T) {
		category.Name = ""
		err := service.UpdateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "name is required")
	})

	t.Run("validation error - invalid color", func(t *testing.T) {
		category.Name = "Work"
		category.Color = "invalid"
		err := service.UpdateCategory(category)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "color must be a valid hex color")
	})
}

func TestCategoryService_DeleteCategory(t *testing.T) {
	db := setupCategoryTestDB()
	repo := repository.NewCategoryRepository(db)
	service := NewCategoryService(repo)

	// Create a category first
	category := &models.Category{Name: "Work", Color: "#3B82F6"}
	service.CreateCategory(category)

	t.Run("success", func(t *testing.T) {
		err := service.DeleteCategory(category.ID)

		assert.NoError(t, err)

		// Verify deletion
		found, err := service.GetCategoryByID(category.ID)
		assert.Error(t, err)
		assert.Nil(t, found)
	})
}

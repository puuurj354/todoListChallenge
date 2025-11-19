package repository

import (
	"todoListChallenge/internal/models"

	"gorm.io/gorm"
)

// TodoRepository handles database operations for Todo
type TodoRepository struct {
	db *gorm.DB
}

// NewTodoRepository creates a new TodoRepository
func NewTodoRepository(db *gorm.DB) *TodoRepository {
	return &TodoRepository{db: db}
}

// Create creates a new todo
func (r *TodoRepository) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

// GetByID gets a todo by ID with category
func (r *TodoRepository) GetByID(id uint) (*models.Todo, error) {
	var todo models.Todo
	err := r.db.Preload("Category").First(&todo, id).Error
	return &todo, err
}

// GetAll gets todos with pagination and filters
func (r *TodoRepository) GetAll(page, limit int, search, sortBy, sortOrder string, filters map[string]interface{}) ([]models.Todo, int64, error) {
	var todos []models.Todo
	var total int64

	query := r.db.Model(&models.Todo{}).Preload("Category")

	// Search filter
	if search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Filter by completion status
	if completed, ok := filters["completed"].(bool); ok {
		query = query.Where("completed = ?", completed)
	}

	// Filter by category ID
	if categoryID, ok := filters["category_id"].(uint); ok {
		query = query.Where("category_id = ?", categoryID)
	}

	// Filter by priority
	if priority, ok := filters["priority"].(string); ok && priority != "" {
		query = query.Where("priority = ?", priority)
	}

	// Count total
	query.Count(&total)

	// Sorting
	if sortBy != "" {
		order := sortBy + " " + sortOrder
		query = query.Order(order)
	}

	// Pagination
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Find(&todos).Error

	return todos, total, err
}

// Update updates a todo
func (r *TodoRepository) Update(todo *models.Todo) error {
	return r.db.Save(todo).Error
}

// Delete deletes a todo
func (r *TodoRepository) Delete(id uint) error {
	return r.db.Delete(&models.Todo{}, id).Error
}

// ToggleComplete toggles the completion status
func (r *TodoRepository) ToggleComplete(id uint) error {
	return r.db.Model(&models.Todo{}).Where("id = ?", id).Update("completed", gorm.Expr("NOT completed")).Error
}
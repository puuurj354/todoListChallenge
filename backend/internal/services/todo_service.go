package services

import (
	"errors"
	"strings"
	"todoListChallenge/internal/models"
	"todoListChallenge/internal/repository"
)

// TodoService handles business logic for Todo
type TodoService struct {
	repo *repository.TodoRepository
}

// NewTodoService creates a new TodoService
func NewTodoService(repo *repository.TodoRepository) *TodoService {
	return &TodoService{repo: repo}
}

// CreateTodo creates a new todo with validation
func (s *TodoService) CreateTodo(todo *models.Todo) error {
	if err := s.validateTodo(todo); err != nil {
		return err
	}
	return s.repo.Create(todo)
}

// GetTodoByID gets a todo by ID
func (s *TodoService) GetTodoByID(id uint) (*models.Todo, error) {
	return s.repo.GetByID(id)
}

// GetTodos gets todos with pagination and filters
func (s *TodoService) GetTodos(page, limit int, search, sortBy, sortOrder string, filters map[string]interface{}) ([]models.Todo, int64, error) {
	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Validate sort
	validSortFields := map[string]bool{"title": true, "created_at": true, "updated_at": true, "due_date": true, "priority": true}
	if sortBy != "" && !validSortFields[sortBy] {
		sortBy = "created_at"
	}
	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "desc"
	}

	// Validate priority filter
	if priority, ok := filters["priority"].(string); ok && priority != "" {
		if priority != string(models.PriorityHigh) && priority != string(models.PriorityMedium) && priority != string(models.PriorityLow) {
			delete(filters, "priority") // Remove invalid priority filter
		}
	}

	return s.repo.GetAll(page, limit, search, sortBy, sortOrder, filters)
}

// UpdateTodo updates a todo with validation
func (s *TodoService) UpdateTodo(todo *models.Todo) error {
	if err := s.validateTodo(todo); err != nil {
		return err
	}
	return s.repo.Update(todo)
}

// DeleteTodo deletes a todo
func (s *TodoService) DeleteTodo(id uint) error {
	return s.repo.Delete(id)
}

// ToggleComplete toggles completion status
func (s *TodoService) ToggleComplete(id uint) error {
	return s.repo.ToggleComplete(id)
}

// validateTodo validates todo fields
func (s *TodoService) validateTodo(todo *models.Todo) error {
	if strings.TrimSpace(todo.Title) == "" {
		return errors.New("title is required")
	}
	if len(todo.Title) > 255 {
		return errors.New("title must be less than 255 characters")
	}
	if todo.Priority != "" && todo.Priority != models.PriorityHigh && todo.Priority != models.PriorityMedium && todo.Priority != models.PriorityLow {
		return errors.New("invalid priority value")
	}
	return nil
}
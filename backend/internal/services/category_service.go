package services

import (
	"errors"
	"regexp"
	"strings"
	"todoListChallenge/internal/models"
	"todoListChallenge/internal/repository"
)

// CategoryService handles business logic for Category
type CategoryService struct {
	repo *repository.CategoryRepository
}

// NewCategoryService creates a new CategoryService
func NewCategoryService(repo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

// CreateCategory creates a new category with validation
func (s *CategoryService) CreateCategory(category *models.Category) error {
	if err := s.validateCategory(category); err != nil {
		return err
	}
	return s.repo.Create(category)
}

// GetCategories gets all categories
func (s *CategoryService) GetCategories() ([]models.Category, error) {
	return s.repo.GetAll()
}

// GetCategoryByID gets a category by ID
func (s *CategoryService) GetCategoryByID(id uint) (*models.Category, error) {
	return s.repo.GetByID(id)
}

// UpdateCategory updates a category with validation
func (s *CategoryService) UpdateCategory(category *models.Category) error {
	if err := s.validateCategory(category); err != nil {
		return err
	}
	return s.repo.Update(category)
}

// DeleteCategory deletes a category
func (s *CategoryService) DeleteCategory(id uint) error {
	return s.repo.Delete(id)
}

// validateCategory validates category fields
func (s *CategoryService) validateCategory(category *models.Category) error {
	if strings.TrimSpace(category.Name) == "" {
		return errors.New("name is required")
	}
	if len(category.Name) > 255 {
		return errors.New("name must be less than 255 characters")
	}

	// Validate hex color format
	colorRegex := regexp.MustCompile(`^#[0-9A-Fa-f]{6}$`)
	if !colorRegex.MatchString(category.Color) {
		return errors.New("color must be a valid hex color (e.g., #3B82F6)")
	}

	return nil
}
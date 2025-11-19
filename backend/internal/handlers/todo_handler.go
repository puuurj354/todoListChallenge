package handlers

import (
	"net/http"
	"strconv"
	"todoListChallenge/internal/models"
	"todoListChallenge/internal/services"

	"github.com/gin-gonic/gin"
)

// TodoHandler handles HTTP requests for Todo
type TodoHandler struct {
	service *services.TodoService
}

// NewTodoHandler creates a new TodoHandler
func NewTodoHandler(service *services.TodoService) *TodoHandler {
	return &TodoHandler{service: service}
}

// CreateTodo handles POST /todos
func (h *TodoHandler) CreateTodo(c *gin.Context) {
	var todo models.Todo
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateTodo(&todo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, todo)
}

// GetTodos handles GET /todos
func (h *TodoHandler) GetTodos(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortOrder := c.DefaultQuery("sort_order", "desc")

	// Build filters from query parameters
	filters := make(map[string]interface{})

	// Filter by completion status
	if completedStr := c.Query("completed"); completedStr != "" {
		completed, err := strconv.ParseBool(completedStr)
		if err == nil {
			filters["completed"] = completed
		}
	}

	// Filter by category ID
	if categoryIDStr := c.Query("category_id"); categoryIDStr != "" {
		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
		if err == nil {
			filters["category_id"] = uint(categoryID)
		}
	}

	// Filter by priority
	if priority := c.Query("priority"); priority != "" {
		filters["priority"] = priority
	}

	todos, total, err := h.service.GetTodos(page, limit, search, sortBy, sortOrder, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (int(total) + limit - 1) / limit
	pagination := gin.H{
		"current_page": page,
		"per_page":     limit,
		"total":        total,
		"total_pages":  totalPages,
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       todos,
		"pagination": pagination,
	})
}

// GetTodo handles GET /todos/:id
func (h *TodoHandler) GetTodo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	todo, err := h.service.GetTodoByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// UpdateTodo handles PUT /todos/:id
func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var todo models.Todo
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	todo.ID = uint(id)

	if err := h.service.UpdateTodo(&todo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// DeleteTodo handles DELETE /todos/:id
func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.DeleteTodo(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// ToggleComplete handles PATCH /todos/:id/complete
func (h *TodoHandler) ToggleComplete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.ToggleComplete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	todo, err := h.service.GetTodoByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve updated todo"})
		return
	}

	c.JSON(http.StatusOK, todo)
}
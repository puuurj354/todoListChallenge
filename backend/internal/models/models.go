package models

import (
	"time"
)


type Priority string

const (
	PriorityHigh   Priority = "high"
	PriorityMedium Priority = "medium"
	PriorityLow    Priority = "low"
)

// Todo represents a todo item
type Todo struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed" gorm:"default:false"`
	CategoryID  *uint     `json:"category_id" gorm:"index"`
	Priority    Priority  `json:"priority" gorm:"type:varchar(10);default:'medium'"`
	DueDate     *time.Time `json:"due_date" gorm:"type:timestamp"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`


	Category *Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

// Todo, Category represents a category for todos
type Category struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"not null;unique"`
	Color     string    `json:"color" gorm:"not null;type:varchar(7)"` // Hex color like #3B82F6
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`


	Todos []Todo `json:"todos,omitempty" gorm:"foreignKey:CategoryID"`
}
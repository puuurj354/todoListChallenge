package db

import (
	"log"

	"todolistChallenge/internal/models"

	"gorm.io/gorm"
)

// AutoMigrate runs automatic migrations for internal models.
func AutoMigrate(db *gorm.DB) error {
	if db == nil {
		return nil
	}
	err := db.AutoMigrate(&models.Todo{})
	if err != nil {
		log.Printf("AutoMigrate failed: %v\n", err)
		return err
	}
	return nil
}

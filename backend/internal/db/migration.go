package db

import (
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/gorm"
)


func RunMigrations(db *gorm.DB) error {

	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get SQL DB from GORM: %w", err)
	}

	driver, err := postgres.WithInstance(sqlDB, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create postgres driver: %w", err)
	}

	
	m, err := migrate.NewWithDatabaseInstance(
		"file://internal/db/migrations", 
		"postgres", driver)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}


	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("All migrations completed successfully")
	return nil
}

// rollbackMigrations 
func RollbackMigrations(db *gorm.DB, steps int) error {
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get SQL DB from GORM: %w", err)
	}

	driver, err := postgres.WithInstance(sqlDB, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create postgres driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://internal/db/migrations",
		"postgres", driver)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}

	if err := m.Steps(-steps); err != nil {
		return fmt.Errorf("failed to rollback migrations: %w", err)
	}

	log.Printf("Rolled back %d migration steps", steps)
	return nil
}
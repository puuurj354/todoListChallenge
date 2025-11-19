package db

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"gorm.io/gorm"
)

// RunMigrations executes all up migration files in order
func RunMigrations(db *gorm.DB) error {
	migrationDir := "internal/db/migrations"

	files, err := filepath.Glob(filepath.Join(migrationDir, "*.up.sql"))
	if err != nil {
		return fmt.Errorf("failed to find migration files: %w", err)
	}

	sort.Strings(files) 

	for _, file := range files {
		log.Printf("Running migration: %s", file)

		sql, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}

	
		statements := strings.Split(string(sql), ";")
		for _, stmt := range statements {
			stmt = strings.TrimSpace(stmt)
			if stmt == "" {
				continue
			}

			if err := db.Exec(stmt).Error; err != nil {
				return fmt.Errorf("failed to execute migration statement in %s: %w", file, err)
			}
		}
	}

	log.Println("All migrations completed successfully")
	return nil
}
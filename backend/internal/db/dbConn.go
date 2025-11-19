package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect returns a gorm DB pointer using environment configuration.
// It loads `.env` in development if present.
func Connect() (*gorm.DB, error) {
	// Load .env file if present
	_ = godotenv.Load()

	host := getenvDefault("DB_HOST", "localhost")
	port := getenvDefault("DB_PORT", "5432")
	user := getenvDefault("DB_USER", "postgres")
	password := getenvDefault("DB_PASSWORD", "postgres")
	dbname := getenvDefault("DB_NAME", "todolistChallenge")
	sslmode := getenvDefault("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		host, user, password, dbname, port, sslmode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to DB: %v\n", err)
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	// Set some reasonable connection pool defaults
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(50)

	return db, nil
}

// getenvDefault returns env var value or a default if empty
func getenvDefault(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

package main

import (
	"fmt"
	"todoListChallenge/internal/db"
)

func main() {
	db.InitDB()
	fmt.Println("Database connected successfully!")
}
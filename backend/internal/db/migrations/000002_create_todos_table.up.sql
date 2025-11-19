-- Create todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category_id for better query performance
CREATE INDEX idx_todos_category_id ON todos(category_id);

-- Create index on title for search functionality
CREATE INDEX idx_todos_title ON todos(title);

-- Create index on created_at for sorting
CREATE INDEX idx_todos_created_at ON todos(created_at);
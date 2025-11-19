
-- Drop indexes
DROP INDEX IF EXISTS idx_todos_created_at;
DROP INDEX IF EXISTS idx_todos_title;
DROP INDEX IF EXISTS idx_todos_category_id;

-- Drop tables
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS categories;
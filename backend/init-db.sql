-- Initialize database (optional, PostgreSQL will create DB from env vars)
-- This file runs on container first start

-- Create default categories
INSERT INTO categories (name, color, created_at, updated_at) VALUES
  ('Work', '#3B82F6', NOW(), NOW()),
  ('Personal', '#10B981', NOW(), NOW()),
  ('Shopping', '#F59E0B', NOW(), NOW()),
  ('Health', '#EF4444', NOW(), NOW()),
  ('Learning', '#8B5CF6', NOW(), NOW())
ON CONFLICT DO NOTHING;

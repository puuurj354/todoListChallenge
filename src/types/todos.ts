export type Priority = "high" | "medium" | "low"

export interface Category {
  id: number
  name: string
  color: string
  created_at: string
}

export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  category_id?: number
  priority: Priority
  due_date?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface TodoInput {
  title: string
  description: string
  completed: boolean
  category_id?: number
  priority: Priority
  due_date?: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total: number
  total_pages: number
}

export interface TodosResponse {
  data: Todo[]
  pagination: PaginationInfo
}

export interface TodoStatistics {
  total: number
  active: number
  completed: number
  progress: number
}

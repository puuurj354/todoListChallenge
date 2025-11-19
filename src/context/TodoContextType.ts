import { createContext } from "react"
import type { Todo, TodoInput, Category, TodoStatistics } from "../types/todos"

export interface TodoContextType {
  todos: Todo[]
  categories: Category[]
  loading: boolean
  statistics: TodoStatistics
  currentPage: number
  pageSize: number
  total: number
  searchQuery: string
  filterCompleted: boolean | undefined
  filterCategoryId: number | undefined
  filterPriority: string | undefined
  fetchTodos: () => Promise<void>
  fetchCategories: () => Promise<void>
  createTodo: (todo: TodoInput) => Promise<void>
  updateTodo: (id: number, todo: TodoInput) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  toggleComplete: (id: number) => Promise<void>
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setSearchQuery: (query: string) => void
  setFilterCompleted: (completed: boolean | undefined) => void
  setFilterCategoryId: (categoryId: number | undefined) => void
  setFilterPriority: (priority: string | undefined) => void
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined)

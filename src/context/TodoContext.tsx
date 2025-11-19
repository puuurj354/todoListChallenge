import { useState, useEffect, useCallback, type ReactNode } from "react"
import { message } from "antd"
import { todoApi, categoryApi } from "../services/api"
import type { Todo, TodoInput, Category, TodoStatistics } from "../types/todos"
import { TodoContext, type TodoContextType } from "./TodoContextType"

interface TodoProviderProps {
  children: ReactNode
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<TodoStatistics>({
    total: 0,
    active: 0,
    completed: 0,
    progress: 0,
  })

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(
    undefined
  )
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(
    undefined
  )
  const [filterPriority, setFilterPriority] = useState<string | undefined>(
    undefined
  )

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (error) {
      message.error("Failed to load categories")
      console.error(error)
    }
  }

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await todoApi.getTodos({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sort_by: "created_at",
        sort_order: "desc",
        completed: filterCompleted,
        category_id: filterCategoryId,
        priority: filterPriority,
      })

      setTodos(response.data)
      setTotal(response.pagination.total)

      // Calculate statistics inline
      const completed = response.data.filter((t) => t.completed).length
      const active = response.data.filter((t) => !t.completed).length
      const progress =
        response.pagination.total > 0
          ? Math.round((completed / response.pagination.total) * 100)
          : 0

      setStatistics({
        total: response.pagination.total,
        active,
        completed,
        progress,
      })
    } catch (error) {
      message.error("Failed to load todos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    filterCompleted,
    filterCategoryId,
    filterPriority,
  ])

  const createTodo = async (todo: TodoInput) => {
    try {
      await todoApi.createTodo(todo)
      message.success("Todo created successfully")
      await fetchTodos()
    } catch (error) {
      message.error("Failed to create todo")
      throw error
    }
  }

  const updateTodo = async (id: number, todo: TodoInput) => {
    try {
      await todoApi.updateTodo(id, todo)
      message.success("Todo updated successfully")
      await fetchTodos()
    } catch (error) {
      message.error("Failed to update todo")
      throw error
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id)
      message.success("Todo deleted successfully")
      await fetchTodos()
    } catch (error) {
      message.error("Failed to delete todo")
      throw error
    }
  }

  const toggleComplete = async (id: number) => {
    try {
      await todoApi.toggleComplete(id)
      message.success("Todo status updated")
      await fetchTodos()
    } catch (error) {
      message.error("Failed to update todo status")
      throw error
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const value: TodoContextType = {
    todos,
    categories,
    loading,
    statistics,
    currentPage,
    pageSize,
    total,
    searchQuery,
    filterCompleted,
    filterCategoryId,
    filterPriority,
    fetchTodos,
    fetchCategories,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setFilterCompleted,
    setFilterCategoryId,
    setFilterPriority,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

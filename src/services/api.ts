import axios from 'axios';
import { Todo, TodoInput, TodosResponse, Category } from '../types/todos';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo API
export const todoApi = {
  // Get all todos with pagination and filters
  getTodos: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    completed?: boolean;
    category_id?: number;
    priority?: string;
  } = {}) => {
    const response = await apiClient.get<TodosResponse>('/todos', { params });
    return response.data;
  },

  // Get single todo by ID
  getTodoById: async (id: number) => {
    const response = await apiClient.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Create new todo
  createTodo: async (todo: TodoInput) => {
    const response = await apiClient.post<Todo>('/todos', todo);
    return response.data;
  },

  // Update existing todo
  updateTodo: async (id: number, todo: TodoInput) => {
    const response = await apiClient.put<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: number) => {
    await apiClient.delete(`/todos/${id}`);
  },

  // Toggle completion status
  toggleComplete: async (id: number) => {
    const response = await apiClient.patch<Todo>(`/todos/${id}/complete`);
    return response.data;
  },
};

// Category API
export const categoryApi = {
  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  // Get single category by ID
  getCategoryById: async (id: number) => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (category: { name: string; color: string }) => {
    const response = await apiClient.post<Category>('/categories', category);
    return response.data;
  },

  // Update existing category
  updateCategory: async (id: number, category: { name: string; color: string }) => {
    const response = await apiClient.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    await apiClient.delete(`/categories/${id}`);
  },
};

export default apiClient;

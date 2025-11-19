import { useState, useEffect } from "react"
import {
  Layout,
  Typography,
  Input,
  Button,
  Pagination,
  Space,
  message,
  Modal,
  FloatButton,
  Spin,
} from "antd"
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import StatisticsCards from "./components/StatisticsCards"
import TodoItem from "./components/TodoItem"
import TodoFormModal from "./components/TodoFormModal"
import { todoApi, categoryApi } from "./services/api"
import { Todo, TodoInput, Category, TodoStatistics } from "./types/todos"
import "./App.css"

const { Header, Content } = Layout
const { Title } = Typography
const { Search } = Input

function App() {
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

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch todos when page, search changes
  useEffect(() => {
    fetchTodos()
  }, [currentPage, pageSize, searchQuery])

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (error) {
      message.error("Failed to load categories")
      console.error(error)
    }
  }

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await todoApi.getTodos({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sort_by: "created_at",
        sort_order: "desc",
      })

      setTodos(response.data)
      setTotal(response.pagination.total)

      // Calculate statistics
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
  }

  const handleCreateTodo = () => {
    setEditingTodo(null)
    setModalVisible(true)
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setModalVisible(true)
  }

  const handleDeleteTodo = (id: number) => {
    Modal.confirm({
      title: "Delete Todo",
      content: "Are you sure you want to delete this todo?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await todoApi.deleteTodo(id)
          message.success("Todo deleted successfully")
          fetchTodos()
        } catch (error) {
          message.error("Failed to delete todo")
          console.error(error)
        }
      },
    })
  }

  const handleToggleComplete = async (id: number) => {
    try {
      await todoApi.toggleComplete(id)
      message.success("Todo status updated")
      fetchTodos()
    } catch (error) {
      message.error("Failed to update todo status")
      console.error(error)
    }
  }

  const handleSubmitTodo = async (values: TodoInput) => {
    try {
      if (editingTodo) {
        await todoApi.updateTodo(editingTodo.id, values)
        message.success("Todo updated successfully")
      } else {
        await todoApi.createTodo(values)
        message.success("Todo created successfully")
      }
      setModalVisible(false)
      fetchTodos()
    } catch (error) {
      message.error(
        editingTodo ? "Failed to update todo" : "Failed to create todo"
      )
      console.error(error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Title level={2} style={{ margin: "16px 0" }}>
          Industrix Todo App
        </Title>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <StatisticsCards statistics={statistics} />

        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Search
            placeholder="Search todos..."
            allowClear
            enterButton
            size="large"
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreateTodo}
            style={{ width: "100%", height: 48 }}
          >
            Add New Todo
          </Button>

          <Spin spinning={loading}>
            {todos.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 0",
                  color: "#8c8c8c",
                }}
              >
                <Title level={4} type="secondary">
                  No todos found
                </Title>
                <p>Create your first todo to get started!</p>
              </div>
            ) : (
              <div>
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </Spin>

          {total > pageSize && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          )}
        </Space>
      </Content>

      <TodoFormModal
        visible={modalVisible}
        todo={editingTodo}
        categories={categories}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitTodo}
      />

      <FloatButton
        icon={<QuestionCircleOutlined />}
        tooltip="Help"
        style={{ right: 24, bottom: 24 }}
      />
    </Layout>
  )
}

export default App

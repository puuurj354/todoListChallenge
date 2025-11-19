import { useState } from "react"
import { Layout, Typography, Space, Modal, FloatButton, Spin } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { useTodoContext } from "./context/useTodoContext"
import StatisticsCards from "./components/StatisticsCards"
import SearchBar from "./components/SearchBar"
import FilterBar from "./components/FilterBar"
import AddTodoButton from "./components/AddTodoButton"
import TodoItem from "./components/TodoItem"
import TodoFormModal from "./components/TodoFormModal"
import TodoPagination from "./components/TodoPagination"
import EmptyState from "./components/EmptyState"
import type { Todo, TodoInput } from "./types/todos"
import "./App.css"

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  const {
    todos,
    categories,
    loading,
    statistics,
    currentPage,
    pageSize,
    total,
    filterCompleted,
    filterCategoryId,
    filterPriority,
    toggleComplete,
    deleteTodo,
    updateTodo,
    createTodo,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setFilterCompleted,
    setFilterCategoryId,
    setFilterPriority,
  } = useTodoContext()

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

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
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteTodo(id)
      },
    })
  }

  const handleToggleComplete = async (id: number) => {
    await toggleComplete(id)
  }

  const handleSubmitTodo = async (values: TodoInput) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, values)
      } else {
        await createTodo(values)
      }
      setModalVisible(false)
    } catch (error) {
      // Error handled in context
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

  const handleClearFilters = () => {
    setFilterCompleted(undefined)
    setFilterCategoryId(undefined)
    setFilterPriority(undefined)
    setCurrentPage(1)
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
          <SearchBar onSearch={handleSearch} />

          <FilterBar
            filterCompleted={filterCompleted}
            filterCategoryId={filterCategoryId}
            filterPriority={filterPriority}
            categories={categories}
            onFilterCompletedChange={setFilterCompleted}
            onFilterCategoryChange={setFilterCategoryId}
            onFilterPriorityChange={setFilterPriority}
            onClearFilters={handleClearFilters}
          />

          <AddTodoButton onClick={handleCreateTodo} />

          <Spin spinning={loading}>
            {todos.length === 0 ? (
              <EmptyState />
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

          <TodoPagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
          />
        </Space>
      </Content>

      <TodoFormModal
        open={modalVisible}
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

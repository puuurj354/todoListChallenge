import { useState } from "react"
import { Space, Modal, Spin } from "antd"
import { useTodoContext } from "../../context/useTodoContext"
import StatisticsCards from "./components/StatisticsCards"
import SearchBar from "../../ui/SearchBar"
import FilterBar from "./components/FilterBar"
import AddTodoButton from "../../ui/AddTodoButton"
import TodoItem from "./components/TodoItem"
import TodoFormModal from "./components/TodoFormModal"
import TodoPagination from "./components/TodoPagination"
import EmptyState from "../../ui/EmptyState"
import type { Todo, TodoInput } from "../../types/todos"

const TodoList = () => {
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
    } catch {
      // Error handled in context
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
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
    <>
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

      <TodoFormModal
        open={modalVisible}
        todo={editingTodo}
        categories={categories}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitTodo}
      />
    </>
  )
}

export default TodoList

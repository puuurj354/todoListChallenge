import { useState } from "react"
import { Card, Button, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { Category } from "../../types/todos"
import { categoryApi } from "../../services/api"
import CategoryTable from "./components/CategoryTable"
import CategoryFormModal from "./components/CategoryFormModal"

interface CategoryManagerProps {
  categories: Category[]
  onCategoriesChange: () => void
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoriesChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreate = () => {
    setEditingCategory(null)
    setModalVisible(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      await categoryApi.deleteCategory(id)
      message.success("Category deleted successfully")
      onCategoriesChange()
    } catch (error) {
      message.error("Failed to delete category")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: { name: string; color: string }) => {
    try {
      setLoading(true)

      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, values)
        message.success("Category updated successfully")
      } else {
        await categoryApi.createCategory(values)
        message.success("Category created successfully")
      }

      setModalVisible(false)
      setEditingCategory(null)
      onCategoriesChange()
    } catch (error) {
      message.error(
        editingCategory
          ? "Failed to update category"
          : "Failed to create category"
      )
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title="Category Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          <span className="hidden sm:inline">Add Category</span>
          <span className="inline sm:hidden">Add</span>
        </Button>
      }
      styles={{
        body: { padding: "12px" },
      }}
    >
      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryFormModal
        open={modalVisible}
        category={editingCategory}
        onCancel={() => {
          setModalVisible(false)
          setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Card>
  )
}

export default CategoryManager

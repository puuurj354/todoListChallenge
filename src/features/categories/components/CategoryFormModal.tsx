import { Modal, Form, Input, Space } from "antd"
import { useEffect } from "react"
import type { Category } from "../../../types/todos"

interface CategoryFormModalProps {
  open: boolean
  category: Category | null
  onCancel: () => void
  onSubmit: (values: { name: string; color: string }) => Promise<void>
  loading: boolean
}

const colorPresets = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
]

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  open,
  category,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && category) {
      form.setFieldsValue({
        name: category.name,
        color: category.color,
      })
    } else if (open) {
      form.resetFields()
    }
  }, [open, category, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
      form.resetFields()
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  return (
    <Modal
      title={category ? "Edit Category" : "Create New Category"}
      open={open}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={handleSubmit}
      okText={category ? "Update" : "Create"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          color: "#3B82F6",
        }}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: "Please input category name!" },
            {
              min: 2,
              message: "Category name must be at least 2 characters",
            },
            {
              max: 50,
              message: "Category name must not exceed 50 characters",
            },
          ]}
        >
          <Input placeholder="e.g., Work, Personal, Shopping" />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[
            { required: true, message: "Please select a color!" },
            {
              pattern: /^#[0-9A-F]{6}$/i,
              message: "Please enter a valid hex color",
            },
          ]}
        >
          <Input
            type="color"
            style={{ width: "100%", height: 40, cursor: "pointer" }}
          />
        </Form.Item>

        <Form.Item label="Quick Colors">
          <Space wrap>
            {colorPresets.map((color) => (
              <div
                key={color}
                onClick={() => form.setFieldsValue({ color })}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  borderRadius: 4,
                  cursor: "pointer",
                  border:
                    form.getFieldValue("color") === color
                      ? "3px solid #000"
                      : "1px solid #d9d9d9",
                }}
                title={color}
              />
            ))}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CategoryFormModal

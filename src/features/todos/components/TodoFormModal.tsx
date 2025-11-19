import { Modal, Form, Input, Select, DatePicker, Switch } from "antd"
import { useEffect } from "react"
import type { Todo, TodoInput, Category } from "../../../types/todos"
import dayjs from "dayjs"

const { TextArea } = Input
const { Option } = Select

interface TodoFormModalProps {
  open: boolean
  todo: Todo | null
  categories: Category[]
  onCancel: () => void
  onSubmit: (values: TodoInput) => Promise<void>
}

const TodoFormModal: React.FC<TodoFormModalProps> = ({
  open,
  todo,
  categories,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && todo) {
      // Edit mode - populate form with todo data
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        category_id: todo.category_id,
        priority: todo.priority,
        due_date: todo.due_date ? dayjs(todo.due_date) : undefined,
        completed: todo.completed,
      })
    } else if (open) {
      // Create mode - reset form
      form.resetFields()
      form.setFieldsValue({
        priority: "medium",
        completed: false,
      })
    }
  }, [open, todo, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const todoInput: TodoInput = {
        title: values.title,
        description: values.description || "",
        completed: values.completed || false,
        category_id: values.category_id,
        priority: values.priority,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      }

      await onSubmit(todoInput)
      form.resetFields()
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  return (
    <Modal
      title={todo ? "Edit Todo" : "Create New Todo"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={todo ? "Update" : "Create"}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: "medium",
          completed: false,
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter todo title" },
            { max: 255, message: "Title must be less than 255 characters" },
          ]}
        >
          <Input placeholder="Enter todo title" size="large" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            placeholder="Enter todo description"
            rows={4}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item label="Category" name="category_id">
          <Select placeholder="Select a category" size="large" allowClear>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: category.color,
                    marginRight: 8,
                  }}
                />
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select priority" }]}
        >
          <Select placeholder="Select priority" size="large">
            <Option value="high">
              <span style={{ color: "#f5222d" }}>● High</span>
            </Option>
            <Option value="medium">
              <span style={{ color: "#faad14" }}>● Medium</span>
            </Option>
            <Option value="low">
              <span style={{ color: "#52c41a" }}>● Low</span>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Due Date" name="due_date">
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD HH:mm"
            showTime
          />
        </Form.Item>

        {todo && (
          <Form.Item label="Completed" name="completed" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default TodoFormModal

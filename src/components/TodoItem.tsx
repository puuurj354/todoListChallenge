import { Card, Checkbox, Tag, Space, Button, Typography } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Todo } from "../types/todos"

const { Text, Paragraph } = Typography

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: number) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f5222d"
      case "medium":
        return "#faad14"
      case "low":
        return "#52c41a"
      default:
        return "#d9d9d9"
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#fff1f0"
      case "medium":
        return "#fffbe6"
      case "low":
        return "#f6ffed"
      default:
        return "#fafafa"
    }
  }

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        opacity: todo.completed ? 0.7 : 1,
        transition: "all 0.3s ease",
      }}
      bodyStyle={{ padding: "16px 20px" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggleComplete(todo.id)}
            />
            <Text
              strong
              delete={todo.completed}
              style={{
                fontSize: 16,
                color: todo.completed ? "#8c8c8c" : "#262626",
              }}
            >
              {todo.title}
            </Text>
          </Space>
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(todo)}
              size="small"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(todo.id)}
              size="small"
            />
          </Space>
        </Space>

        {todo.description && (
          <Paragraph
            style={{
              margin: "0 0 0 24px",
              color: "#595959",
              fontSize: 14,
            }}
            ellipsis={{ rows: 2, expandable: false }}
          >
            {todo.description}
          </Paragraph>
        )}

        <Space style={{ marginLeft: 24 }} size={8}>
          {todo.category && (
            <Tag
              color={todo.category.color}
              style={{
                borderRadius: 4,
                padding: "2px 8px",
                fontWeight: 500,
              }}
            >
              {todo.category.name}
            </Tag>
          )}
          <Tag
            style={{
              backgroundColor: getPriorityBgColor(todo.priority),
              color: getPriorityColor(todo.priority),
              border: "none",
              borderRadius: 4,
              padding: "2px 8px",
              fontWeight: 500,
            }}
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </Tag>
        </Space>
      </Space>
    </Card>
  )
}

export default TodoItem

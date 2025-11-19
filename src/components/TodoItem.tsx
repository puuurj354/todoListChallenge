import { Card, Checkbox, Space, Button, Typography } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Todo } from "../types/todos"
import CategoryBadge from "./CategoryBadge"
import PriorityBadge from "./PriorityBadge"

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
  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        opacity: todo.completed ? 0.7 : 1,
        transition: "all 0.3s ease",
      }}
      styles={{ body: { padding: "16px 20px" } }}
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
          {todo.category && <CategoryBadge category={todo.category} />}
          <PriorityBadge priority={todo.priority} />
        </Space>
      </Space>
    </Card>
  )
}

export default TodoItem

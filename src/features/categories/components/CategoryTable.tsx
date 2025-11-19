import { Table, Button, Space, Popconfirm } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Category } from "../../../types/todos"
import type { ColumnsType } from "antd/es/table"

interface CategoryTableProps {
  categories: Category[]
  loading: boolean
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Category) => (
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: record.color,
              borderRadius: 4,
              border: "1px solid #d9d9d9",
            }}
          />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => onDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  )
}

export default CategoryTable

import { Pagination } from "antd"

interface TodoPaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, size: number) => void
}

const TodoPagination: React.FC<TodoPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
}) => {
  if (total <= pageSize) {
    return null
  }

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
      />
    </div>
  )
}

export default TodoPagination

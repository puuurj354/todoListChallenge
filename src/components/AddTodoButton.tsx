import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"

interface AddTodoButtonProps {
  onClick: () => void
}

const AddTodoButton: React.FC<AddTodoButtonProps> = ({ onClick }) => {
  return (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      size="large"
      onClick={onClick}
      style={{ width: "100%", height: 48 }}
    >
      Add New Todo
    </Button>
  )
}

export default AddTodoButton

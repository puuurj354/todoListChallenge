import { Typography } from "antd"

const { Title } = Typography

const EmptyState: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "#8c8c8c" }}>
      <Title level={4} type="secondary">
        No todos found
      </Title>
      <p>Create your first todo to get started!</p>
    </div>
  )
}

export default EmptyState

import { Tag } from "antd"

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low"
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
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
    <Tag
      style={{
        backgroundColor: getPriorityBgColor(priority),
        color: getPriorityColor(priority),
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        fontWeight: 500,
      }}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Tag>
  )
}

export default PriorityBadge

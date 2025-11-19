import { Tag } from "antd"
import type { Category } from "../types/todos"

interface CategoryBadgeProps {
  category: Category
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <Tag
      color={category.color}
      style={{
        borderRadius: 4,
        padding: "2px 8px",
        fontWeight: 500,
      }}
    >
      {category.name}
    </Tag>
  )
}

export default CategoryBadge

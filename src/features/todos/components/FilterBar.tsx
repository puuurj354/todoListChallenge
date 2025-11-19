import { Space, Select, Button } from "antd"
import { FilterOutlined, ClearOutlined } from "@ant-design/icons"
import type { Category } from "../../../types/todos"

const { Option } = Select

interface FilterBarProps {
  categories: Category[]
  filterCompleted: boolean | undefined
  filterCategoryId: number | undefined
  filterPriority: string | undefined
  onFilterCompletedChange: (value: boolean | undefined) => void
  onFilterCategoryChange: (value: number | undefined) => void
  onFilterPriorityChange: (value: string | undefined) => void
  onClearFilters: () => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  filterCompleted,
  filterCategoryId,
  filterPriority,
  onFilterCompletedChange,
  onFilterCategoryChange,
  onFilterPriorityChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    filterCompleted !== undefined ||
    filterCategoryId !== undefined ||
    filterPriority !== undefined

  return (
    <Space wrap style={{ width: "100%", marginBottom: 16 }}>
      <FilterOutlined style={{ fontSize: 16, color: "#8c8c8c" }} />

      <Select
        placeholder="Status"
        allowClear
        style={{ minWidth: 120 }}
        value={filterCompleted}
        onChange={onFilterCompletedChange}
      >
        <Option value={false}>Active</Option>
        <Option value={true}>Completed</Option>
      </Select>

      <Select
        placeholder="Category"
        allowClear
        style={{ minWidth: 150 }}
        value={filterCategoryId}
        onChange={onFilterCategoryChange}
      >
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

      <Select
        placeholder="Priority"
        allowClear
        style={{ minWidth: 120 }}
        value={filterPriority}
        onChange={onFilterPriorityChange}
      >
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

      {hasActiveFilters && (
        <Button icon={<ClearOutlined />} onClick={onClearFilters} size="small">
          Clear Filters
        </Button>
      )}
    </Space>
  )
}

export default FilterBar

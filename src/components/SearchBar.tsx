import { Input } from "antd"

const { Search } = Input

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search todos...",
}) => {
  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton
      size="large"
      onSearch={onSearch}
      style={{ width: "100%" }}
    />
  )
}

export default SearchBar

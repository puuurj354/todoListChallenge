import { useState } from "react"
import { Layout, Typography, Tabs, FloatButton } from "antd"
import {
  QuestionCircleOutlined,
  UnorderedListOutlined,
  FolderOutlined,
} from "@ant-design/icons"
import { useTodoContext } from "./context/useTodoContext"
import { TodoList } from "./features/todos"
import { CategoryManager } from "./features/categories"
import "./App.css"

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  const { categories, fetchCategories } = useTodoContext()
  const [activeTab, setActiveTab] = useState("todos")

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Title level={2} style={{ margin: "16px 0" }}>
          Industrix Todo App
        </Title>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "todos",
              label: (
                <span>
                  <UnorderedListOutlined />
                  Todo List
                </span>
              ),
              children: <TodoList />,
            },
            {
              key: "categories",
              label: (
                <span>
                  <FolderOutlined />
                  Categories
                </span>
              ),
              children: (
                <CategoryManager
                  categories={categories}
                  onCategoriesChange={fetchCategories}
                />
              ),
            },
          ]}
        />
      </Content>

      <FloatButton
        icon={<QuestionCircleOutlined />}
        tooltip="Help"
        style={{ right: 24, bottom: 24 }}
      />
    </Layout>
  )
}

export default App

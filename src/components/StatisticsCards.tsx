import { Card, Row, Col } from "antd"
import { TodoStatistics } from "../types/todos"

interface StatisticsCardsProps {
  statistics: TodoStatistics
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <Card
          style={{
            backgroundColor: "#E3F2FD",
            border: "none",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 14, color: "#1976D2", marginBottom: 8 }}>
            Total Tasks
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#1565C0" }}>
            {statistics.total}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          style={{
            backgroundColor: "#FFF8E1",
            border: "none",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 14, color: "#F57C00", marginBottom: 8 }}>
            Active
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#EF6C00" }}>
            {statistics.active}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          style={{
            backgroundColor: "#E8F5E9",
            border: "none",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 14, color: "#388E3C", marginBottom: 8 }}>
            Completed
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#2E7D32" }}>
            {statistics.completed}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          style={{
            backgroundColor: "#F3E5F5",
            border: "none",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 14, color: "#7B1FA2", marginBottom: 8 }}>
            Progress
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#6A1B9A" }}>
            {statistics.progress}%
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default StatisticsCards

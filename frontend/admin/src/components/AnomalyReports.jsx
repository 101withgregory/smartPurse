import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Card, Statistic, Row, Col, Alert } from "antd";
import { FaSearch, FaExclamationTriangle, FaFlag } from "react-icons/fa";

const mockAnomalies = [
  { 
    _id: "101", user: "Greg", amount: 5000, riskScore: 85, 
    reason: "Unusual high transaction", detectedAt: "2025-02-10T10:00:00Z" 
  },
  { 
    _id: "102", user: "Ezra", amount: 2, riskScore: 30, 
    reason: "Suspicious low transaction", detectedAt: "2025-02-10T11:00:00Z" 
  },
  { 
    _id: "103", user: "Ben", amount: 2000, riskScore: 75, 
    reason: "Frequent large transfers", detectedAt: "2025-02-11T08:30:00Z" 
  },
  { 
    _id: "104", user: "Nora", amount: 15000, riskScore: 95, 
    reason: "Multiple high-value transactions", detectedAt: "2025-02-12T12:45:00Z" 
  },
];

const AnomalyReports = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [totalAnomalies, setTotalAnomalies] = useState(0);

  useEffect(() => {
    // Simulating backend call by using mock data
    setTimeout(() => {
      setAnomalies(mockAnomalies);
      setTotalAnomalies(mockAnomalies.length);
      setHighRiskCount(mockAnomalies.filter(a => a.riskScore >= 80).length);
    }, 1000); // 1 second delay to simulate fetching
  }, []);

  const reportAnomaly = (id) => {
    console.log(`Reported anomaly: ${id}`);
  };

  const columns = [
    { title: "User", dataIndex: "user", key: "user" },
    { title: "Amount ($)", dataIndex: "amount", key: "amount" },
    { 
      title: "Risk Score", 
      dataIndex: "riskScore", 
      key: "riskScore", 
      render: (score) => (
        <Tag color={score >= 80 ? "red" : score >= 50 ? "orange" : "green"}>
          {score}%
        </Tag>
      )
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { 
      title: "Detected On", 
      dataIndex: "detectedAt", 
      key: "detectedAt",
      render: (date) => new Date(date).toLocaleString()
    },
    { 
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button icon={<FaSearch />} onClick={() => console.log("Investigating:", record._id)}> Investigate</Button>
          <Button icon={<FaFlag />} danger style={{ marginLeft: 10 }} onClick={() => reportAnomaly(record._id)}> Report</Button>
        </>
      )
    }
  ];

  return (
    <div className="anomaly-reports">
      <h2>Anomaly Detection Reports</h2>

      {highRiskCount > 0 && (
        <Alert 
          message={`🚨 High-Risk Alerts: ${highRiskCount} critical anomalies detected!`} 
          type="error" 
          showIcon 
          style={{ marginBottom: 15 }}
        />
      )}

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Anomalies" value={totalAnomalies} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="High-Risk Transactions" value={highRiskCount} valueStyle={{ color: "red" }} />
          </Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={anomalies} rowKey="_id" style={{ marginTop: 20 }} />
    </div>
  );
};

export default AnomalyReports;

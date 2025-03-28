// import React, { useEffect, useState } from "react";
// import { Table, Button, Tag, Card, Statistic, Row, Col, Alert } from "antd";
// import { FaSearch, FaExclamationTriangle, FaFlag } from "react-icons/fa";

// const mockAnomalies = [
//   { 
//     _id: "101", user: "Greg", amount: 5000, riskScore: 85, 
//     reason: "Unusual high transaction", detectedAt: "2025-02-10T10:00:00Z" 
//   },
//   { 
//     _id: "102", user: "Ezra", amount: 2, riskScore: 30, 
//     reason: "Suspicious low transaction", detectedAt: "2025-02-10T11:00:00Z" 
//   },
//   { 
//     _id: "103", user: "Ben", amount: 2000, riskScore: 75, 
//     reason: "Frequent large transfers", detectedAt: "2025-02-11T08:30:00Z" 
//   },
//   { 
//     _id: "104", user: "Nora", amount: 15000, riskScore: 95, 
//     reason: "Multiple high-value transactions", detectedAt: "2025-02-12T12:45:00Z" 
//   },
// ];

// const AnomalyReports = () => {
//   const [anomalies, setAnomalies] = useState([]);
//   const [highRiskCount, setHighRiskCount] = useState(0);
//   const [totalAnomalies, setTotalAnomalies] = useState(0);

//   useEffect(() => {
//     // Simulating backend call by using mock data
//     setTimeout(() => {
//       setAnomalies(mockAnomalies);
//       setTotalAnomalies(mockAnomalies.length);
//       setHighRiskCount(mockAnomalies.filter(a => a.riskScore >= 80).length);
//     }, 1000); // 1 second delay to simulate fetching
//   }, []);

//   const reportAnomaly = (id) => {
//     console.log(`Reported anomaly: ${id}`);
//   };

//   const columns = [
//     { title: "User", dataIndex: "user", key: "user" },
//     { title: "Amount ($)", dataIndex: "amount", key: "amount" },
//     { 
//       title: "Risk Score", 
//       dataIndex: "riskScore", 
//       key: "riskScore", 
//       render: (score) => (
//         <Tag color={score >= 80 ? "red" : score >= 50 ? "orange" : "green"}>
//           {score}%
//         </Tag>
//       )
//     },
//     { title: "Reason", dataIndex: "reason", key: "reason" },
//     { 
//       title: "Detected On", 
//       dataIndex: "detectedAt", 
//       key: "detectedAt",
//       render: (date) => new Date(date).toLocaleString()
//     },
//     { 
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <>
//           <Button icon={<FaSearch />} onClick={() => console.log("Investigating:", record._id)}> Investigate</Button>
//           <Button icon={<FaFlag />} danger style={{ marginLeft: 10 }} onClick={() => reportAnomaly(record._id)}> Report</Button>
//         </>
//       )
//     }
//   ];

//   return (
//     <div className="anomaly-reports">
//       <h2>Anomaly Detection Reports</h2>

//       {highRiskCount > 0 && (
//         <Alert 
//           message={`🚨 High-Risk Alerts: ${highRiskCount} critical anomalies detected!`} 
//           type="error" 
//           showIcon 
//           style={{ marginBottom: 15 }}
//         />
//       )}

//       <Row gutter={16}>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Total Anomalies" value={totalAnomalies} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="High-Risk Transactions" value={highRiskCount} valueStyle={{ color: "red" }} />
//           </Card>
//         </Col>
//       </Row>

//       <Table columns={columns} dataSource={anomalies} rowKey="_id" style={{ marginTop: 20 }} />
//     </div>
//   );
// };

// export default AnomalyReports;
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Modal, Button, Form, Input, Select } from "antd";
import { toast } from "react-toastify";
import anomalyService from "../services/anomalyService";

const { Option } = Select;
const MySwal = withReactContent(Swal);

const AnomalyReports = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAnomaly, setCurrentAnomaly] = useState(null);
  const [form] = Form.useForm();

  // Fetch Anomalies
  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await anomalyService.getAllAnomalies(token);
      setAnomalies(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching anomalies:", error);
      toast.error("Failed to load anomalies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  // Open Modal for Editing/Resolving
  const openModal = (anomaly) => {
    setCurrentAnomaly(anomaly);
    form.setFieldsValue({
      status: anomaly.status,
      resolutionNotes: anomaly.resolutionNotes || "",
    });
    setModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentAnomaly(null);
    form.resetFields();
  };

  // Handle Form Submission
  const handleFormSubmit = async (values) => {
    console.log("Form Submitted:", values);
    try {
      const token = localStorage.getItem("token");
      await anomalyService.updateAnomalyStatus(
        currentAnomaly._id,
        values.status,
        values.resolutionNotes,
        token
      );
      toast.success("Anomaly updated successfully.");
      fetchAnomalies();
      closeModal();
    } catch (error) {
      console.error("Error updating anomaly:", error);
      toast.error("Failed to update anomaly.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await anomalyService.deleteAnomaly(id, token);
          toast.success("Anomaly deleted successfully.");
          fetchAnomalies();
        } catch (error) {
          console.error("Error deleting anomaly:", error);
          toast.error("Failed to delete anomaly.");
        }
      }
    });
  };

  // Table Columns
  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      sortable: true,
      width: "200px",
    },
    {
      name: "Risk Score",
      selector: (row) => row.riskScore,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`font-bold ${
            row.riskScore > 70
              ? "text-red-500"
              : row.riskScore > 40
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {row.riskScore}
        </span>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span
          className={`font-bold ${
            row.status === "flagged"
              ? "text-red-500"
              : row.status === "reviewed"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Detected By",
      selector: (row) =>
        row.detectedBySystem ? "System" : row.reviewedBy || "Manual",
      sortable: true,
      width: "150px",
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.detectedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortable: true,
      width: "180px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <FaEdit
            className="text-blue-500 cursor-pointer"
            onClick={() => openModal(row)}
          />
          <FaTrashAlt
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Anomaly Reports</h2>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-6">
          <ClipLoader color="#3b82f6" loading={loading} size={40} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={anomalies}
          pagination
          highlightOnHover
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
              },
            },
          }}
        />
      )}

      {/* ✅ Edit/Resolve Modal */}
      <Modal
        title="Review Anomaly"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
            className="bg-blue-500"
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="flagged">Flagged</Option>
              <Option value="reviewed">Reviewed</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item name="resolutionNotes" label="Resolution Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AnomalyReports;

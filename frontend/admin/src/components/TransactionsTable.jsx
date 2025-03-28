import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import dashboardSummaryService from "../services/dashboardSummaryService";
import { ClipLoader } from "react-spinners";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await dashboardSummaryService.getDashboardSummary();
        const latestTransactions = response.recentTransactions.slice(0, 3);
        setTransactions(latestTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchTransactions();
  }, []);

  const columns = [
    {
      name: "Id",
      selector: (_, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Kitty",
      selector: (row) => row.kittyName || "N/A",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type || "N/A",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `Ksh ${row.amount?.toFixed(2) || "0.00"}`, 
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`${
            row.status === "pending"
              ? "text-yellow-500"
              : row.status === "approved"
              ? "text-green-500"
              : row.status === "rejected"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Anomaly",
      selector: (row) => row.anomaly_detected,
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.anomaly_detected ? "text-red-500 font-semibold" : "text-gray-500"
          }
        >
          {row.anomaly_detected ? "True" : "False"}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 transactions-table">
    <h3 className="text-lg font-semibold mb-2">Latest Contributions</h3>

    {/* Loading Spinner */}
    {loading ? (
      <div className="flex justify-center py-6">
        <ClipLoader color="#3b82f6" loading={loading} size={30} />
      </div>
    ) : (
      <DataTable
        columns={columns}
        data={transactions}
        pagination
        highlightOnHover
        striped
        responsive
      />
    )}
  </div>
  );
};

export default TransactionsTable;

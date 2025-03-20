import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import dashboardSummaryService from "../services/dashboardSummaryService";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await dashboardSummaryService.getDashboardSummary(); // ✅ Updated data source
        setTransactions(response.recentTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const columns = [
    {
      name: "Id",
      selector: (_, index) => index + 1, // ✅ Computed index value
      sortable: true,
      width: "70px",
    },
    {
      name: "Group",
      selector: (row) => row.group_name,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `$${row.amount.toFixed(2)}`, // ✅ Format to 2 decimal places
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={row.status === "pending" ? "text-yellow-500" : "text-green-500"}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Anomaly",
      selector: (row) => row.anomaly_detected,
      sortable: true,
      cell: (row) => (
        <span className={row.anomaly_detected ? "text-red-500" : "text-gray-500"}>
          {row.anomaly_detected ? "Yes" : "No"}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 transactions-table">
      <h3 className="text-lg font-semibold mb-2">Latest Transactions</h3>
      <DataTable
        columns={columns}
        data={transactions}
        pagination // ✅ Enables pagination
        highlightOnHover // ✅ Highlights rows on hover
        striped // ✅ Adds alternating row colors
        responsive // ✅ Makes the table responsive
      />
    </div>
  );
};

export default TransactionsTable;

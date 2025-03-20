import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaCheck, FaTimes, FaFlag, FaRegFlag, FaSyncAlt } from "react-icons/fa";
import transactionService from "../services/transactionService";
import Swal from "sweetalert2";

// ✅ Status Text Color Styling
const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "text-green-500";
    case "rejected":
      return "text-red-500";
    case "pending":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

const TransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Filter Transactions by Type
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType =
      filterType === "All" ||
      tx.transactionType === filterType ||
      (filterType === "Flagged" && tx.isFlagged);

    const matchesSearch = searchQuery
      ? tx.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.transactionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery)
      : true;

    return matchesType && matchesSearch;
  });

  // Approve Transaction
  const handleApprove = async (id) => {
    try {
      await transactionService.updateTransactionStatus(id, "approved");
      setTransactions(
        transactions.map((tx) =>
          tx._id === id ? { ...tx, status: "approved" } : tx
        )
      );
      Swal.fire("Success", "Transaction approved successfully", "success");
    } catch (error) {
      console.error("Error approving transaction:", error);
      Swal.fire("Error", "Failed to approve transaction", "error");
    }
  };

  // Reject Transaction
  const handleReject = async (id) => {
    try {
      await transactionService.updateTransactionStatus(id, "rejected");
      setTransactions(
        transactions.map((tx) =>
          tx._id === id ? { ...tx, status: "rejected" } : tx
        )
      );
      Swal.fire("Success", "Transaction rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      Swal.fire("Error", "Failed to reject transaction", "error");
    }
  };

  //  Toggle Flagging
  const toggleFlag = async (id, isFlagged) => {
    try {
      if (isFlagged) {
        await transactionService.unflagTransaction(id);
        setTransactions(
          transactions.map((tx) =>
            tx._id === id ? { ...tx, isFlagged: false } : tx
          )
        );
      } else {
        const { value: reason } = await Swal.fire({
          title: "Flag Transaction",
          input: "text",
          inputPlaceholder: "Enter reason for flagging",
          showCancelButton: true,
        });

        if (reason) {
          await transactionService.flagTransaction(id, reason);
          setTransactions(
            transactions.map((tx) =>
              tx._id === id
                ? { ...tx, isFlagged: true, flagReason: reason }
                : tx
            )
          );
        }
      }
    } catch (error) {
      console.error("Error flagging transaction:", error);
      Swal.fire("Error", "Failed to flag transaction", "error");
    }
  };

  // Table Columns
  const columns = [
    { name: "ID", cell: (row, index) => index + 1, width: "50px" },
    { name: "Type", selector: (row) => row.transactionType, sortable: true },
    {
      name: "Amount (Ksh)",
      selector: (row) => `Ksh ${row.amount.toLocaleString()}`,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user?.email || "N/A",
      sortable: true,
    },
    {
      name: "Group",
      selector: (row) => row.group?.name || "personal",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* ✅ Approve */}
          <FaCheck
            className="text-green-500 cursor-pointer"
            onClick={() => handleApprove(row._id)}
          />
          {/* ✅ Reject */}
          <FaTimes
            className="text-red-500 cursor-pointer"
            onClick={() => handleReject(row._id)}
          />
          {/* ✅ Flag */}
          {row.isFlagged ? (
            <FaFlag
              className="text-yellow-500 cursor-pointer"
              onClick={() => toggleFlag(row._id, row.isFlagged)}
            />
          ) : (
            <FaRegFlag
              className="text-gray-500 cursor-pointer"
              onClick={() => toggleFlag(row._id, row.isFlagged)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/*Search and Filters */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
        <div className="flex gap-2 items-center justify-center">
          {["All", "deposit", "withdrawal", "transfer", "Flagged"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`border sc-btn  rounded ${
                  filterType === filter ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/*Data Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        pagination
        highlightOnHover
        striped
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              fontSize: "14px",
            },
          },
        }}
      />
    </div>
  );
};

export default TransactionsPanel;

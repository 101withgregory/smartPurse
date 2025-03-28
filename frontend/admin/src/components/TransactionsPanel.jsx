
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFlag, FaUndo, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import transactionService from "../services/transactionService";
import { ClipLoader } from "react-spinners";

const TransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  // Load Transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Swal.fire("Error", "Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Handle Status Update
  const updateTransactionStatus = async (id, status) => {
    try {
      await transactionService.updateTransactionStatus(id, status);
      loadTransactions();
  
      const message =
        status === "approved"
          ? "Transaction approved successfully"
          : "This transaction was rejected successfully";
  
      Swal.fire("Success", message, "success");
    } catch (error) {
      console.error("Error updating status:", error);
  
      // Extract error message properly
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update status";
  
      Swal.fire("Error", errorMessage, "error");
    }
  };
  

  //  Handle Flag/Unflag
  const toggleFlag = async (id, isFlagged) => {
    try {
      if (!isFlagged) {
        const { value: reason } = await Swal.fire({
          title: "Flag Transaction",
          input: "text",
          inputPlaceholder: "Enter flag reason",
          showCancelButton: true,
          confirmButtonText: "Flag",
          inputValidator: (value) => {
            if (!value) return "You need to provide a reason!";
          },
        });

        if (reason) {
          await transactionService.flagTransaction(id, reason);
          Swal.fire("Success", "Transaction flagged successfully", "success");
        }
      } else {
        await transactionService.unflagTransaction(id);
        Swal.fire("Success", "Transaction unflagged successfully", "success");
      }

      loadTransactions();
    } catch (error) {
      console.error("Error flagging transaction:", error);
      Swal.fire("Error", "Failed to update flag status", "error");
    }
  };

  // Handle Delete Transaction
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await transactionService.deleteTransaction(id);
        loadTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        Swal.fire("Error", "Failed to delete transaction", "error");
      }
    }
  };

  // Search & Filter Logic
  const filteredTransactions = transactions
    .filter((tx) =>
      filterType === "all" || tx.transactionType === filterType
    )
    .filter(
      (tx) =>
        tx.kitty?.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.user?.email.toLowerCase().includes(search.toLowerCase()) ||
        tx.mpesaReference?.toLowerCase().includes(search.toLowerCase())
    );

  // Define Columns
  const columns = [
    { name: "ID", cell: (row, index) => index + 1, width: "50px" },
    { name: "kittyName", selector: (row) => row.kittyId?.kittyName || "N/A", sortable: true },
    { name: "User", selector: (row) => row.user?.email || "N/A", sortable: true },
    { name: "Amount (Ksh)", selector: (row) => `Ksh ${row.amount}`, sortable: true },
    { name: "Type", selector: (row) => row.transactionType, sortable: true },
    {
      name: "MPESA Reference",
      selector: (row) => row.mpesaReference || "N/A",
      sortable: true,
    },
    {
      name: "Sender Phone",
      selector: (row) => row.senderPhone || "N/A",
      sortable: true,
    },
    {
      name: "Recipient Phone",
      selector: (row) => row.recipientPhone || "N/A",
      sortable: true,
    },
    {
      name: "Charges",
      selector: (row) => `Ksh ${row.charges || 0}`,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={
            row.status === "pending"
              ? "text-yellow-500"
              : row.status === "approved"
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* Flag/Unflag */}
          {row.isFlagged ? (
            <FaTimesCircle
              className="text-red-500 cursor-pointer"
              onClick={() => toggleFlag(row._id, true)}
            />
          ) : (
            <FaFlag
              className="text-blue-500 cursor-pointer"
              onClick={() => toggleFlag(row._id, false)}
            />
          )}

          {/* Approve */}
          <FaCheckCircle
            className="text-green-500 cursor-pointer"
            onClick={() => updateTransactionStatus(row._id, "approved")}
          />

          {/* Reject */}
          <FaTimesCircle
            className="text-yellow-500 cursor-pointer"
            onClick={() => updateTransactionStatus(row._id, "rejected")}
          />

          {/* Delete */}
          <FaTrash
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Search and Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-1/2"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="all">All</option>
          <option value="CASH-IN">Cash In</option>
          <option value="CASH-OUT">Cash Out</option>
          <option value="TRANSFER">Transfer</option>
          <option value="REVERSAL">Reversal</option>
        </select>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center"><ClipLoader color="#3b82f6" loading={loading} size={40} /></div>
      ) : (
        <DataTable columns={columns} data={filteredTransactions} pagination highlightOnHover striped />
      )}
    </div>
  );
};

export default TransactionsPanel;

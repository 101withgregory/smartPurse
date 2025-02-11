import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSearch, FaChartBar, FaFlag, FaRegFlag } from "react-icons/fa";

// Mock Data for Transactions
const mockTransactions = [
  { id: 1, type: "Deposit", amount: 2000, group: "Savings Club A", status: "Completed", date: "2025-02-10", flagged: false },
  { id: 2, type: "Withdrawal", amount: 6000, group: "Investment Group B", status: "Pending", date: "2025-02-09", flagged: true },
  { id: 3, type: "Transfer", amount: 1500, group: "Savings Club A", status: "Completed", date: "2025-02-08", flagged: false },
  { id: 4, type: "Deposit", amount: 500, group: "Savings Club A", status: "Completed", date: "2025-02-07", flagged: false },
];

// Styled Components for Action Buttons
const ActionButton = styled.button`
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
`;

const ApproveButton = styled(ActionButton)`
  background-color: #28a745;
  color: white;
  padding:.3rem !important;
`;

const RejectButton = styled(ActionButton)`
  background-color: #d9534f;
  color: white;
`;

const FlagButton = styled(ActionButton)`
  background-color: ${props => (props.flagged ? "#ffc107" : "#007bff")};
  color: white;
  padding:.3rem;
`;

const TransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  // Filter Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "All" || tx.type === filterType || (filterType === "Flagged" && tx.flagged);
    const matchesSearch = searchQuery
      ? tx.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery)
      : true;
    return matchesType && matchesSearch;
  });

  // Approve Transaction
  const handleApprove = (id) => {
    setTransactions(transactions.map(tx => tx.id === id ? { ...tx, status: "Approved", flagged: false } : tx));
    setModalIsOpen(false);
  };

  // Reject Transaction
  const handleReject = (id) => {
    setTransactions(transactions.map(tx => tx.id === id ? { ...tx, status: "Rejected", flagged: false } : tx));
    setModalIsOpen(false);
  };

  // Open Verification Modal
  const openVerificationModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalIsOpen(true);
  };

  // Toggle Flagging
  const toggleFlag = (id) => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, flagged: !tx.flagged } : tx
    ));
  };

  // Table Columns
  const columns = [
    { name: "ID", selector: row => row.id, width: "50px" },
    { name: "Type", selector: row => row.type, sortable: true },
    { name: "Amount (Ksh)", selector: row => `Ksh ${row.amount.toLocaleString()}`, sortable: true },
    { name: "Group", selector: row => row.group, sortable: true },
    { name: "Status", selector: row => row.status, sortable: true },
    { name: "Date", selector: row => row.date, sortable: true },
    {
      name: "Flagged",
      cell: row => row.flagged ? <FaExclamationTriangle className="text-red-500" /> : "-",
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          {row.status === "Pending" && (
            <ApproveButton onClick={() => openVerificationModal(row)} >Review</ApproveButton>
          )}
          <FlagButton flagged={row.flagged} onClick={() => toggleFlag(row.id)} >
            {row.flagged ? <><FaRegFlag /> Unflag</> : <><FaFlag /> Flag</>}
          </FlagButton>
        </div>
      ),
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg table w-full">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FaChartBar/> Transaction Records</h3>

      {/* Search Bar */}
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search by group, type, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 bg-transparent outline-none"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-3">
        {["All", "Deposit", "Withdrawal", "Transfer", "Flagged"].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterType(filter)}
            className={`px-3 py-1 border rounded sc-btn ${filterType === filter ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <DataTable 
        columns={columns} 
        data={filteredTransactions} 
        pagination 
        highlightOnHover 
        striped
      />

      {/* Verification Modal */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: { maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "8px" },
          overlay: { backgroundColor: 'rgba(0,0,0,.5)' }
        }}
      >
        {selectedTransaction && (
          <>
            <h3 className="text-lg font-semibold mb-2">Verify Transaction</h3>
            <p><strong>Type:</strong> {selectedTransaction.type}</p>
            <p><strong>Amount:</strong> Ksh {selectedTransaction.amount.toLocaleString()}</p>
            <p><strong>Group:</strong> {selectedTransaction.group}</p>
            <p><strong>Date:</strong> {selectedTransaction.date}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Flagged:</strong> {selectedTransaction.flagged ? "Yes" : "No"}</p>

            {/* Approval / Rejection Actions */}
            <div className="flex justify-end items-center gap-5 mt-4">
              <RejectButton onClick={() => handleReject(selectedTransaction.id)} className="flex items-center gap-2">
                Reject <FaTimesCircle />
              </RejectButton>
              <ApproveButton onClick={() => handleApprove(selectedTransaction.id)}className="flex items-center gap-2" >
                Approve <FaCheckCircle />
              </ApproveButton>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TransactionsPanel;

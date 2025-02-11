import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import Select from "react-select"; 
import styled from "styled-components";
import { FaPlusCircle, FaSmile , FaCheckCircle } from "react-icons/fa";

// Mock Data
const mockGroups = [
  { id: 1, name: "Savings Club A", totalFunds: 5000, members: 10, progress: 75, admin: "John Doe" },
  { id: 2, name: "Investment Group B", totalFunds: 12000, members: 8, progress: 50, admin: "Jane Smith" },
];

const mockAdmins = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Michael Brown", label: "Michael Brown" },
  { value: "Alice Green", label: "Alice Green" },
];

// Styled Button Components
const ActionButton = styled.button`
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
  font-size: 14px;
`;

const EditButton = styled(ActionButton)`
  background-color: #0088fe;
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #d9534f;
  color: white;
`;

const ProgressBar = styled.div`
  background-color: #eee;
  border-radius: 5px;
  width: 100%;
  height: 10px;
  position: relative;
  
  div {
    height: 100%;
    border-radius: 5px;
    background-color: ${(props) => (props.value > 70 ? "#28a745" : "#ffc107")};
    width: ${(props) => props.value}%;
  }
`;
const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#d0eaff",
      fontWeight: "bold",
      fontSize: "12px",
    },
  },
};
const GroupsTable = () => {
  const [groups, setGroups] = useState([]);
   const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    totalFunds: "",
    members: "",
    progress: 0,
    admin: null,
  });

  useEffect(() => {
    setGroups(mockGroups);
  }, []);
 
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.admin.toLowerCase().includes(search.toLowerCase()) ||
      group.totalFunds.toString().includes(search)
  );
  
  // Delete Group
  const handleDelete = (id) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  // Submit Form (Add/Edit)
  const handleSubmit = () => {
    if (editGroup) {
      setGroups(groups.map(group => (group.id === editGroup.id ? { ...formData, id: editGroup.id } : group)));
    } else {
      setGroups([...groups, { ...formData, id: groups.length + 1 }]);
    }
    setModalIsOpen(false);
    setEditGroup(null);
    setFormData({ name: "", totalFunds: "", members: "", progress: 0, admin: null });
  };

  // Open Edit Modal
  const openEditModal = (group) => {
    setEditGroup(group);
    setFormData(group);
    setModalIsOpen(true);
  };

  // Table Columns
  const columns = [
    { name: "Id", cell: (row, index) => index + 1, width: "50px" },
    { name: "Group Name", selector: row => row.name, sortable: true },
    { name: "Total Funds (Ksh)", selector: row => `${row.totalFunds}/=`, sortable: true },
    { name: "Members", selector: row => row.members, sortable: true },
    { name: "Progress", cell: row => <ProgressBar value={row.progress}><div /></ProgressBar>, sortable: true },
    { name: "Admin", selector: row => row.admin, sortable: true },
    {
      name: "Actions",
      cell: row => (
        <>
          <EditButton onClick={() => openEditModal(row)}>Edit</EditButton>
          <DeleteButton onClick={() => handleDelete(row.id)}>Delete</DeleteButton>
        </>
      )
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg table">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">Here are the Groups <FaCheckCircle className="text-blue-500"/></h3>

      <div className="flex items-center justify-between">
      <div className="flex items-center justify-between mb-3">
  <input 
    type="text"
    placeholder="Search groups..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded"
  />
</div>

        <button 
          onClick={() => setModalIsOpen(true)}
          className="bg-blue-500 text-white rounded flex items-center gap-1 cursor-pointer add-group"
        >
          Add Group <FaPlusCircle />
        </button>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={filteredGroups} 
        pagination 
        highlightOnHover 
        striped
        customStyles={customStyles}
      />

      {/* Modal for Adding/Editing Groups */}
      <Modal 
        shouldCloseOnOverlayClick={true}
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: { maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "8px" },
          overlay: { backgroundColor: 'rgba(0,0,0,.5)' }
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{editGroup ? "Edit Group" : "Add Group"}</h3>

        {/* Form Fields */}
        <input 
          type="text"
          placeholder="Group Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input 
          type="number"
          placeholder="Total Funds"
          value={formData.totalFunds}
          onChange={(e) => setFormData({ ...formData, totalFunds: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input 
          type="number"
          placeholder="Members"
          value={formData.members}
          onChange={(e) => setFormData({ ...formData, members: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input 
          type="number"
          placeholder="Progress (%)"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        {/* Group Admin Selection */}
        <label className="block text-sm font-semibold mt-2">Select Admin:</label>
        <Select
          options={mockAdmins}
          value={mockAdmins.find(admin => admin.value === formData.admin)}
          onChange={(selectedOption) => setFormData({ ...formData, admin: selectedOption.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end items-center gap-5">
          <button 
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white rounded sc-btn"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-green-500 text-white rounded sc-btn"
          >
            {editGroup ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupsTable;

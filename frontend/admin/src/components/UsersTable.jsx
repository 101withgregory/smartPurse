import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaCheckCircle } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import styled from "styled-components";

// Mock user data
const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Member", status: "Inactive" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Admin", status: "Active" },
  { id: 4, name: "David Wilson", email: "david@example.com", role: "Member", status: "Active" },
];

// Styled Buttons
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

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#d0eaff",
      fontWeight: "bold",
      fontSize: "12px",
    },
  },
};

// UserTable Component
const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Member", status: "Active" });

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  // Function to handle user delete
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Function to handle adding/editing user
  const handleSubmit = () => {
    if (editUser) {
      setUsers(users.map(user => (user.id === editUser.id ? { ...formData, id: editUser.id } : user)));
    } else {
      setUsers([...users, { ...formData, id: users.length + 1 }]);
    }
    setModalIsOpen(false);
    setEditUser(null);
    setFormData({ name: "", email: "", role: "Member", status: "Active" });
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditUser(user);
    setFormData(user);
    setModalIsOpen(true);
  };

  // Filtered Users (Search)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase()) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  );

  // Table Columns
  const columns = [
    { name: "Id", cell: (row, index) => index + 1, width: "50px" },
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Email", selector: row => row.email, sortable: true },
    { 
      name: "Role",
      selector: row => row.role,
      cell: row => (
        <select 
          value={row.role} 
          onChange={(e) => setUsers(users.map(user => user.id === row.id ? { ...user, role: e.target.value } : user))}
          className="border p-1 rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
      ),
      sortable: true
    },
    { 
      name: "Status", 
      selector: row => row.status,
      cell: row => (
        <span style={{ color: row.status === "Active" ? "green" : "red" }}>
          {row.status}
        </span>
      ),
      sortable: true 
    },
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
    <div className="bg-white shadow rounded-lg p-4 table">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">Here are the Users <FaCheckCircle className="text-blue-500"/></h3>
      
      <div className="flex items-center justify-between search-container">
             {/* Search Input */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-2 w-[50%] rounded search-users"
      />

      <button 
        onClick={() => {
            setEditUser(null);  
            setFormData({ name: "", email: "", role: "Member", status: "Active" }); 
            setModalIsOpen(true);
          }}
        className="bg-blue-500 text-white rounded add-user flex items-center gap-1 cursor-pointer"
      >
        Add User <FaPlusCircle/>
      </button>
      </div>
 

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        pagination 
        highlightOnHover 
        striped
        customStyles={customStyles}
      />

      {/* Modal for Adding/Editing User */}
      <Modal 
        shouldCloseOnOverlayClick={true}
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: { maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "8px" },
          overlay:{backgroundColor:'rgba(0,0,0,.5)'}
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{editUser ? "Edit User" : "Add User"}</h3>

        {/* Form Fields */}
        <input 
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input 
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end items-center gap-5">
          <button 
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white rounded mr-2 sc-btn"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-green-500 text-white rounded sc-btn"
          >
            {editUser ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;

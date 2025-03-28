import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/useService";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Member",
  });

  // Fetch Users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const data = await fetchUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Open Modal
  const openModal = (user) => {
    if (user) {
      setEditUser(user);
      setFormData(user);
    } else {
      setEditUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "Member",
      });
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save User (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No token found. Please login.", "error");
        return;
      }

      if (editUser) {
        // Update Existing User
        await updateUser(token, editUser._id, formData);
        setUsers(
          users.map((user) =>
            user._id === editUser._id ? { ...formData, _id: editUser._id } : user
          )
        );
        Swal.fire("Success", "User updated successfully", "success");
      } else {
        // Add New User
        const newUser = await addUser(token, formData);
        setUsers([...users, newUser]);
        Swal.fire("Success", "User added successfully", "success");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire("Error", "Failed to save user", "error");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await deleteUser(token, id);
          setUsers(users.filter((user) => user._id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  // Filter Users
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Table Columns
  const columns = [
    { name: "ID", cell: (row, index) => index + 1, width: "50px" },
    { name: "First Name", selector: (row) => row.firstName, sortable: true },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            onClick={() => openModal(row)}
            className="bg-blue-500 text-white sc-btn rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white sc-btn ml-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-md">
      {/* Search & Add User */}
      <div className="flex justify-between items-center mb-4 padding">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => openModal(null)}
          className="bg-blue-500 text-white gap-3 rounded-md hover:bg-blue-600 flex sc-btn items-center"
        >
          <FaPlusCircle className="mr-2" /> add user
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-10">
          <ClipLoader color="#3b82f6" loading={loading} size={50} />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredUsers} pagination />
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white padding rounded-lg shadow-md w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editUser ? "Edit User" : "Add User"}
            </h2>
            {["firstName", "lastName", "email"].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                type="text"
                className="w-full p-2 border rounded mb-3"
                required
              />
            ))}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="bg-gray-300 text-black sc-btn rounded">Cancel</button>
              <button className="bg-green-500 text-white sc-btn  rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserTable;

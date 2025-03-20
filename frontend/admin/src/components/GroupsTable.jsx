import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import GroupService from "../services/groupService";

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-gray-200 rounded-md">
    <div
      className={`h-full rounded-md ${
        value >= 70 ? "bg-green-500" : "bg-yellow-400"
      }`}
      style={{ width: `${value || 0}%` }}
    />
  </div>
);

const GroupsTable = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalFunds: "",
    createdBy: "",
    visibility: "private",
  });

  // ✅ Fetch groups from backend
  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await GroupService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Swal.fire("Error", "Failed to load groups", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // ✅ Open Modal
  const openModal = (group = null) => {
    setEditGroup(group);
    setFormData({
      name: group?.name || "",
      description: group?.description || "",
      totalFunds: group?.totalFunds || "",
      createdBy: group?.createdBy?._id || "",
      visibility: group?.visibility || "private",
    });
    setIsModalOpen(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditGroup(null);
  };

  // ✅ Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editGroup) {
        await GroupService.updateGroup(editGroup._id, formData);
        Swal.fire("Success", "Group updated successfully", "success");
      } else {
        await GroupService.createGroup(formData);
        Swal.fire("Success", "Group created successfully", "success");
      }
      loadGroups();
      closeModal();
    } catch (error) {
      console.error("Error saving group:", error);
      Swal.fire("Error", "Failed to save group", "error");
    }
  };

  // ✅ Delete Group
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
          await GroupService.deleteGroup(id);
          setGroups(groups.filter((group) => group._id !== id));
          Swal.fire("Deleted!", "Group has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting group:", error);
          Swal.fire("Error", "Failed to delete group", "error");
        }
      }
    });
  };

  // ✅ Search Filter
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Table Columns
  const columns = [
    { name: "ID", cell: (row, index) => index + 1, width: "50px" },
    { name: "Group Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
    { name: "Total Funds (Ksh)", selector: (row) => `Ksh ${row.totalFunds}`, sortable: true },
    { name: "Members", selector: (row) => row.members.length, sortable: true },
    {
      name: "Progress",
      cell: (row) => (
        <ProgressBar value={Math.min((row.totalFunds / 1000) * 100, 100)} />
      ),
      sortable: true,
    },
    {
      name: "Kitty Admin",
      selector: (row) => row.createdBy?.firstName || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
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
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search kittys..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-1/2"
        />
        <button
          onClick={() => openModal(null)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlusCircle /> Add Group
        </button>
      </div>

      {/* ✅ Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-6">
          <ClipLoader color="#3b82f6" loading={loading} size={40} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredGroups}
          pagination
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

      {/* ✅ Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Group Name"
              required
              className="border px-3 py-2 w-full rounded mb-3"
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="border px-3 py-2 w-full rounded mb-3"
            />
            <input
              name="totalFunds"
              value={formData.totalFunds}
              onChange={handleChange}
              placeholder="Total Funds"
              required
              className="border px-3 py-2 w-full rounded mb-3"
            />
            <FaTimes
              className="absolute top-3 right-3 text-gray-700 cursor-pointer"
              onClick={closeModal}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Save Group
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupsTable;

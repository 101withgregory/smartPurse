import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "react-modal";
import Select from "react-select";
import kittyService from "../services/kittyService";

const MySwal = withReactContent(Swal);

const KittyTable = () => {
  const [kitties, setKitties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editKitty, setEditKitty] = useState(null);
  const [formData, setFormData] = useState({
    kittyEmail: "",
    kittyName: "",
    kittyDescription: "",
    kittyType: "",
    beneficiaryNumber: "",
    maturityDate: null,
    kittyAddress: "",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
  if (savedToken) setToken(savedToken);
    loadKitties();
  }, []);

  // Load all kitties
  const loadKitties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await kittyService.getAllKitties(token);
      setKitties(data);
    } catch (error) {
      console.error("Error fetching kitties:", error);
      toast.error("Failed to load kitties.");
    } finally {
      setLoading(false);
    }
  };
  // handle edit
  const handleEdit = (kitty) => {
    setFormData({
      kittyName: kitty.kittyName || "",
      kittyDescription: kitty.kittyDescription || "",
      kittyType: kitty.kittyType || "Rotating Savings",
      beneficiaryNumber: kitty.beneficiaryNumber || "",
      maturityDate: kitty.maturityDate
        ? new Date(kitty.maturityDate).toISOString().split("T")[0]
        : "",
    });
    setEditKitty(kitty._id); // Store the ID for editing
    setIsModalOpen(true);
  };
  
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Modal Open
  const openModal = (kitty = null) => {
    if (kitty) {
      // Opening for Edit
      setEditKitty(kitty._id);
      setFormData({
        kittyName: kitty.kittyName || "",
        kittyDescription: kitty.kittyDescription || "",
        kittyType: kitty.kittyType || "Rotating Savings",
        beneficiaryNumber: kitty.beneficiaryNumber || "",
        maturityDate: kitty.maturityDate
          ? new Date(kitty.maturityDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Opening for Add
      setEditKitty(null);
      setFormData({
        kittyEmail: "",
        kittyName: "",
        kittyDescription: "",
        kittyType: "Rotating Savings",
        beneficiaryNumber: "",
        maturityDate: "",
        kittyAddress: "",
      });
    }
    setIsModalOpen(true);
  };

  // Handle Modal Close
  const closeModal = () => {
    setIsModalOpen(false);
    setEditKitty(null);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
  
      if (editKitty) {
        await kittyService.editKitty(editKitty, formData, token);
        MySwal.fire({
          title: "Success!",
          text: "Kitty updated successfully.",
          icon: "success",
          confirmButtonText: "OK"
        });
      } else {
        await kittyService.createKitty(formData, token);
        MySwal.fire({
          title: "Success!",
          text: "Kitty created successfully.",
          icon: "success",
          confirmButtonText: "OK"
        });
      }
  
      loadKitties();
      closeModal();
    } catch (error) {
      console.error("Error saving kitty:", error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to save kitty.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };
  
  // Handle Delete Kitty
  const handleDelete = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await kittyService.deleteKitty(id, token);
          toast.success("Kitty deleted successfully.");
          loadKitties();
        } catch (error) {
          console.error("Error deleting kitty:", error);
          toast.error("Failed to delete kitty.");
        }
      }
    });
  };
  const handleEditClick = (row) => {
    handleEdit(row); // Prepare form data for editing
    openModal(row); // Open the modal
  };
  // Table Columns
  const columns = [
    { name: "ID", selector: (row) => row._id, sortable: true },
    { name: "Kitty Name", selector: (row) => row.kittyName, sortable: true },
    { name: "Kitty Email", selector: (row) => row.kittyEmail, sortable: true },
    { name: "Description", selector: (row) => row.kittyDescription, sortable: true },
    { name: "Type", selector: (row) => row.kittyType, sortable: true },
    { name: "Beneficiary No.", selector: (row) => row.beneficiaryNumber, sortable: true },
    { name: "Maturity Date", selector: (row) => new Date(row.maturityDate).toLocaleDateString(), sortable: true },
    { 
      name: "Amount Raised", 
      selector: (row) => `Ksh ${row.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      sortable: true 
    }
    
    ,
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <FaEdit
            className="text-blue-500 cursor-pointer"
            onClick={() => handleEditClick(row)}
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
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4 padding">
        <h3 className="text-lg font-semibold">Kitty Management</h3>
        <button
          onClick={() => openModal(null)}
          className="bg-blue-500 text-white sc-btn rounded-md  flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Add Kitty
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-6">
          <ClipLoader color="#3b82f6" loading={loading} size={40} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={kitties}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* ✅ Modal */}
      <Modal 
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
    >
      <h3 className="text-lg font-semibold mb-4">
        {editKitty ? "Edit Kitty" : "Add Kitty"}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Show Email and Address only when adding */}
        {!editKitty && (
          <>
            {/* Kitty Email */}
            <input
              type="email"
              name="kittyEmail"
              placeholder="Kitty Email"
              value={formData.kittyEmail}
              onChange={handleChange}
              required
              className="border rounded-md p-2 w-full"
            />

            {/* Kitty Address */}
            <input
              type="text"
              name="kittyAddress"
              placeholder="Kitty Address"
              value={formData.kittyAddress}
              onChange={handleChange}
              required
              className="border rounded-md p-2 w-full"
            />
          </>
        )}

        {/* Kitty Name */}
        <input
          type="text"
          name="kittyName"
          placeholder="Kitty Name"
          value={formData.kittyName}
          onChange={handleChange}
          required
          className="border rounded-md p-2 w-full"
        />

        {/* Description */}
        <textarea
          name="kittyDescription"
          placeholder="Description"
          value={formData.kittyDescription}
          onChange={handleChange}
          required
          className="border rounded-md p-2 w-full"
        />

        {/* Kitty Type */}
        <Select
          options={[
            { value: "Rotating Savings", label: "Rotating Savings" },
            { value: "Fixed Savings", label: "Fixed Savings" },
            { value: "Flexible Contributions", label: "Flexible Contributions" },
          ]}
          value={
            formData.kittyType
              ? { value: formData.kittyType, label: formData.kittyType }
              : null
          }
          onChange={(option) =>
            setFormData({ ...formData, kittyType: option.value })
          }
          className="w-full"
        />

        {/* Beneficiary Number */}
        <input
          type="number"
          name="beneficiaryNumber"
          placeholder="Beneficiary Number"
          value={formData.beneficiaryNumber}
          onChange={handleChange}
          required
          className="border rounded-md p-2 w-full"
        />

        {/* Maturity Date */}
        <DatePicker
          selected={formData.maturityDate ? new Date(formData.maturityDate) : null}
          onChange={(date) =>
            setFormData({
              ...formData,
              maturityDate: date ? date.toISOString() : null,
            })
          }
          dateFormat="yyyy-MM-dd"
          className="w-full border rounded-md p-2"
          placeholderText="Select Maturity Date"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white sc-btn rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </form>
    </Modal>
    </div>
  );
};

export default KittyTable;

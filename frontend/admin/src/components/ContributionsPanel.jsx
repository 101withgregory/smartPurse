import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import contributionService from "../services/contributionService";
import { ClipLoader } from "react-spinners";

const ContributionsPanel = () => {
  const [contributions, setContributions] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contributions when the component mounts
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await contributionService.getAllContributions(); // Fetch data
        setContributions(data);
        setFilteredContributions(data); // Initially, display all contributions
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, []);

  // Handle approve action
  const handleApprove = async (id) => {
    try {
      console.log("Approving contribution with ID:", id);
      await contributionService.approveContribution(id); // Approve contribution
      setContributions(contributions.filter((contribution) => contribution._id !== id)); // Remove approved contribution from list
      setFilteredContributions(filteredContributions.filter((contribution) => contribution._id !== id));
      Swal.fire("Approved!", "The contribution has been approved.", "success");
    } catch (error) {
      console.error("Error approving contribution:", error);
      Swal.fire("Error!", "There was an issue approving the contribution.", "error");
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    // Confirm delete action with SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await contributionService.deleteContribution(id); // Delete contribution
          setContributions(contributions.filter((contribution) => contribution.id !== id)); // Remove deleted contribution from list
          setFilteredContributions(filteredContributions.filter((contribution) => contribution.id !== id));
          Swal.fire("Deleted!", "The contribution has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting contribution:", error);
          Swal.fire("Error!", "There was an issue deleting the contribution.", "error");
        }
      }
    });
  };

  // Format amount as Ksh and add comma separation
  const formatAmount = (amount) => {
    return "Ksh " + amount.toLocaleString(); // Formats amount with commas
  };

  // Filter contributions based on search query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredContributions(contributions);
    } else {
      const filtered = contributions.filter((contribution) =>
        contribution.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredContributions(filtered);
    }
  };

  // Column definitions for the DataTable
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Show sequential ID (1, 2, 3, ...)
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },{
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },{
      name: "KittyAddress",
      selector: (row) => row.kittyAddress,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => formatAmount(row.amount),
      sortable: true,
    },
    {
      name: "Contribution Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color:
              row.status === "approved"
                ? "#28a745" 
                : row.status === "deleted"
                ? "#dc3545" 
                : "#6c757d", 
          }}
        >
          {row.status}
        </span>
      ),
    }
    
    ,
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleApprove(row._id)}
            className="approve-btn bg-green-500 text-white sc-btn rounded hover:bg-green-600 transition"
            title="Approve Contribution"
          >
            <FaCheckCircle />
         
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="delete-btn bg-red-500 text-white sc-btn ml-2 rounded hover:bg-red-600 transition"
            title="Delete Contribution"
          >
            <FaTrash />
          
          </button>
        </div>
      ),
    },
  ];

  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="loading-spinner flex justify-center">
        <ClipLoader color="#000" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="contributions-panel padding">
      <h2>Contributions</h2>
      {/* Search input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by Name"
        className="search-input w-[50%]"
      />
      <DataTable
        columns={columns}
        data={filteredContributions}
        pagination
        highlightOnHover
        pointerOnHover
        noDataComponent="No contributions available"
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#f4f4f4",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
      />
    </div>
  );
};

export default ContributionsPanel;

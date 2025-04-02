import axios from "axios";

const API_URL = "http://localhost:5000/api/contributions";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject the token into the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all contributions (Admin only)
const getAllContributions = async (groupId = null) => {
  const response = await axiosInstance.get("/", {
    params: { groupId },
  });
  return response.data;
};

// Get a single contribution by ID
const getContributionById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

// Approve a contribution (Admin only)
const approveContribution = async (id) => {
console.log("Approving contribution with ID:", id);
  const response = await axiosInstance.put(`/${id}/approve`);
  return response.data;
};

// Delete a contribution (Admin only)
const deleteContribution = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

// Get pending contributions (Admin only)
const getPendingContributions = async (groupId = null) => {
  const response = await axiosInstance.get("/pending", {
    params: { groupId },
  });
  return response.data;
};

const contributionService = {
  getAllContributions,
  getContributionById,
  approveContribution,
  deleteContribution,
  getPendingContributions,
};

export default contributionService;

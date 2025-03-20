import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token into the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a new transaction
const createTransaction = async (transactionData) => {
  const response = await axiosInstance.post('/', transactionData);
  return response.data;
};

// Get all transactions (Admin only)
const getAllTransactions = async (groupId = null) => {
  const response = await axiosInstance.get('/', {
    params: { groupId },
  });
  return response.data;
};

// Get a single transaction by ID
const getTransactionById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

// Update a transaction
const updateTransaction = async (id, transactionData) => {
  const response = await axiosInstance.put(`/${id}`, transactionData);
  return response.data;
};

// Delete a transaction (Admin only)
const deleteTransaction = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

// Flag a transaction (Admin only)
const flagTransaction = async (id, flagReason) => {
  const response = await axiosInstance.put(`/${id}/flag`, { flagReason });
  return response.data;
};

// Unflag a transaction (Admin only)
const unflagTransaction = async (id) => {
  const response = await axiosInstance.put(`/${id}/unflag`);
  return response.data;
};

// Get flagged transactions (Admin only)
const getFlaggedTransactions = async (groupId = null) => {
  const response = await axiosInstance.get('/flagged', {
    params: { groupId },
  });
  return response.data;
};

// Update transaction status (Admin only)
const updateTransactionStatus = async (id, status) => {
  const response = await axiosInstance.put(`/${id}/status`, { status });
  return response.data;
};

const transactionService = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  flagTransaction,
  unflagTransaction,
  getFlaggedTransactions,
  updateTransactionStatus,
};

export default transactionService;

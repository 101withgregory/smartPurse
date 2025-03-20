import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

// ✅ Fetch dashboard summary data
const getDashboardSummary = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_URL}/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Fetch savings chart data
const getSavingsChartData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_URL}/savings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Fetch contributions chart data
const getContributionsChartData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_URL}/contributions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Export all services
const dashboardSummaryService = {
  getDashboardSummary,
  getSavingsChartData,
  getContributionsChartData,
};

export default dashboardSummaryService;

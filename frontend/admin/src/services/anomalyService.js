import axios from "axios";

const API_URL = "http://localhost:5000/api/anomalies"; // Adjust to your backend URL

// Fetch all anomalies
const getAllAnomalies = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching anomalies:", error);
    throw error;
  }
};

// Get anomaly by ID
const getAnomalyById = async (anomalyId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${anomalyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching anomaly ${anomalyId}:`, error);
    throw error;
  }
};

// Create a new anomaly
const createAnomaly = async (anomalyData, token) => {
  try {
    const response = await axios.post(API_URL, anomalyData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating anomaly:", error);
    throw error;
  }
};

// Update anomaly status (e.g., review or resolve)
const updateAnomalyStatus = async (anomalyId, status, resolutionNotes, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${anomalyId}`,
      { status, resolutionNotes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating anomaly ${anomalyId}:`, error);
    throw error;
  }
};

// Delete an anomaly
const deleteAnomaly = async (anomalyId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${anomalyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting anomaly ${anomalyId}:`, error);
    throw error;
  }
};

const anomalyService = {
  getAllAnomalies,
  getAnomalyById,
  createAnomaly,
  updateAnomalyStatus,
  deleteAnomaly,
};

export default anomalyService;

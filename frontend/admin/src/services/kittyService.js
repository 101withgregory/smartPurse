import axios from "axios";

const API_URL = "http://localhost:5000/api/kittys";

// Get all kitties (Admin or User)
const getAllKitties = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
const editKitty = async (id, kittyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, kittyData, config);
  return response.data;
};


//  Get kitties created by current user
const getKittiesByUser = async (token) => {
  const response = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get a single kitty by ID
const getKittyById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new kitty
const createKitty = async (kittyData, token) => {
  const response = await axios.post(API_URL, kittyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Join a kitty
const joinKitty = async (kittyId, token) => {
  const response = await axios.post(
    `${API_URL}/join`,
    { kittyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Payout Kitty
const payoutKitty = async (kittyId, token) => {
  const response = await axios.post(
    `${API_URL}/payout`,
    { kittyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Handle Rotating Payout
const handleRotatingPayout = async (kittyId, token) => {
  const response = await axios.post(
    `${API_URL}/payout/rotating`,
    { kittyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Handle Fixed Payout
const handleFixedPayout = async (kittyId, token) => {
  const response = await axios.post(
    `${API_URL}/payout/fixed`,
    { kittyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Handle Flexible Withdrawal
const handleFlexibleWithdrawal = async (kittyId, amount, token) => {
  const response = await axios.post(
    `${API_URL}/withdraw`,
    { kittyId, amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Delete a kitty
const deleteKitty = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const kittyService = {
  getAllKitties,
  editKitty,
  getKittiesByUser,
  getKittyById,
  createKitty,
  joinKitty,
  payoutKitty,
  handleRotatingPayout,
  handleFixedPayout,
  handleFlexibleWithdrawal,
  deleteKitty,
};

export default kittyService;

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/groups';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const GroupService = {
  getGroups: async () => {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createGroup: async (data) => {
    const response = await axios.post(API_URL, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateGroup: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteGroup: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default GroupService;

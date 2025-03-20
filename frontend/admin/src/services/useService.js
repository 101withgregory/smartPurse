const API_URL = "http://localhost:5000/api/users"; // Backend route for users

// ✅ 1. Fetch Users
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// ✅ 2. Add New User
export const addUser = async (token, data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add user");
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// ✅ 3. Update User
export const updateUser = async (token, userId, data) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ✅ 4. Delete User
export const deleteUser = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ✅ 5. Get Single User
export const getUserById = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to get user");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

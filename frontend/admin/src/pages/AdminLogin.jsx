import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      login(data.token);
      Swal.fire("Success", "Logged in successfully", "success");

      // ✅ Redirect to the last visited page or dashboard
      navigate(location.state?.from?.pathname || "/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-3 mb-3 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

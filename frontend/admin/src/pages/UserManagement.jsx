import { Routes, Route, Outlet } from "react-router-dom";

const UserManagement = () => {
  return (
    <div>
      <h2>User Management</h2>
      <Outlet /> 
    </div>
  );
};

export default UserManagement;

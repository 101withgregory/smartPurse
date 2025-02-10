import { Routes, Route, Outlet } from "react-router-dom";
import UsersTable from "../components/UsersTable";

const UserManagement = () => {
  return (
    <div className="p-4">
       <UsersTable/>
    </div>
  );
};

export default UserManagement;

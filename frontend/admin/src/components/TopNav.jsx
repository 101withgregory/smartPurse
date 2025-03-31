import { FiBell, FiSettings, FiUser, FiSearch, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import NotificationBell from "./NotificationBell";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopNav = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    toast.success("Logged out successfully");
    navigate("/admin/login"); // Redirect to login
  };

  return (
    <nav className="topnav flex items-center justify-between">
      {/* Left Section */}
      <div className="topnav-left">
        <h3 className="text-gray-400">Overview</h3>
      </div>

      

      {/* Right Section */}
      <div className="topnav-right flex items-center gap-8">
        <NotificationBell />

        {/* Settings Icon
        <button className="icon-btn text-2xl hover:text-gray-400 cursor-pointer">
          <FiSettings />
        </button> */}

        {/* Profile Icon */}
        <div className="profile flex flex-col items-center hover:text-gray-400 cursor-pointer">
          <FiUser className="profile-icon text-2xl" />
          <span>Admin</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-1 text-gray-600 hover:text-red-400 text-[18px] cursor-pointer">
          <FiLogOut />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopNav;

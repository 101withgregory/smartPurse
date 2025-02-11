import { FiBell, FiSettings, FiUser, FiSearch } from "react-icons/fi";
import "../index.css";
import TextField from '@mui/material/TextField';
import NotificationBell from "./NotificationBell";
const TopNav = () => {
  return (
    <nav className="topnav flex items-center justify-between">
      <div className="topnav-left">
        <h3 className="text-gray-400">Overview</h3>
      </div>
      <div className="topnav-center">
        <div className="search-box flex items-center gap-2 p-5">
          
            {/* <TextField
          id="standard-search"
          label="Search"
          type="search"
          variant="standard"
          className=""
        /> <FiSearch className="text-gray-600 hover:text-gray-300 text-[20px] cursor-pointer"/> */}
        
        </div>
      </div>
      <div className="topnav-right  flex items-center gap-8">
        <NotificationBell/>
        <button className="icon-btn text-2xl hover:text-gray-400 cursor-pointer">
          <FiSettings />
        </button>
        <div className="profile flex flex-col items-center hover:text-gray-400 cursor-pointer ">
          <FiUser className="profile-icon text-2xl" />
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
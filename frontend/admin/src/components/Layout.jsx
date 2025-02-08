import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import "../index.css";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <TopNav />
        <div className="main-content">
           <div className="content">
          <Outlet />
        </div> 
        </div>
    </div>
  );
};

export default Layout;

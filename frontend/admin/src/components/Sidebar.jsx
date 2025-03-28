import { NavLink, useLocation } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import { FaSignOutAlt, FaArrowDown } from "react-icons/fa";
import { useState } from "react";
import menuItems from "../utils/menuItems";
import { MdArrowDropDown } from "react-icons/md";
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleNavClick = (path) => {
    setActive(path);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} relative overflow-y-scroll p-2 overflow-x-hidden flex flex-col justify-around`}>
      <div className="sidebar-header flex justify-between items-center">
        {!isCollapsed && (
          <h2 className="vaultfund-logo">Smart<span className="text-blue-500">Purse</span></h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="sidebar-btn text-[20px] hover:text-gray-400 text-center"
        >
          <FiSidebar />
        </button>
      </div>

      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            {item.children ? (
              <div>
                <button className={`menu-button flex items-center gap-2 menu-link ${active === item.path ? "active" : ""} text-nowrap`} onClick={() => toggleDropdown(index)}>
                  <item.icon className="text-[20px]" />
                  {!isCollapsed && <span>{item.name}</span>}
                  <MdArrowDropDown className="text-[20px]"/>
                </button>
                {openDropdown === index && !isCollapsed && (
                  <div className="dropdown">
                    {item.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.path}
                        className={`menu-link ${active === child.path ? "active" : ""}`}
                        onClick={() => handleNavClick(child.path)}
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={`menu-link ${active === item.path ? "active" : ""} text-nowrap`}
                onClick={() => handleNavClick(item.path)}
              >
                <item.icon className="text-[20px] mr-2" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className=" p-4 flex items-center">
        <button className="logout-button flex items-center gap-2  hover:text-green-600  cursor-pointer">
          <FaSignOutAlt className="text-[20px] ml-2"/>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
        
     
    </aside>
  );
};

export default Sidebar;

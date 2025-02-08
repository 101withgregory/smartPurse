import { FaCreditCard, FaFile, FaUsers, FaHeadset, FaHome, FaUser } from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", path: "/", icon: FaHome },
  {
    name: "User Management",
    path: "/user-management",
    icon: FaUser,
    children: [
      { name: "View Users", path: "/user-management/view" },
      { name: "Add User", path: "/user-management/add" }
    ]
  },
  { name: "Group Management", path: "/group-management", icon: FaUsers },
  { name: "Transactions", path: "/transactions", icon: FaCreditCard },
  { name: "Anomaly Reports", path: "/reports", icon: FaFile },
  { name: "Support ", path: "/support", icon: FaHeadset },
];

export default menuItems;

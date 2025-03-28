import { FaCreditCard, FaFile, FaUsers, FaHeadset, FaHome, FaUser , FaPiggyBank ,FaMoneyBill} from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", path: "/", icon: FaHome },
  { name: "User Management", path: "/user-management", icon: FaUser },
  { name: "Kitty Management", path: "/kitty-management", icon: FaPiggyBank },
  { name: "Transactions", path: "/transactions", icon: FaCreditCard },
  { name: "Anomaly Reports", path: "/reports", icon: FaFile },
  { name: "Support", path: "/admin/support", icon: FaHeadset },
];


export default menuItems;

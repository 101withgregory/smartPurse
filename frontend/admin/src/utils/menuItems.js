import { FaCreditCard, FaFile, FaUsers, FaHeadset, FaHome, FaUser , FaPiggyBank ,FaMoneyBill} from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
  { name: "User Management", path: "user-management", icon: FaUser },
  { name: "Kitty Management", path: "kitty-management", icon: FaPiggyBank },
  { name: "Contributions", path: "contributions", icon: FaMoneyBill },
  { name: "Transactions", path: "transactions", icon: FaCreditCard },
  { name: "Anomaly Reports", path: "reports", icon: FaFile },
  { name: "Support", path: "support", icon: FaHeadset },
];


export default menuItems;

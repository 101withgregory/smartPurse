// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { token } = useAuth();

//   if (!token) {
//     return <Navigate to="/admin/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./utils/ProtectedRoute";
// import Layout from "./components/Layout";
// import UserManagement from "./pages/UserManagement";
// import Transactions from "./pages/Transactions";
// import Reports from "./pages/Reports";
// import GroupManagement from "./pages/GroupManagement";
// import Support from "./pages/Support";
// import Dashboard from "./pages/Dashboard";
// import AdminLogin from "./pages/AdminLogin";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* ✅ Admin Login Route */}
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* ✅ Protected Routes for Admin */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <Layout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="user-management" element={<UserManagement />} />
//             <Route path="transactions" element={<Transactions />} />
//             <Route path="group-management" element={<GroupManagement />} />
//             <Route path="reports" element={<Reports />} />
//             <Route path="support" element={<Support />} />
//           </Route>

//           {/* ✅ Redirect to Login if Route Not Found */}
//           <Route path="*" element={<Navigate to="/admin/login" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;

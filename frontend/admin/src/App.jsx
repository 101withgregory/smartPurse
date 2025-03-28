import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserManagement from "./pages/UserManagement";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import Kittys from "./pages/Kittys";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard/>} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="kitty-management" element={<Kittys/>} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./utils/ProtectedRoute";
// import Layout from "./components/Layout";
// import UserManagement from "./pages/UserManagement";
// import Transactions from "./pages/Transactions";
// import Reports from "./pages/Reports";
// import Kittys from "./pages/Kittys";
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
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute>
//                 {console.log("App → Protected Route Accessed")}
//                 <Layout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="user-management" element={<UserManagement />} />
//             <Route path="transactions" element={<Transactions />} />
// <Route path="kitty-management" element={<Kittys/>} />
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

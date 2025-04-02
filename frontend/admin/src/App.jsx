import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./components/Layout";
import UserManagement from "./pages/UserManagement";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Kittys from "./pages/Kittys";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import Contributions from "./pages/Contributions";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="kitty-management" element={<Kittys />} />
            <Route path="contributions" element={<Contributions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Redirect Unmatched Routes to Login */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

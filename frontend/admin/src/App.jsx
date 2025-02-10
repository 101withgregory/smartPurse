import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserManagement from "./pages/UserManagement";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import GroupManagement from "./pages/GroupManagement";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard/>} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="group-management" element={<GroupManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;

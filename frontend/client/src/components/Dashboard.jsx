import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaClipboardList } from "react-icons/fa";
import AdminTrack from "./AdminTrack";
import HomeAdmin from "./HomeAdmin";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Home");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const components = {
    Home: <HomeAdmin />,
    Orders: <AdminTrack />,
  };

  const navIcons = {
    Home: <FaHome />,
    Orders: <FaClipboardList />,
  };

  const handleAuthentication = () => {
    if (password === "Vibrant@25") {
      setAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <h2 className="mb-4">Enter Dashboard Password</h2>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAuthentication}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Left Side Navigation */}
      <div
        className="d-flex flex-column bg-primary text-white p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h3 className="text-center mb-4 d-none d-md-block">Dashboard</h3>
        <nav className="nav flex-column">
          {Object.keys(components).map((key) => (
            <button
              key={key}
              className={`btn text-white mb-2 d-flex align-items-center ${
                activeComponent === key ? "btn-dark" : "btn-primary"
              }`}
              onClick={() => setActiveComponent(key)}
              style={{ paddingLeft: "10px" }}
            >
              <span>{navIcons[key]}</span>
              <span className="d-none d-md-inline ms-2">{key}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto text-center d-none d-md-block">
          <p className="small mb-0">&copy; Beta Softwares</p>
        </div>
      </div>

      {/* Right Side Content */}
      <div
        className="flex-grow-1"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        {/* Header */}
        <div className="bg-light p-3 border-bottom">
          <h2 className="mb-0">Admin</h2>
        </div>

        {/* Main Content */}
        <div className="p-4">{components[activeComponent]}</div>
      </div>
    </div>
  );
};

export default Dashboard;

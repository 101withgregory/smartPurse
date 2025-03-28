import React, { useState } from "react";
import "./header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="containerB">
      <nav className="navbar">
        <div className="navbar-logo">Vault Fund</div>
        <button
          className={`menu-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span className={`menu-icon ${isOpen ? "open" : ""}`}>
            {isOpen ? "✖" : "☰"}
          </span>
        </button>
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="about">About</a>
          </li>
          <li>
            <a href="services">Services</a>
          </li>
          <li>
            <a href="contact">Contact</a>
          </li>
          <li>
            <a href="my_kitties">My Kitties</a>
          </li>
          <li>
            <a
              href="/kitty"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#ddd",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Create A Kitty
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;

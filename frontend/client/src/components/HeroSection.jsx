import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import introImage from "../images/main4.png";

const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  return (
    <section
      className="hero-section text-white d-flex align-items-center"
      style={{
        height: "100vh",
        backgroundImage: `url(${introImage})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Baby Blue Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(52, 78, 87, 0.5)", // Baby blue overlay
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div
        className="container text-left"
        style={{ zIndex: 2, maxWidth: "600px" }}
      >
        <h2
          className="display-5 mb-3"
          style={{
            animation: "fadeInDown 2s ease",
            fontWeight: "normal",
            color: "#fff",
          }}
        >
          Secure, Transparent, and Smarter Group Savings
        </h2>
        <p
          className="lead mb-4"
          style={{ animation: "fadeIn 2s ease", color: "white" }}
        >
          Join VaultFund and take control of your financial future.
        </p>
        <button
          className="btn btn-primary btn-lg px-5 me-3"
          style={{ animation: "zoomIn 2s ease" }}
          onClick={() => navigate("/kitty")}
        >
          Create A Kitty
        </button>
        <button
          className="btn btn-lg px-5"
          style={{
            animation: "zoomIn 2s ease",
            outline: "2px solid #fff",
            borderColor: "#fff",
            color: "white",
          }}
          onClick={() => navigate("/contribute")}
        >
          Contribute
        </button>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

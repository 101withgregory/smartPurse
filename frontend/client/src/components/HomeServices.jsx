import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

import wellDrillingImage from "../images/1.png";
import boreholeMaintenanceImage from "../images/2.png";
import waterConsultancyImage from "../images/3.png";

const HomeServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const services = [
    {
      title: "Real-Time Financial Tracking",
      description:
        "Get live insights, generate reports, and stay informed with automated financial tracking.",
      image: wellDrillingImage,
    },
    {
      title: "Group Savings Management",
      description:
        "Easily track and manage group contributions with automated reminders and transparent records.",
      image: boreholeMaintenanceImage,
    },
    {
      title: "Fraud Detection & Security",
      description:
        "AI-powered anomaly detection ensures secure transactions and protects against fraud.",
      image: waterConsultancyImage,
    },
  ];

  return (
    <div>
      {/* Services Section */}
      <section
        className="container-fluid py-5"
        data-aos="fade-up"
        style={{
          background: `linear-gradient(270deg, #ebf8ff, #f3ebff, #fffceb)`,
          backgroundSize: "600% 600%",
          animation: "gradientAnimation 8s ease infinite",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#058fc3" }}>
          Our Services
        </h2>
        <p className="text-center mb-5"></p>
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="card shadow-sm border-0 h-100"
                style={{
                  backgroundColor: "#ffffff", // White background for cards
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body text-center">
                  <h5
                    className="card-title fw-bold"
                    style={{ color: "#058fc3" }}
                  >
                    {service.title}
                  </h5>
                  <p className="card-text">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gradient Animation CSS */}
      <style>
        {`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomeServices;

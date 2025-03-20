import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Import your local images
import introImage from "../images/main2.png";
import wellDrillingImage from "../images/1.png";
import boreholeMaintenanceImage from "../images/2.png";
import waterConsultancyImage from "../images/3.png";

const Services = () => {
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
    <div style={{ backgroundColor: "#e2dfdf" }}>
      {/* Introduction Section */}
      <section
        className="d-flex align-items-center justify-content-center text-center text-white bg-dark"
        style={{
          height: "60vh",
          backgroundImage: `url(${introImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <h1 className="display-4 fw-bold">Easily save & manage funds</h1>
          <p className="lead mt-3">
            Take Control of Your Group’s Financial Future
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-5" data-aos="fade-up">
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
                  backgroundColor: "#fff", // Light gray background
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
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{service.title}</h5>
                  <p className="card-text">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

import introImage from "../images/main3.png";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      {/* Introduction Section */}
      <section
        className="d-flex align-items-center justify-content-center text-center text-white bg-dark"
        style={{
          height: "50vh",
          backgroundImage: `url(${introImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <h1 className="display-4 fw-bold" style={{ color: "#fff" }}>
            About Us
          </h1>
          <p className="lead mt-3" style={{ color: "#fff" }}>
            Access and manage your funds anytime, anywhere
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container py-5" data-aos="fade-up">
        <div className="row">
          <div className="col-12 position-relative">
            {[
              {
                title: "Our Vision",
                text: `At <strong>VaultFund</strong>, our vision is to revolutionize group savings and investment management. We aim to empower communities and organizations with seamless, secure, and transparent financial solutions that drive economic growth and financial inclusion.`,
                color: "#FF6F61",
              },
              {
                title: "Who We Are",
                text: `VaultFund is a fintech platform designed to simplify and secure group savings, investments, and fund management. With cutting-edge technology and a user-first approach, we ensure that every financial transaction is efficient, transparent, and secure.`,
                color: "#FFD700",
              },
              {
                title: "Our Expertise",
                text: `We specialize in AI-powered fraud detection, automated financial tracking, and seamless payment integrations. Our platform is built to help communities and businesses manage their funds with confidence and efficiency.`,
                color: "#00C6FF",
              },
              {
                title: "Our Commitment",
                text: `At VaultFund, we are committed to financial empowerment, security, and transparency. Our goal is to provide reliable tools that help users build trust, grow their savings, and make smarter investment decisions.`,
                color: "#6A5ACD",
              },
              {
                title: "Why Choose Us",
                text: `Choosing VaultFund means partnering with a platform that values trust, security, and innovation. We provide a streamlined experience for managing group funds, ensuring financial success for all members.`,
                color: "#32CD32",
              },
            ].map((section, index) => (
              <div className="d-flex align-items-start mb-5" key={index}>
                {/* Circle and Line */}
                <div className="d-flex flex-column align-items-center me-3">
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: section.color,
                      borderRadius: "50%",
                    }}
                  ></div>
                  {index < 4 && (
                    <div
                      style={{
                        width: "4px",
                        height: "100px",
                        background: `linear-gradient(${section.color}, ${
                          ["#FFD700", "#00C6FF", "#6A5ACD", "#32CD32"][
                            index + 1
                          ] || section.color
                        })`,
                      }}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-3" style={{ color: "#058fc3" }}>
                    {section.title}
                  </h3>
                  <p
                    className="text-muted fs-5"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  ></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

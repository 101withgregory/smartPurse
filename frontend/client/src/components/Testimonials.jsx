import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  const testimonials = [
    {
      name: "Emily Carter",
      text: "VaultFund has completely transformed our savings group. Managing contributions and tracking expenses has never been easier!",
    },
    {
      name: "Daniel Ochieng",
      text: "The fraud detection system gives us peace of mind. Our group funds are secure and well-managed.",
    },
    {
      name: "Sophia Martinez",
      text: "I love how transparent VaultFund is. Every member can see transactions in real-time, ensuring trust and accountability.",
    },
    {
      name: "James Mwaura",
      text: "VaultFund's automated reminders have helped us stay on track with our savings goals. Highly recommended!",
    },
    {
      name: "Linda Johnson",
      text: "The investment tracking feature is a game-changer. We can now monitor our group investments with ease.",
    },
    {
      name: "Michael Adeyemi",
      text: "Seamless payments and easy fund transfers make VaultFund the perfect platform for community savings.",
    },
  ];

  return (
    <section className="py-5 bg-light" data-aos="fade-up">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#058fc3" }}>
          What Our Users Say
        </h2>
        <div
          id="testimonialCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-inner">
            {testimonials.map((testimonial, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card shadow-sm border-0 text-center"
                    style={{ maxWidth: "600px" }}
                  >
                    <div className="card-body">
                      <p className="card-text fs-5 text-muted">
                        "{testimonial.text}"
                      </p>
                      <h5 className="fw-bold mt-3">{testimonial.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <i className="fas fa-chevron-left fs-3 text-dark"></i>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <i className="fas fa-chevron-right fs-3 text-dark"></i>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

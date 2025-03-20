import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import introImage from "../images/main2.png";

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
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
          <h1 className="display-4 fw-bold">Empowering Communities</h1>
          <p className="lead mt-3">One Contribution at a Time</p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="container py-5" data-aos="fade-up">
        <h2 className="text-center mb-4">Contact Us</h2>
        <div className="row g-4">
          {/* Contact Details */}
          <div className="col-md-6">
            <h4>Our Office</h4>
            <p>
              <strong>Address:</strong> Karen, Nairobi, Kenya
            </p>
            <p>
              <strong>Phone:</strong> +254 712 405 172
            </p>
            <p>
              <strong>Email:</strong> info@vaultfund.co.ke
            </p>
            <p>
              <strong>Hours:</strong> Mon - Sat: 8:00 AM - 5:00 PM
            </p>
          </div>

          {/* Google Map */}
          <div className="col-md-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.079485120296!2d36.710937879450136!3d-1.3175917481585947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a2d2b2d849b%3A0x2d7a44e7113a9d0a!2sKaren%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1685489123456!5m2!1sen!2ske"
              width="100%"
              height="300"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

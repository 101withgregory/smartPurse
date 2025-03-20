import React, { useEffect, useState, useRef } from "react";
import { footer } from "../Data";
import "./footer.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={`footerContact ${isVisible ? "animate" : ""}`}
      >
        <div className="container">
          <div className="send flex">
            <div className={`text ${isVisible ? "fade-in" : ""}`}>
              <span>Do You Have Questions?</span>
              <p>We'll help you get answers.</p>
            </div>
            <a
              href={`https://wa.me/254794930049?text=${encodeURIComponent(
                "Hello customer care @Vibrant Water Drilling Company, I have visited your website and I need your assistance."
              )}`}
              className={`btn5 ${isVisible ? "slide-in" : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "#fff",
                backgroundColor: "#058fc3",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="box">
            <div className="logo">
              <img src="../images/logo-light.png" alt="" />
              <h2>Do You Need Help With Anything?</h2>
              <p>
                Receive updates, hot deals, tutorials, discounts sent straignt
                in your inbox every month
              </p>

              <div className="input flex">
                <input type="text" placeholder="Email Address" />
                <button className="btn6">Subscribe</button>
              </div>
            </div>
          </div>

          {footer.map((val) => (
            <div className="box">
              <h3>{val.title}</h3>
              <ul>
                {val.text.map((items) => (
                  <li> {items.list} </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className="legal">
        <span>© {currentYear}. Beta Softwares.</span>
      </div>
    </>
  );
};

export default Footer;

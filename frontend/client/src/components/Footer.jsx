import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h3 className="fw-bold text-black">
              <span className="text-primary">Vault</span>fund
            </h3>
            <p className="mt-3 text-muted">
              An innovative fintech web-based application designed to enhance
              group savings and investment management for community savings
              groups, clubs, and informal investment circles.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="btn btn-dark rounded-circle p-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="btn btn-dark rounded-circle p-2">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-dark rounded-circle p-2">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-dark rounded-circle p-2">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2">
            <h6 className="text-uppercase text-secondary">Company</h6>
            <ul className="list-unstyled mt-3">
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Career
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2">
            <h6 className="text-uppercase text-secondary">Help</h6>
            <ul className="list-unstyled mt-3">
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Delivery Details
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h6 className="text-uppercase text-secondary">
              Subscribe to Newsletter
            </h6>
            <form className="mt-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <button type="submit" className="btn btn-primary w-100 mt-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-4" />

        <p className="text-center text-muted">
          © Copyright 2025, All Rights Reserved by VaultFund
        </p>
      </div>
    </section>
  );
};

export default Footer;

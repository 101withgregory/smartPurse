import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

const Kitty = () => {
  const navigate = useNavigate();
  const [kittyName, setKittyName] = useState("");
  const [kittyDescription, setKittyDescription] = useState("");
  const [kittyType, setKittyType] = useState("Rotating Savings");
  const [beneficiaryNumber, setBeneficiaryNumber] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [contributionLink, setContributionLink] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const uniqueId = uuidv4();
    const link = `http://localhost:3000/contribute/${uniqueId}`;
    setContributionLink(link);
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contributionLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h3 className="text-center text-primary">Create a Kitty</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Kitty Name</label>
            <input
              type="text"
              className="form-control"
              value={kittyName}
              onChange={(e) => setKittyName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kitty Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={kittyDescription}
              onChange={(e) => setKittyDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Kitty Type</label>
            <select
              className="form-select"
              value={kittyType}
              onChange={(e) => setKittyType(e.target.value)}
              required
            >
              <option value="Rotating Savings">Rotating Savings (ROSCA)</option>
              <option value="Fixed Savings">
                Fixed Savings (Fixed Contributions with Payout at End)
              </option>
              <option value="Flexible Contributions">
                Flexible Contributions
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Beneficiary Number</label>
            <input
              type="number"
              className="form-control"
              value={beneficiaryNumber}
              onChange={(e) => setBeneficiaryNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kitty Maturity Date</label>
            <input
              type="date"
              className="form-control"
              value={maturityDate}
              onChange={(e) => setMaturityDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create Kitty
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kitty Created Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>{kittyName}</h5>
          <p>Share this link with people to contribute:</p>
          <div className="alert alert-success">
            <p className="mb-0">
              <a
                href={contributionLink}
                className="text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                {contributionLink}
              </a>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={handleCopy}>
            Copy Link
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Kitty;

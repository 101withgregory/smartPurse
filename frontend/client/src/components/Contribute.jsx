import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Contribute = () => {
  const { kittyAddress: urlKittyAddress } = useParams();
  const [kittyAddress, setKittyAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [payingNumber, setPayingNumber] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);

  useEffect(() => {
    if (urlKittyAddress) {
      setKittyAddress(urlKittyAddress);
    }
  }, [urlKittyAddress]);

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleMpesaPayment = () => {
    setShowMpesaModal(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div
        className="alert alert-info text-center"
        style={{ fontWeight: "bold" }}
      >
        M-Pesa Till No: 8853944
      </div>
      <h2 className="text-center mb-4" style={{ color: "#058fc3" }}>
        Contribute to Kitty
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Kitty Address</label>
          <input
            type="text"
            className="form-control"
            value={kittyAddress}
            onChange={(e) => setKittyAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount (KES)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Transaction Ref.</label>
          <input
            type="text"
            className="form-control"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-success w-100 mb-2"
          onClick={handleSubmit}
        >
          Submit Contribution
        </button>
        <button
          type="button"
          className="btn btn-primary w-100"
          style={{ backgroundColor: "#058fc3", borderColor: "#058fc3" }}
          onClick={handleMpesaPayment}
        >
          Pay with M-Pesa Prompt
        </button>
      </form>
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Successfully contributed pending approval.
              </div>
            </div>
          </div>
        </div>
      )}
      {/* M-Pesa Payment Modal */}
      {showMpesaModal && (
        <div
          className="modal"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">M-Pesa Payment</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowMpesaModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Kitty Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={kittyAddress}
                    onChange={(e) => setKittyAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Paying Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={payingNumber}
                    onChange={(e) => setPayingNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount (KES)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setShowMpesaModal(false)}
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contribute;

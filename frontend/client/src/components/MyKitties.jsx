import React from "react";

const MyKitties = () => {
  const kitties = [
    {
      address: "5efccac2-1b88-43cb-8b58-0ffec77c142d",
      name: "Education Fund",
      amountRaised: "KES 50,000",
      maturityDate: "2025-12-31",
    },
    {
      address: "3abccba1-2c34-4dab-91ef-8fe982be2143",
      name: "Medical Fund",
      amountRaised: "KES 30,000",
      maturityDate: "2025-10-15",
    },
    {
      address: "7ghijk12-34lm-56no-78pq-90rstuvwxyza",
      name: "Business Startup",
      amountRaised: "KES 75,000",
      maturityDate: "2026-03-20",
    },
    {
      address: "9bcdef34-56gh-78ij-90kl-mnopqrstuvwx",
      name: "Emergency Fund",
      amountRaised: "KES 20,000",
      maturityDate: "2025-08-10",
    },
  ];

  const contributions = Array.from({ length: 10 }, (_, index) => ({
    name: `Contributor ${index + 1}`,
    email: `contributor${index + 1}@example.com`,
    amount: `KES ${Math.floor(Math.random() * 10000) + 1000}`,
    transactionRef: `TX${Math.floor(Math.random() * 100000)}`,
  }));

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">My Kitties</h2>

      {/* Kitty Cards */}
      <div className="row g-3">
        {kitties.map((kitty, index) => (
          <div key={index} className="col-lg-3 col-md-6">
            <div className="card shadow-lg border-0 rounded-3 text-center p-3">
              <h5 className="fw-bold text-secondary">{kitty.name}</h5>
              <p className="small text-muted">
                Kitty Address: <br />
                <strong>{kitty.address}</strong>
              </p>
              <p className="fw-bold text-success">
                Amount Raised: {kitty.amountRaised}
              </p>
              <p className="text-danger">Maturity Date: {kitty.maturityDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contributions Table */}
      <div className="mt-4">
        <h4 className="text-primary">Contributions</h4>
        <div
          className="table-responsive"
          style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
        >
          <table className="table table-hover table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Transaction Ref</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contribution, index) => (
                <tr key={index} className="text-center">
                  <td>{contribution.name}</td>
                  <td>{contribution.email}</td>
                  <td className="fw-bold text-success">
                    {contribution.amount}
                  </td>
                  <td>{contribution.transactionRef}</td>
                  <td>
                    <button className="btn btn-success btn-sm me-2">
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm">Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyKitties;

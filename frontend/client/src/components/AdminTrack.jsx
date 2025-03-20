import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import db from "../database/Config"; // Ensure your Firebase config is exported from a `firebase.js` file.

const AdminTrack = () => {
  const [cards, setCards] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    trackingNumber: "",
    name: "",
    siteName: "",
    address: "",
    paymentStatus: "",
    workDatesFrom: "",
    workDatesTo: "",
    status: "",
  });
  const [editId, setEditId] = useState(null);

  const ordersCollection = collection(db, "orders");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getDocs(ordersCollection);
      const orders = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCards(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const generateTrackingNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generates a 10-digit number
  };

  const handleAddNewOrder = () => {
    setFormData({
      trackingNumber: generateTrackingNumber(),
      name: "",
      siteName: "",
      address: "",
      paymentStatus: "",
      workDatesFrom: "",
      workDatesTo: "",
      status: "",
    });
    setEditId(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        ...formData,
        workDatesFrom: formData.workDatesFrom,
        workDatesTo: formData.workDatesTo,
      };

      if (editId) {
        const orderDoc = doc(db, "orders", editId);
        await updateDoc(orderDoc, orderData);
      } else {
        await addDoc(ordersCollection, orderData);
      }

      fetchOrders();
      setShowModal(false);
      setFormData({
        trackingNumber: "",
        name: "",
        siteName: "",
        address: "",
        paymentStatus: "",
        workDatesFrom: "",
        workDatesTo: "",
        status: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleEdit = (order) => {
    setFormData(order);
    setEditId(order.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const orderDoc = doc(db, "orders", id);
      await deleteDoc(orderDoc);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredCards = cards.filter((card) =>
    card.trackingNumber.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <section className="p-5 bg-light" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Enter Tracking Number Below</h2>
          <p className="text-muted mb-4">
            Enter your tracking number below to see the progress of your order.
          </p>
          <div className="d-flex justify-content-center align-items-center">
            <div className="input-group w-75 w-md-50">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your tracking number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => setSearchValue("")}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container text-center mb-4">
        <button className="btn btn-success" onClick={handleAddNewOrder}>
          Add New Order
        </button>
      </div>

      <section className="p-5" data-aos="fade-up">
        <div className="container">
          <div className="row row-cols-1">
            {filteredCards.map((card) => (
              <div className="col mb-4" key={card.id}>
                <div className="card shadow-sm bg-light">
                  <div className="card-body">
                    <h5 className="card-title">
                      Tracking Number: {card.trackingNumber}
                    </h5>
                    <p>Name: {card.name}</p>
                    <p>Drilling Site: {card.siteName}</p>
                    <p>Address: {card.address}</p>
                    <p
                      className={`fw-bold text-${card.paymentStatus.toLowerCase()}`}
                    >
                      Payment Status: {card.paymentStatus}
                    </p>
                    <p>
                      Work Dates: {card.workDatesFrom} - {card.workDatesTo}
                    </p>
                    <p className={`fw-bold text-${card.status.toLowerCase()}`}>
                      Status: {card.status}
                    </p>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEdit(card)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Edit Order" : "Add New Order"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleInputChange}
                  placeholder="Site Name"
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                />
                <select
                  className="form-select mb-3"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                >
                  <option value="">Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                <input
                  type="date"
                  className="form-control mb-3"
                  name="workDatesFrom"
                  value={formData.workDatesFrom}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  className="form-control mb-3"
                  name="workDatesTo"
                  value={formData.workDatesTo}
                  onChange={handleInputChange}
                />
                <select
                  className="form-select mb-3"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="">Order Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Queued">Queued</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTrack;

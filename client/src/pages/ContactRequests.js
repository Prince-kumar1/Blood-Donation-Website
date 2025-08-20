import React, { useEffect, useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import API from "../services/API";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-loader-spinner";
import moment from "moment";
import "./ContactRequests.css"; // custom CSS file

const ContactRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const getContactRequests = async () => {
    try {
      const { data } = await API.get("/inventory/contact-requests");
      if (data?.success) {
        setRequests(data?.requests);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const { data } = await API.post("/inventory/update-request-status", {
        requestId,
        inventoryId: selectedRequest.inventoryId,
        status,
      });

      if (data.success) {
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status } : req))
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loader-container">
          <ProgressBar
            visible={true}
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="contact-container">
        <h2 className="title">Contact Requests</h2>

        {requests.length === 0 ? (
          <div className="alert">You don't have any contact requests yet.</div>
        ) : (
          <div className="grid">
            {requests.map((request) => (
              <div key={request._id} className="card">
                <div className="card-body">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        {request.bloodGroup} Blood Request
                      </h3>
                      <p className="card-subtitle">
                        From: {request.requester.name} (
                        {request.requester.email})
                      </p>
                      <p className="card-text">{request.message}</p>
                      <small className="text-muted">
                        Requested:{" "}
                        {moment(request.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </small>
                    </div>
                    <span
                      className={`badge ${
                        request.status === "pending"
                          ? "badge-warning"
                          : request.status === "accepted"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {request.status === "pending" && (
                    <div className="btn-group">
                      <button
                        className="btn btn-success"
                        onClick={() => openRequestModal(request)}
                      >
                        Respond
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedRequest && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Respond to Request</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Requester:</strong> {selectedRequest?.requester.name} (
                  {selectedRequest?.requester.email})
                </p>
                <p>
                  <strong>Blood Type:</strong> {selectedRequest?.bloodGroup}
                </p>
                <p>
                  <strong>Message:</strong> {selectedRequest?.message}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    handleStatusUpdate(selectedRequest?._id, "accepted")
                  }
                >
                  Accept Request
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleStatusUpdate(selectedRequest?._id, "rejected")
                  }
                >
                  Reject Request
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContactRequests;

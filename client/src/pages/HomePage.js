import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "react-loader-spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from 'moment';
import ContactButton from "../components/ContactButton";
import StatusBadge from "../components/StatusBadge";
import './HomePage.css';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const { error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getBloodRecords = async () => {
    try {
      const { data } = await API.get('/inventory/get-inventory');
      if (data?.success) {
        setData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getContactRequests = async () => {
    try {
      const { data } = await API.get('/inventory/get-contact-requests');
      if (data?.success) {
        setContactRequests(data?.requests);
      }
    } catch (error) {
      console.log('Error fetching contact requests:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleRequestStatusUpdate = async (inventoryId, requestId, status) => {
    try {
      const { data } = await API.post('/inventory/update-request-status', {
        inventoryId,
        requestId,
        status
      });
      
      if (data?.success) {
        getContactRequests();
        getBloodRecords();
        alert(`Request ${status} successfully!`);
      }
    } catch (error) {
      console.log('Error updating request status:', error);
      alert('Error updating request status');
    }
  };

  useEffect(() => {
    getBloodRecords();
    getContactRequests();
  }, []);

  return (
    <Layout>
      {user?.role === 'admin' && navigate('/admin')}
      {error && <span>{alert(error)}</span>}
      
      {/* Animated Background Elements */}
      <div className="blood-background">
        <div className="blood-cell-animation blood-cell-1"></div>
        <div className="blood-cell-animation blood-cell-2"></div>
        <div className="blood-cell-animation blood-cell-3"></div>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <ProgressBar
              visible={true}
              height="120"
              width="120"
              color="#bb0a1e"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <p className="mt-3 text-danger fw-bold">Loading Blood Inventory...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header with Blood Drop Icon */}
          <div className="container-fluid blood-header py-3 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="display-5 fw-bold text-white mb-0">
                  <i className="fas fa-tint me-3 blood-pulse"></i>
                  Blood Inventory Management
                </h1>
                <p className="text-light mb-0">Manage blood supply and requests</p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="blood-stats-card p-3">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="text-danger mb-0">{data.length}</h4>
                      <small className="text-muted">Total Records</small>
                    </div>
                    <div className="col-6">
                      <h4 className="text-danger mb-0">
                        {contactRequests.filter(req => req.status === 'pending').length}
                      </h4>
                      <small className="text-muted">Pending Requests</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="container mb-4">
            <div className="blood-tab-container">
              <div className="blood-tab-nav">
                <button
                  className={`blood-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <i className="fas fa-tint me-2"></i> 
                  Blood Inventory
                  <span className="blood-tab-badge">{data.length}</span>
                </button>
                <button
                  className={`blood-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <i className="fas fa-inbox me-2"></i> 
                  Blood Requests
                  {contactRequests.filter(req => req.status === 'pending').length > 0 && (
                    <span className="blood-tab-badge badge-pulse">
                      {contactRequests.filter(req => req.status === 'pending').length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Tab Content */}
          {activeTab === 'inventory' && (
            <>
              <div className="container mb-4">
                <div 
                  className="blood-add-card animate__animated animate__pulse animate__infinite"
                  data-bs-toggle="modal" 
                  data-bs-target="#staticBackdrop"
                >
                  <div className="blood-add-content">
                    <i className="fas fa-plus-circle blood-add-icon"></i>
                    <div>
                      <h5 className="mb-1">Add Blood to Inventory</h5>
                      <p className="mb-0">Click here to add new blood stock</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="blood-table-container">
                  <table className="blood-table">
                    <thead>
                      <tr>
                        <th>Blood Group</th>
                        <th>Type</th>
                        <th>Quantity (ml)</th>
                        <th>Status</th>
                        <th>Donor Email</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((record, index) => (
                        <tr 
                          key={record._id}
                          className={`animate__animated animate__fadeInUp blood-table-row`}
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <td>
                            <span className="blood-group-badge">
                              <i className="fas fa-tint me-1"></i>
                              {record.bloodGroup}
                            </span>
                          </td>
                          <td>
                            <span className={`inventory-type ${record.inventoryType.toLowerCase()}`}>
                              {record.inventoryType.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className="quantity-display">
                              {record.quantity} ml
                            </span>
                          </td>
                          <td><StatusBadge status={record.status} /></td>
                          <td>{record.email}</td>
                          <td>
                            <span className="date-display">
                              {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                            </span>
                          </td>
                          <td>
                            <ContactButton inventory={record} onUpdate={getBloodRecords} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {data.length === 0 && (
                    <div className="text-center py-5">
                      <i className="fas fa-tint text-muted display-4 mb-3"></i>
                      <h4 className="text-muted">No Blood Inventory Found</h4>
                      <p className="text-muted">Add your first blood record to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Messages Tab Content */}
          {activeTab === 'messages' && (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {messagesLoading ? (
                    <div className="text-center py-5">
                      <div className="blood-spinner">
                        <i className="fas fa-tint blood-spinner-icon"></i>
                      </div>
                      <p className="mt-3 text-danger">Loading blood requests...</p>
                    </div>
                  ) : contactRequests.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-inbox-open text-muted display-4 mb-3"></i>
                      <h4 className="text-muted">No Blood Requests</h4>
                      <p className="text-muted">You haven't received any blood requests yet</p>
                    </div>
                  ) : (
                    <div className="row">
                      {contactRequests.map((request, index) => (
                        <div 
                          className="col-md-6 col-lg-4 mb-4" 
                          key={request._id}
                        >
                          <div className={`blood-request-card animate__animated animate__fadeInUp ${request.status}`}
                               style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="blood-request-header">
                              <div className="blood-request-group">
                                <i className="fas fa-tint"></i>
                                {request.bloodGroup}
                              </div>
                              <span className={`blood-request-status ${request.status}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="blood-request-body">
                              <div className="blood-request-info">
                                <i className="fas fa-user"></i>
                                <span>{request.requester?.name || 'Unknown Donor'}</span>
                              </div>
                              <div className="blood-request-info">
                                <i className="fas fa-envelope"></i>
                                <span>{request.requester?.email}</span>
                              </div>
                              {request.requester?.phone && (
                                <div className="blood-request-info">
                                  <i className="fas fa-phone"></i>
                                  <span>{request.requester?.phone}</span>
                                </div>
                              )}
                              <div className="blood-request-info">
                                <i className="fas fa-weight"></i>
                                <span>{request.quantity} ml requested</span>
                              </div>
                              
                              {request.message && (
                                <div className="blood-request-message">
                                  <i className="fas fa-comment"></i>
                                  <p>"{request.message}"</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="blood-request-footer">
                              <div className="blood-request-time">
                                <i className="fas fa-clock"></i>
                                {moment(request.createdAt).fromNow()}
                              </div>
                              
                              {request.status === 'pending' && (
                                <div className="blood-request-actions">
                                  <button
                                    className="blood-btn blood-btn-accept"
                                    onClick={() => handleRequestStatusUpdate(
                                      request.inventoryId,
                                      request._id,
                                      'accepted'
                                    )}
                                  >
                                    <i className="fas fa-check"></i> Accept
                                  </button>
                                  <button
                                    className="blood-btn blood-btn-reject"
                                    onClick={() => handleRequestStatusUpdate(
                                      request.inventoryId,
                                      request._id,
                                      'rejected'
                                    )}
                                  >
                                    <i className="fas fa-times"></i> Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Modal />
        </>
      )}
    </Layout>
  );
};

export default HomePage;
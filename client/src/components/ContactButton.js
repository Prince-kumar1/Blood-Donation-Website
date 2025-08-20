import React, { useState } from 'react';
import API from '../services/API';
import { useSelector } from 'react-redux';
import './ContactButton.css';

const ContactButton = ({ inventory, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const { user } = useSelector((state) => state.auth);

  // Debug logging
  console.log('ContactButton Debug:', {
    inventory,
    user,
    showModal,
    inventoryDonar: inventory?.donar,
    userID: user?._id
  });

  // Simplified user donor check
  const isUserDonor = user && inventory?.donar && 
    (user._id === inventory.donar._id || user._id === inventory.donar);
  
  const isAvailable = !inventory.status || inventory.status === 'available';

  const handleContact = async () => {
    if (!message.trim()) {
      setAlert({ show: true, message: 'Please enter a message', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/inventory/contact-request', {
        inventoryId: inventory._id,
        message
      });

      if (data.success) {
        setAlert({ show: true, message: 'Contact request sent successfully!', type: 'success' });
        setTimeout(() => {
          setShowModal(false);
          setMessage('');
          setAlert({ show: false, message: '', type: '' });
          if (onUpdate) onUpdate();
        }, 1500);
      }
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to send contact request',
        type: 'error'
      });
    }
    setLoading(false);
  };

  // Simplified button click handler
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked, opening modal');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
    setMessage('');
    setAlert({ show: false, message: '', type: '' });
  };

  const getButtonText = () => {
    if (isUserDonor) return 'Your Donation';
    if (!isAvailable) return 'Not Available';
    return 'Contact Donor';
  };

  const isButtonDisabled = !isAvailable || isUserDonor;

  console.log('Render state:', { showModal, isButtonDisabled, isAvailable, isUserDonor });

  return (
    <div>
      <button
        type="button"
        className={`btn ${isButtonDisabled ? 'btn-secondary' : 'btn-primary'} btn-sm`}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        style={{ minWidth: '120px' }}
      >
        {getButtonText()}
      </button>

      {/* Always render modal when showModal is true - no conditional rendering issues */}
      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            // Close modal if clicking on overlay
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div 
              className="modal-header"
              style={{
                padding: '20px',
                borderBottom: '1px solid #dee2e6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
              <h2 style={{ margin: 0, color: '#333' }}>Contact Blood Donor</h2>
              <button 
                className="close-btn"
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0',
                  width: '30px',
                  height: '30px'
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              {alert.show && (
                <div 
                  className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    backgroundColor: alert.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: alert.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${alert.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                  }}
                >
                  {alert.message}
                </div>
              )}
              
              <div 
                className="blood-info"
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #007bff'
                }}
              >
                <h4 style={{ marginBottom: '15px', color: '#333' }}>Blood Request Details</h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <strong>Blood Type:</strong>{' '}
                    <span 
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}
                    >
                      {inventory.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <strong>Quantity:</strong> {inventory.quantity} ml
                  </div>
                  <div>
                    <strong>Date Available:</strong>{' '}
                    {new Date(inventory.createdAt).toLocaleDateString()}
                  </div>
                  {inventory.organisation && (
                    <div>
                      <strong>Location:</strong>{' '}
                      {inventory.organisation.organisationName || 
                       inventory.organisation.name || 
                       inventory.organisation.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="message-section">
                <label 
                  htmlFor="contact-message"
                  style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
                >
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please introduce yourself and explain your need for this blood donation..."
                  maxLength={500}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  {message.length}/500 characters
                </small>
              </div>

              <div 
                style={{
                  backgroundColor: '#e7f3ff',
                  padding: '15px',
                  borderRadius: '8px',
                  marginTop: '15px'
                }}
              >
                <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>💡 Tips for a good message:</h5>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Be polite and respectful</li>
                  <li>Explain the urgency if applicable</li>
                  <li>Mention your preferred contact method</li>
                  <li>Thank the donor for their generosity</li>
                </ul>
              </div>
            </div>

            <div 
              className="modal-footer"
              style={{
                padding: '20px',
                borderTop: '1px solid #dee2e6',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <button 
                className="btn btn-secondary"
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: '#6c757d',
                  color: 'white'
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleContact}
                disabled={loading || !message.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: loading || !message.trim() ? '#ccc' : '#007bff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <span 
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    ></span>
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS keyframes for spinner */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactButton;
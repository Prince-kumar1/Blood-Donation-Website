import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getClass = () => {
    switch (status) {
      case 'available': return 'status-badge status-available';
      case 'in-contact': return 'status-badge status-in-contact';
      case 'collected': return 'status-badge status-collected';
      case 'expired': return 'status-badge status-expired';
      case 'reserved': return 'status-badge status-reserved';
      default: return 'status-badge status-available'; // Default to available
    }
  };

  const getText = () => {
    switch (status) {
      case 'available': return '✅ Available';
      case 'in-contact': return '📞 In Contact';
      case 'collected': return '✅ Collected';
      case 'expired': return '⏰ Expired';
      case 'reserved': return '🔒 Reserved';
      default: return '✅ Available'; // Default to available
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'available': return 'Blood is available for contact';
      case 'in-contact': return 'Donor is in contact with a recipient';
      case 'collected': return 'Blood has been collected';
      case 'expired': return 'Blood has expired';
      case 'reserved': return 'Blood is reserved';
      default: return 'Blood is available for contact';
    }
  };

  return (
    <span 
      className={getClass()} 
      title={getDescription()}
    >
      {getText()}
    </span>
  );
};

export default StatusBadge;
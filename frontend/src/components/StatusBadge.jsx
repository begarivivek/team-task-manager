import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={	ext-xs px-2 py-1 rounded-full font-medium }>
      {status}
    </span>
  );
};

export default StatusBadge;

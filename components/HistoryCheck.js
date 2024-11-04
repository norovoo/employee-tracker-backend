import React from 'react';

const HistoryCheck = ({ historyData }) => {
  if (!historyData || historyData.length === 0) {
    return <p>No history available</p>;
  }

  return (
    <div className="history-check-container">
      <h2>Technician History</h2>
      <ul>
        {historyData.map((entry) => (
          <li key={entry.id}>
            <p><strong>Date:</strong> {entry.date}</p>
            <p><strong>Description:</strong> {entry.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryCheck;
import React from 'react';

const LoadingIndicator = ({ isProcessing }) => {
  return isProcessing ? <div className="loading-indicator">Processing...</div> : null;
};

export default LoadingIndicator;


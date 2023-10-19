import React, { useState } from 'react';
import './DownloadData.css';

const DownloadData = ({ onDownload }) => {
  const [filename, setFilename] = useState('');

  const handleFilenameChange = (event) => {
    setFilename(event.target.value);
  };

  const handleDownload = (format) => {
    if (!filename) {
      alert('Please enter a filename.');
      return;
    }

    onDownload(filename, format);
    setFilename('');
  };

  return (
    <div className="download-data">
      <h3>Download Data</h3>
      <div>
        <input
          type="text"
          value={filename}
          onChange={handleFilenameChange}
          placeholder="Enter a filename"
        />
        <button onClick={() => handleDownload('csv')} disabled={!filename}>
          Download CSV
        </button>
        <button onClick={() => handleDownload('json')} disabled={!filename}>
          Download JSON
        </button>
      </div>
    </div>
  );
};

export default DownloadData;


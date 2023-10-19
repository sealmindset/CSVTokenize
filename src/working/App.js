import React, { useState } from 'react';
import Papa from 'papaparse';
import FileParser from './FileParser';
import DataTableDisplay from './DataTableDisplay';
import DownloadData from './DownloadData';
import LoadingIndicator from './LoadingIndicator';

const App = () => {
  const [parsedData, setParsedData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: handleParsingComplete,
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleParsingComplete = (results) => {
    const { data, meta } = results;
    const columnHeaders = Object.keys(data[0]);
    setParsedData({ columnHeaders, data });
  };

  const handleColumnSelection = (event) => {
    setSelectedColumn(event.target.value);
  };

  const handleTokenizeData = () => {
    if (!selectedColumn) {
      alert('Please select a column first.');
      return;
    }

    setIsProcessing(true);
    const tokenizedData = tokenizeData(parsedData.data, selectedColumn);
    setIsProcessing(false);
    setParsedData({ ...parsedData, data: tokenizedData });
  };

  const tokenizeData = (data, selectedColumn) => {
    // Implementation of the tokenizeData function
    // ... (The previous implementation goes here)
  };

  const handleDownloadData = (filename, format) => {
    if (!parsedData || !filename) {
      return;
    }

    let dataToDownload;
    if (format === 'csv') {
      const csvData = Papa.unparse(parsedData.data);
      dataToDownload = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
    } else if (format === 'json') {
      const jsonData = JSON.stringify(parsedData.data, null, 2);
      dataToDownload = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    } else {
      return;
    }

    const link = document.createElement('a');
    link.setAttribute('href', dataToDownload);
    link.setAttribute('download', `${filename}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <FileParser
        parsedData={parsedData}
        selectedColumn={selectedColumn}
        handleFileUpload={handleFileUpload}
        handleColumnSelection={handleColumnSelection}
        handleTokenizeData={handleTokenizeData}
      />
      {parsedData && (
        <>
          <DataTableDisplay data={parsedData.data} columns={parsedData.columnHeaders} />
          <DownloadData onDownload={handleDownloadData} />
          <LoadingIndicator isProcessing={isProcessing} />
        </>
      )}
    </div>
  );
};

export default App;

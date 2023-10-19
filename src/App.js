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
    const { data } = results;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Section 1: Title */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b-2 border-gray-300">
        <h1 className="text-4xl font-bold mb-4">CSV Data Cleaner</h1>
      </div>

      {/* Section 2: Menu */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 border-b-2 border-gray-300">
        {/* Your menu content goes here */}
      </div>

      {/* Section 3: Dropzone */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 border-b-2 border-gray-300">
        <FileParser
          parsedData={parsedData}
          selectedColumn={selectedColumn}
          handleFileUpload={handleFileUpload}
          handleColumnSelection={handleColumnSelection}
          handleTokenizeData={handleTokenizeData}
        />
      </div>

      {/* Section 4: Tokenize */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 border-b-2 border-gray-300">
        {/* Your toggle section content goes here */}
      </div>

      {/* Section 6: Table */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 border-b-2 border-gray-300">
        {parsedData && (
          <DataTableDisplay data={parsedData.data} columns={parsedData.columnHeaders} />
        )}
      </div>

      {/* Section 7: Download */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        {parsedData && <DownloadData onDownload={handleDownloadData} />}
        {isProcessing && <LoadingIndicator isProcessing={isProcessing} />}
      </div>
    </div>
  );
};

export default App;
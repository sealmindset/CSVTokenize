import React, { useState } from 'react';
import Papa from 'papaparse';
import DataTableDisplay from './DataTableDisplay';
import DownloadData from './DownloadData';
import LoadingIndicator from './LoadingIndicator';

const FileParser = () => {
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
    // Create a map to store unique values and their corresponding tokenized versions
    const uniqueValueMap = {};

    // Helper function to generate tokenized versions of unique data
    const generateToken = (data) => {
      // Your custom tokenization logic goes here
      // For example, you can use a more sophisticated algorithm to obfuscate the data
      const charMap = {};
      const tokenizedValue = data
        .split('')
        .map((char) => {
          if (!charMap[char]) {
            charMap[char] = generateRandomChar(char);
          }
          return charMap[char];
        })
        .join('');
      return tokenizedValue;
    };

    // Step 1: Identify unique values in the selected column and store their tokenized versions
    const uniqueValuesInSelectedColumn = new Set(data.map((row) => row[selectedColumn]));
    for (const value of uniqueValuesInSelectedColumn) {
      if (!uniqueValueMap[value]) {
        uniqueValueMap[value] = generateToken(value);
      }
    }

    // Step 2: Tokenize relevant values in each column
    const tokenizedData = data.map((row) => {
      const tokenizedRow = { ...row };

      for (const [column, value] of Object.entries(row)) {
        if (column === selectedColumn && typeof value === 'string') {
          // Tokenize the value in the selected column
          tokenizedRow[column] = uniqueValueMap[value];
        } else if (column !== selectedColumn && typeof value === 'string') {
          // Check if the value contains any of the unique values in the selected column
          for (const uniqueValue of uniqueValuesInSelectedColumn) {
            if (value.includes(uniqueValue)) {
              // Tokenize the value in this column
              const tokenizedValue = value.replace(new RegExp(uniqueValue, 'g'), uniqueValueMap[uniqueValue]);
              tokenizedRow[column] = tokenizedValue;
            }
          }
        }
      }

      return tokenizedRow;
    });

    return tokenizedData;
  };

  const generateRandomChar = (char) => {
    if (/[A-Z]/.test(char)) {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65); // Uppercase letter
    } else if (/[a-z]/.test(char)) {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Lowercase letter
    } else if (/\d/.test(char)) {
      return String.fromCharCode(Math.floor(Math.random() * 10) + 48); // Digit
    }
    return char; // Non-alphanumeric characters remain the same
  };

  // Function to handle downloading the data as a CSV or JSON file
  const handleDownloadData = (filename, format) => {
    if (!parsedData || !filename) {
      return;
    }

    let dataToDownload;
    if (format === 'csv') {
      // Convert data to CSV format
      const csvData = Papa.unparse(parsedData.data);
      dataToDownload = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
    } else if (format === 'json') {
      // Convert data to JSON format
      const jsonData = JSON.stringify(parsedData.data, null, 2);
      dataToDownload = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    } else {
      return; // Invalid format, do not proceed with the download
    }

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', dataToDownload);
    link.setAttribute('download', `${filename}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e.target.files[0])} />
      {parsedData && (
        <>
          <div>
            <h3>Select a Column:</h3>
            <select value={selectedColumn} onChange={handleColumnSelection}>
              <option value="">--Select Column--</option>
              {parsedData.columnHeaders.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
            <button onClick={handleTokenizeData} disabled={!selectedColumn}>
              {isProcessing ? 'Processing...' : 'Tokenize Data'}
            </button>
          </div>
          <DataTableDisplay data={parsedData.data} columns={parsedData.columnHeaders} />
          <DownloadData onDownload={handleDownloadData} />
          <LoadingIndicator isProcessing={isProcessing} />
        </>
      )}
    </div>
  );
};

export default FileParser;


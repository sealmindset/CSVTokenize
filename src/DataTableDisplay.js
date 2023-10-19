import React, { useState, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import Modal from './Modal';
import './DataTableDisplay.css'; // Import the custom CSS file

const DataTableDisplay = ({ data, columns }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [setFilters] = useState({}); // Added this line to manage filters

  const handleRowClick = useCallback((row) => {
    setSelectedRow(row);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  // Handle setting filters
  const setFilter = (value, field) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const wrapText = (text, maxWidth) => {
    if (!text) return '';

    if (text.length <= maxWidth) return text;

    return text.slice(0, maxWidth) + '...';
  };

  const tableColumns = columns.map((header) => ({
    name: header,
    selector: header,
    sortable: true,
    cell: (row) => {
      const wrappedText = wrapText(row[header], 250);
      return (
        <div
          className="max-h-16 overflow-y-auto whitespace-wrap cursor-pointer"
          style={{ maxWidth: '250px' }}
          onClick={() => handleRowClick(row)}
        >
          {wrappedText}
        </div>
      );
    },
  }));

  const ExpandableRow = ({ data }) => {
    return (
      <div>
        {Object.entries(data).map(([header, value]) => (
          <p key={header}>
            <strong>{header}:</strong> {value}
          </p>
        ))}
      </div>
    );
  };

  const customFilter = (rows, field, searchValue) => {
    return rows.filter((row) => {
      const cellValue = row[field]?.toString()?.toLowerCase();
      return cellValue.includes(searchValue?.toLowerCase());
    });
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Processed Data</h2>
      <div className="data-table-container">
        <DataTable
          columns={tableColumns}
          data={data}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          noDataComponent={<span className="text-red-500">No data found</span>}
          expandableRows
          expandableRowsComponent={<ExpandableRow data={selectedRow} />} // Pass data prop here
          expandOnRowClicked
          highlightOnHover
          defaultSortField="id" // Replace "id" with the column name to be sorted by default
          defaultSortAsc // Set this to false if you want the default sort to be descending
          customStyles={{
            tableWrapper: { overflow: 'visible' }, // To make table header and body aligned
          }}
          onSort={(column, sortDirection) => {
            // Implement sorting logic here if needed
            // You can handle the sorting based on the column name and sortDirection
          }}
          customHeader={() => (
            <thead>
              <tr>
                {columns.map((header) => (
                  <th key={header}>
                    <div className="header-cell">
                      <div className="header-text">{header}</div>
                      <input
                        type="text"
                        className="search-input"
                        placeholder={`Search ${header}`}
                        onChange={(e) => setFilter(e.target.value, header)} // Modified this line
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          customFilterFunction={(rows, filters) => {
            let filteredRows = [...rows];
            Object.entries(filters).forEach(([filterField, filterValue]) => {
              if (filterValue && filterValue !== '') {
                filteredRows = customFilter(filteredRows, filterField, filterValue);
              }
            });
            return filteredRows;
          }}
        />
      </div>

      {selectedRow && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-content">
            <h3 className="text-lg font-semibold mb-2">Row Details</h3>
            <table>
              <tbody>
                {Object.entries(selectedRow).map(([header, value]) => (
                  <tr key={header}>
                    <td className="font-semibold pr-2">{header}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DataTableDisplay;

import React, { useState, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import Modal from './Modal';

const DataTableDisplay = ({ data, columns }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const tableColumns = columns.map((header) => ({
    name: header,
    selector: header,
    sortable: true,
  }));

  const handleRowClick = useCallback((row) => {
    setSelectedRow(row);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  // Memoize the DataTable component to prevent unnecessary re-renders
  const MemoizedDataTable = React.memo(() => (
    <DataTable
      columns={tableColumns}
      data={data}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 50, 100]}
      noDataComponent="No data found"
      onRowClicked={handleRowClick}
    />
  ));

  return (
    <div>
      <h2>Processed Data</h2>
      <MemoizedDataTable />

      {selectedRow && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-content">
            <h3>Row Details</h3>
            <table>
              <tbody>
                {Object.entries(selectedRow).map(([header, value]) => (
                  <tr key={header}>
                    <td>{header}</td>
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


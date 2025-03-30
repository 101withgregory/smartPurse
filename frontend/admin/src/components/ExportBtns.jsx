import React from 'react';
import { exportCSV, exportPDF } from '../services/exportService';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  transition: background 0.3s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const CSVButton = styled(Button)`
  background-color: #28a745; /* Green */
`;

const PDFButton = styled(Button)`
  background-color: #dc3545; /* Red */
`;

const ExportButtons = () => {
  const handleExportCSV = async () => {
    try {
      await exportCSV();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportPDF();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <CSVButton onClick={handleExportCSV}>
        <FaFileCsv />
        Export CSV
      </CSVButton>
      <PDFButton onClick={handleExportPDF}>
        <FaFilePdf />
        Export PDF
      </PDFButton>
    </div>
  );
};

export default ExportButtons;

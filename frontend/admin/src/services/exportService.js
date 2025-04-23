import axios from 'axios';

const getAuthToken = () => {
  // Example: Get token from localStorage
  return localStorage.getItem('token');
};


export const exportCSV = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get('http://localhost:5000/api/export/csv', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Console log to see the response details
    console.log('CSV Response:', response);

    // Create a Blob and download
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};



export const exportPDF = async () => {
  try {
    const token = getAuthToken();

    const response = await axios.get('http://localhost:5000/api/export/pdf', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`, // Attach token here
      },
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.pdf';
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
};


export const exportKittyTransactions = async (kittyId) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://localhost:5000/api/export/${kittyId}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `kitty_${kittyId}_transactions.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};



export const exportKittyContributions = async (kittyAddress) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/export/${kittyAddress}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `kitty_${kittyAddress}_contributions.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};



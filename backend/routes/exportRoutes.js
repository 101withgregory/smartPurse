const PDFDocument = require('pdfkit');
const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Transaction = require('../models/transactionModel');

// Export to CSV
router.get('/csv', async (req, res) => {
    try {
      // Fetch transactions from database
      const transactions = await Transaction.find().populate('user');
  
      // Console log to inspect the data
      console.log('Fetched Transactions:', transactions);
  
      // Flatten the data to avoid ObjectId issues
      const flatData = transactions.map((tx) => ({
        id: tx._id.toString(),
        user: tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : 'N/A',
        amount: tx.amount,
        status: tx.status,
        createdAt: new Date(tx.createdAt).toLocaleString()
      }));
  
      // Console log to see the flattened data before parsing
      console.log('Flattened Data:', flatData);
  
      // Use json2csv parser to format the data into CSV
      const fields = ['id', 'user', 'amount', 'status', 'createdAt'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(flatData);
  
      // Set headers correctly
      res.header('Content-Type', 'text/csv');
      res.attachment('Transactions.csv');
      
      // Send CSV content
      return res.send(csv);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      res.status(500).send('Server Error');
    }
  });
  


router.get('/pdf', async (req, res) => {
    try {
      const transactions = await Transaction.find();
  
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
  
      res.setHeader('Content-Disposition', 'attachment; filename="Transactions.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
  
      doc.pipe(res);
  
      // Title
      doc
      .fillColor('#0000FF') // Define blue color using hex code
      .fontSize(18)
      .text('Transaction Report', { align: 'center' })
      .underline(30, doc.y, 500, 1); // Apply underline after text
    doc.moveDown(1);
    
  
      // Table Header
      const tableTop = 100;
      const colWidths = [120, 120, 100, 100, 150];
      const rowHeight = 25;
  
      // Draw header background
      doc
        .rect(30, tableTop - 5, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], rowHeight)
        .fill('#e0e0e0'); // Light gray background for header
  
      doc
        .fillColor('#000')
        .fontSize(12)
        .text('ID', 30, tableTop, { width: colWidths[0], align: 'left' })
        .text('User', 30 + colWidths[0], tableTop, { width: colWidths[1], align: 'left' });
  
      // Light green background for "Amount" header
      doc
        .rect(30 + colWidths[0] + colWidths[1], tableTop - 5, colWidths[2], rowHeight)
        .fill('#d0f0c0') // Light green
        .stroke();
  
      doc
        .fillColor('#000')
        .text('Amount', 30 + colWidths[0] + colWidths[1], tableTop, { width: colWidths[2], align: 'center' })
        .text('Status', 30 + colWidths[0] + colWidths[1] + colWidths[2], tableTop, { width: colWidths[3], align: 'center' })
        .text('Date', 30 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop, { width: colWidths[4], align: 'left' });
  
      let yPosition = tableTop + rowHeight;
  
      // Table Rows
      transactions.forEach((transaction, index) => {
        // Alternate row color for better readability
        if (index % 2 === 0) {
          doc
            .rect(30, yPosition - 5, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], rowHeight)
            .fill('#f9f9f9') // Light gray background for even rows
            .stroke();
        }
  
        doc
          .fillColor('#000')
          .fontSize(10)
          .text(transaction._id.toString(), 30, yPosition, { width: colWidths[0], align: 'left' })
          .text(transaction.user.toString(), 30 + colWidths[0], yPosition, { width: colWidths[1], align: 'left' })
          .text(transaction.amount.toLocaleString(), 30 + colWidths[0] + colWidths[1], yPosition, { width: colWidths[2], align: 'center' })
          .text(transaction.status, 30 + colWidths[0] + colWidths[1] + colWidths[2], yPosition, { width: colWidths[3], align: 'center' })
          .text(new Date(transaction.createdAt).toLocaleString(), 30 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPosition, { width: colWidths[4], align: 'left' });
  
        yPosition += rowHeight;
  
        // Draw line between rows
        doc
          .moveTo(30, yPosition - 5)
          .lineTo(560, yPosition - 5)
          .stroke();
      });
  
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
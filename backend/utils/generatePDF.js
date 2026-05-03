const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (booking, user, itemDetails, callback) => {
    const doc = new PDFDocument();
    
    // Create a safe filename
    const filename = `booking_${booking._id}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('Tour & Trip Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Booking Receipt', { align: 'center', underline: true });
    doc.moveDown();

    // Booking Details
    doc.fontSize(12).text(`Booking ID: ${booking._id}`);
    doc.text(`Status: ${booking.status}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // User Details
    doc.text(`Customer Name: ${user.name}`);
    doc.text(`Customer Email: ${user.email}`);
    doc.moveDown();

    // Item Details
    doc.text(`Item Type: ${booking.itemType}`);
    doc.text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`);
    doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`);
    doc.text(`Total Price: $${booking.totalPrice}`);
    doc.moveDown();

    // Footer
    doc.text('Thank you for choosing our services!', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
        callback(null, filePath, filename);
    });

    stream.on('error', (err) => {
        callback(err, null, null);
    });
};

module.exports = generatePDF;

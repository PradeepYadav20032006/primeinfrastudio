const PDFDocument = require('pdfkit');

// Generates a professional quotation PDF as a Buffer, given a Quote document.
const generateQuotationPDF = (quote) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fillColor('#B45309').fontSize(22).text('PrimeInfraStudio', { align: 'left' });
      doc.fillColor('#374151').fontSize(10).text('Crafting Spaces. Creating Experiences.', { align: 'left' });
      doc.moveDown(0.5);
      doc.fillColor('#111827').fontSize(9).text('Pune, Maharashtra, India | +91 9369737080 | primeinfrastructure.design@gmail.com');
      doc.moveDown(1);
      doc.strokeColor('#B45309').lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      doc.fillColor('#111827').fontSize(16).text('Project Quotation Request', { align: 'left' });
      doc.moveDown(1);

      const row = (label, value) => {
        doc.fontSize(11).fillColor('#6B7280').text(label, { continued: true });
        doc.fillColor('#111827').text(`  ${value || 'N/A'}`);
        doc.moveDown(0.4);
      };

      row('Reference ID:', quote._id ? String(quote._id) : 'N/A');
      row('Date:', new Date().toLocaleDateString('en-IN'));
      row('Client Name:', quote.name);
      row('Email:', quote.email);
      row('Phone:', quote.phone);
      row('Project Type:', quote.projectType);
      row('Location:', quote.location);
      row('Area:', quote.area);
      row('Budget Range:', quote.budgetRange);
      row('Preferred Timeline:', quote.timeline);
      if (quote.estimatedCost) row('Estimated Cost:', `Rs. ${quote.estimatedCost.toLocaleString('en-IN')}`);

      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#6B7280').text('Additional Requirements:');
      doc.fillColor('#111827').fontSize(11).text(quote.message || 'N/A', { width: 495 });

      doc.moveDown(2);
      doc.fontSize(9).fillColor('#9CA3AF').text(
        'This is an auto-generated quotation summary based on the information you submitted. ' +
          'Our team will contact you shortly with a detailed, itemized estimate.',
        { width: 495 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateQuotationPDF;

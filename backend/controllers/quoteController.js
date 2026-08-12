const asyncHandler = require('express-async-handler');
const Quote = require('../models/Quote');
const crudFactory = require('./crudFactory');
const sendEmail = require('../utils/sendEmail');
const generateQuotationPDF = require('../utils/generatePDF');

const base = crudFactory(Quote, { searchFields: ['name', 'email', 'phone', 'location'] });

// @desc    Submit a new quote request (public) - saves to DB, generates PDF, emails both parties
// @route   POST /api/quotes
// @access  Public
const createQuote = asyncHandler(async (req, res) => {
  const quoteData = { ...req.body };
  if (req.customer) quoteData.customer = req.customer.id;
  const quote = await Quote.create(quoteData);

  let pdfBuffer;
  try {
    pdfBuffer = await generateQuotationPDF(quote);
  } catch (err) {
    console.error('PDF generation failed:', err.message);
  }

  const attachments = pdfBuffer
    ? [{ filename: `PrimeInfraStudio-Quotation-${quote._id}.pdf`, content: pdfBuffer }]
    : [];

  // Send emails asynchronously in the background (non-blocking)
  const companyEmail = process.env.COMPANY_EMAIL || 'primeinfrastructure.design@gmail.com';

  sendEmail({
    to: companyEmail,
    subject: `New Quote Request from ${quote.name}`,
    html: `<h2>New Quote Request</h2>
      <p><b>Name:</b> ${quote.name}</p>
      <p><b>Email:</b> ${quote.email}</p>
      <p><b>Phone:</b> ${quote.phone}</p>
      <p><b>Project Type:</b> ${quote.projectType}</p>
      <p><b>Location:</b> ${quote.location}</p>
      <p><b>Budget:</b> ${quote.budgetRange || 'N/A'}</p>
      <p><b>Message:</b> ${quote.message || 'N/A'}</p>`,
    attachments,
  }).catch((err) => {
    console.error('SMTP Error (Company notification):', err.message);
  });

  sendEmail({
    to: quote.email,
    subject: 'Your Quotation Request - PrimeInfraStudio',
    html: `<p>Dear ${quote.name},</p>
      <p>Thank you for reaching out to <b>PrimeInfraStudio</b>. We have received your quotation request and
      attached a summary PDF for your reference. Our team will contact you within 24-48 hours.</p>
      <p>Warm regards,<br/>Team PrimeInfraStudio</p>`,
    attachments,
  }).catch((err) => {
    console.error('SMTP Error (Client confirmation):', err.message);
  });

  res.status(201).json({ success: true, data: quote, message: 'Quote request submitted successfully' });
});

// @desc    Download the quotation PDF for an existing quote (admin)
// @route   GET /api/quotes/:id/pdf
// @access  Private/Admin
const downloadQuotePDF = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    res.status(404);
    throw new Error('Quote not found');
  }
  const pdfBuffer = await generateQuotationPDF(quote);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="Quotation-${quote._id}.pdf"`,
  });
  res.send(pdfBuffer);
});

// @desc    Get quote requests submitted by the currently logged-in customer
// @route   GET /api/quotes/my
// @access  Private/Customer
const getMyQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({ customer: req.customer.id }).sort('-createdAt');
  res.status(200).json({ success: true, count: quotes.length, data: quotes });
});

module.exports = { ...base, createOne: createQuote, downloadQuotePDF, getMyQuotes };

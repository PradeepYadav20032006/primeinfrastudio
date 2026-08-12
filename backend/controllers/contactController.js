const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const crudFactory = require('./crudFactory');
const sendEmail = require('../utils/sendEmail');

const base = crudFactory(ContactMessage, { searchFields: ['name', 'email', 'subject', 'message'] });

// @desc    Submit contact form (public)
// @route   POST /api/contact
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const messageData = { ...req.body };
  if (req.customer) messageData.customer = req.customer.id;
  const contactMessage = await ContactMessage.create(messageData);

  try {
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Message: ${contactMessage.subject}`,
      html: `<h2>New Contact Message</h2>
        <p><b>Name:</b> ${contactMessage.name}</p>
        <p><b>Email:</b> ${contactMessage.email}</p>
        <p><b>Phone:</b> ${contactMessage.phone || 'N/A'}</p>
        <p><b>Subject:</b> ${contactMessage.subject}</p>
        <p><b>Message:</b> ${contactMessage.message}</p>`,
    });
  } catch (err) {
    console.error('SMTP Error (Company message notification):', err.message);
  }

  try {
    await sendEmail({
      to: contactMessage.email,
      subject: 'We received your message - PrimeInfraStudio',
      html: `<p>Dear ${contactMessage.name},</p>
        <p>Thank you for contacting <b>PrimeInfraStudio</b>. We have received your message and will get back to you shortly.</p>
        <p>Warm regards,<br/>Team PrimeInfraStudio</p>`,
    });
  } catch (err) {
    console.error('SMTP Error (Client message confirmation):', err.message);
  }

  res.status(201).json({ success: true, data: contactMessage, message: 'Message sent successfully' });
});

// @desc    Get contact messages submitted by the currently logged-in customer
// @route   GET /api/contact/my
// @access  Private/Customer
const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({ customer: req.customer.id }).sort('-createdAt');
  res.status(200).json({ success: true, count: messages.length, data: messages });
});

module.exports = { ...base, createOne: createMessage, getMyMessages };

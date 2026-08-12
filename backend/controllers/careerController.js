const asyncHandler = require('express-async-handler');
const CareerApplication = require('../models/CareerApplication');
const crudFactory = require('./crudFactory');
const sendEmail = require('../utils/sendEmail');

const base = crudFactory(CareerApplication, {
  searchFields: ['fullName', 'email', 'positionAppliedFor'],
});

// @desc    Submit a career application (public) - handles resume upload via multer
// @route   POST /api/careers
// @access  Public
const createApplication = asyncHandler(async (req, res) => {
  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl;
  if (!resumeUrl) {
    res.status(400);
    throw new Error('Resume file is required');
  }

  const application = await CareerApplication.create({ ...req.body, resumeUrl });

  try {
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `New Career Application: ${application.positionAppliedFor}`,
      html: `<h2>New Career Application</h2>
        <p><b>Name:</b> ${application.fullName}</p>
        <p><b>Email:</b> ${application.email}</p>
        <p><b>Phone:</b> ${application.phone}</p>
        <p><b>Position:</b> ${application.positionAppliedFor}</p>
        <p><b>Experience:</b> ${application.experienceYears} years</p>`,
    });
  } catch (err) {
    console.error('SMTP Error (Career application notification):', err.message);
  }

  res.status(201).json({ success: true, data: application, message: 'Application submitted successfully' });
});

module.exports = { ...base, createOne: createApplication };

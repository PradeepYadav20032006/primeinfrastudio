const nodemailer = require('nodemailer');

// Creates a reusable transporter using SMTP credentials from environment variables.
// Works with Gmail (using an App Password), SendGrid SMTP, or any standard SMTP provider.
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {Array}  [options.attachments]
 */
const sendEmail = async ({ to, subject, html, attachments }) => {
  // If SMTP credentials are not configured, log instead of throwing so the
  // rest of the app (contact/quote forms) keeps working during local dev.
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[sendEmail] SMTP credentials not set. Skipping actual email send.');
    console.warn(`[sendEmail] Would have sent "${subject}" to ${to}`);
    return { skipped: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"PrimeInfraStudio" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
  return info;
};

module.exports = sendEmail;

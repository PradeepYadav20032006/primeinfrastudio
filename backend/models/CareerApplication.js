const mongoose = require('mongoose');

const CareerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String, required: true },
    positionAppliedFor: { type: String, required: true },
    experienceYears: { type: Number, default: 0 },
    coverLetter: { type: String },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CareerApplication', CareerApplicationSchema);

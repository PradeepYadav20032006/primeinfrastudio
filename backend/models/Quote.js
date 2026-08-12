const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String, required: true },
    projectType: {
      type: String,
      required: true,
      enum: ['Residential Construction', 'Commercial Construction', 'Interior Design', 'Renovation', 'Other'],
    },
    location: { type: String, required: true },
    area: { type: String },
    budgetRange: {
      type: String,
      enum: ['Under 10 Lakh', '10-25 Lakh', '25-50 Lakh', '50 Lakh - 1 Crore', 'Above 1 Crore'],
    },
    timeline: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Discussion', 'Quoted', 'Converted', 'Closed'],
      default: 'New',
    },
    estimatedCost: { type: Number },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', QuoteSchema);

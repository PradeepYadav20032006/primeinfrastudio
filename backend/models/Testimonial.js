const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String, default: 'Client' },
    clientImage: { type: String, default: '' },
    projectType: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);

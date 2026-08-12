const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);

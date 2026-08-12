const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Customers are website visitors who create an account to track their
// quote requests and messages. Kept separate from the admin/editor User
// model so the two auth systems never overlap or get confused.
const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String },
    // Password is only required for accounts created via email/password
    // signup. Google-authenticated accounts have no password at all.
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

CustomerSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

CustomerSchema.methods.getSignedJwtToken = function () {
  // type: 'customer' distinguishes this token from admin/editor User tokens,
  // even though both currently share the same JWT_SECRET.
  return jwt.sign({ id: this._id, type: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = mongoose.model('Customer', CustomerSchema);

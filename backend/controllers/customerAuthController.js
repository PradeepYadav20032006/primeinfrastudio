const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const Customer = require('../models/Customer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.getSignedJwtToken();
  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) || 7;

  res
    .status(statusCode)
    .cookie('customerToken', token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
      },
    });
};

// @desc    Register a new customer account
// @route   POST /api/customer-auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existing = await Customer.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists. Please log in instead.');
  }
  const customer = await Customer.create({ name, email, password, phone });
  sendTokenResponse(customer, 201, res);
});

// @desc    Customer login
// @route   POST /api/customer-auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email }).select('+password');
  if (!customer || !(await customer.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!customer.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }
  sendTokenResponse(customer, 200, res);
});

// @desc    Customer logout
// @route   POST /api/customer-auth/logout
// @access  Private/Customer
const logout = asyncHandler(async (req, res) => {
  res.cookie('customerToken', 'none', { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get currently logged in customer
// @route   GET /api/customer-auth/me
// @access  Private/Customer
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, customer: req.customer });
});

// @desc    Update own profile
// @route   PUT /api/customer-auth/profile
// @access  Private/Customer
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const customer = await Customer.findById(req.customer.id);
  if (name) customer.name = name;
  if (phone) customer.phone = phone;
  if (avatar) customer.avatar = avatar;
  await customer.save();
  res.status(200).json({ success: true, customer });
});

// @desc    Update own password
// @route   PUT /api/customer-auth/password
// @access  Private/Customer
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const customer = await Customer.findById(req.customer.id).select('+password');
  if (!(await customer.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  customer.password = newPassword;
  await customer.save();
  sendTokenResponse(customer, 200, res);
});

// @desc    Sign in (or sign up, if new) with a Google ID token from the frontend
// @route   POST /api/customer-auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error('Google credential is required');
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error('Google Sign-In is not configured on the server (missing GOOGLE_CLIENT_ID)');
  }

  // Verifies the token was actually issued by Google for OUR client ID,
  // and wasn't tampered with. Throws if invalid/expired.
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture, email_verified: emailVerified } = payload;

  if (!emailVerified) {
    res.status(400);
    throw new Error('Google account email is not verified');
  }

  // Find by googleId first (returning user), then fall back to matching by
  // email (someone who originally signed up with a password, now using
  // Google with the same address) - link the accounts in that case.
  let customer = await Customer.findOne({ googleId });
  if (!customer) {
    customer = await Customer.findOne({ email });
    if (customer) {
      customer.googleId = googleId;
      customer.authProvider = 'google';
      if (!customer.avatar) customer.avatar = picture || '';
      await customer.save();
    } else {
      customer = await Customer.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        avatar: picture || '',
      });
    }
  }

  if (!customer.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  sendTokenResponse(customer, 200, res);
});

module.exports = { register, login, logout, getMe, updateProfile, updatePassword, googleAuth };

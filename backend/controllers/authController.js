const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) || 7;

  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
};

// @desc    Register a new admin/editor user (admin only, used to add team members)
// @route   POST /api/auth/register
// @access  Private/Admin
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }
  const user = await User.create({ name, email, password, role: role || 'editor' });
  sendTokenResponse(user, 201, res);
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }
  sendTokenResponse(user, 200, res);
});

// @desc    Logout - clears the auth cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Update profile (name, email, avatar)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const user = await User.findById(req.user.id);
  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

module.exports = { register, login, logout, getMe, updateProfile, updatePassword };

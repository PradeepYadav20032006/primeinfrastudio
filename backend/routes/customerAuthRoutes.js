const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protectCustomer } = require('../middleware/customerAuth');
const {
  register, login, logout, getMe, updateProfile, updatePassword, googleAuth,
} = require('../controllers/customerAuthController');

const router = express.Router();

router.post('/google', [body('credential').notEmpty().withMessage('Google credential is required')], validate, googleAuth);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  validate,
  login
);

router.post('/logout', protectCustomer, logout);
router.get('/me', protectCustomer, getMe);
router.put('/profile', protectCustomer, updateProfile);
router.put(
  '/password',
  protectCustomer,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validate,
  updatePassword
);

module.exports = router;

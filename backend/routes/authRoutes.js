const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { register, login, logout, getMe, updateProfile, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  protect,
  authorize('admin'),
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put(
  '/password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validate,
  updatePassword
);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { protectCustomer, attachCustomerIfPresent } = require('../middleware/customerAuth');
const ctrl = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  attachCustomerIfPresent,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  ctrl.createOne
);

router.get('/my', protectCustomer, ctrl.getMyMessages);
router.get('/', protect, authorize('admin', 'editor'), ctrl.getAll);
router.get('/:idOrSlug', protect, authorize('admin', 'editor'), ctrl.getOne);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

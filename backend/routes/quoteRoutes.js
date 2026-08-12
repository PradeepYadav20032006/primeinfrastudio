const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { protectCustomer, attachCustomerIfPresent } = require('../middleware/customerAuth');
const ctrl = require('../controllers/quoteController');

const router = express.Router();

router.post(
  '/',
  attachCustomerIfPresent,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('projectType').notEmpty().withMessage('Project type is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  validate,
  ctrl.createOne
);

router.get('/my', protectCustomer, ctrl.getMyQuotes);
router.get('/', protect, authorize('admin', 'editor'), ctrl.getAll);
router.get('/:idOrSlug', protect, authorize('admin', 'editor'), ctrl.getOne);
router.get('/:id/pdf', protect, authorize('admin', 'editor'), ctrl.downloadQuotePDF);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

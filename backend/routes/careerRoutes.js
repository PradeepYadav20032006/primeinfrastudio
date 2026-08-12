const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/careerController');

const router = express.Router();

router.post(
  '/',
  upload.single('resume'),
  [
    body('fullName').notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('positionAppliedFor').notEmpty(),
  ],
  validate,
  ctrl.createOne
);

router.get('/', protect, authorize('admin', 'editor'), ctrl.getAll);
router.get('/:idOrSlug', protect, authorize('admin', 'editor'), ctrl.getOne);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

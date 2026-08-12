const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/blogController');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:idOrSlug', ctrl.getOne);
router.post(
  '/',
  protect,
  authorize('admin', 'editor'),
  [body('title').notEmpty(), body('excerpt').notEmpty(), body('content').notEmpty()],
  validate,
  ctrl.createOne
);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

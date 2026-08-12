const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/projectController');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:idOrSlug', ctrl.getOne);

router.post(
  '/',
  protect,
  authorize('admin', 'editor'),
  upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
  [body('title').notEmpty(), body('category').notEmpty(), body('location').notEmpty(), body('description').notEmpty()],
  validate,
  ctrl.createOne
);

router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

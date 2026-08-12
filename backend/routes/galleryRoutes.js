const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/galleryController');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:idOrSlug', ctrl.getOne);
router.post('/', protect, authorize('admin', 'editor'), ctrl.createOne);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

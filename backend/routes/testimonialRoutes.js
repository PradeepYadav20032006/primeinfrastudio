const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/testimonialController');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:idOrSlug', ctrl.getOne);
router.post('/', [body('clientName').notEmpty(), body('message').notEmpty()], validate, ctrl.createOne);
router.put('/:id', protect, authorize('admin', 'editor'), ctrl.updateOne);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteOne);

module.exports = router;

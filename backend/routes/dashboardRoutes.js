const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'editor'), getStats);

module.exports = router;

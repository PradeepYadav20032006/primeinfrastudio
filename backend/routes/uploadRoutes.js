const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc  Generic single/multiple image upload utility used by the admin dashboard
// @route POST /api/upload
router.post('/', protect, authorize('admin', 'editor'), upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.status(200).json({ success: true, urls });
});

module.exports = router;

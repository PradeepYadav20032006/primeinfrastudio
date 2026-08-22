const express = require('express');
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/chatbotController');

const router = express.Router();

// Rate limiting for chatbot: 60 requests per 15 minutes to prevent spam
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  message: { 
    success: false, 
    message: 'Too many messages sent. Please wait a few minutes before chatting again.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', chatLimiter, ctrl.handleChat);

module.exports = router;

const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Quote = require('../models/Quote');
const ContactMessage = require('../models/ContactMessage');
const CareerApplication = require('../models/CareerApplication');

// @desc    Aggregate stats for the admin dashboard
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    totalServices,
    totalBlogs,
    totalTestimonials,
    totalQuotes,
    newQuotes,
    totalMessages,
    unreadMessages,
    totalApplications,
    quotesByStatus,
    recentQuotes,
    recentMessages,
  ] = await Promise.all([
    Project.countDocuments(),
    Service.countDocuments(),
    Blog.countDocuments(),
    Testimonial.countDocuments(),
    Quote.countDocuments(),
    Quote.countDocuments({ status: 'New' }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: 'Unread' }),
    CareerApplication.countDocuments(),
    Quote.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Quote.find().sort('-createdAt').limit(5),
    ContactMessage.find().sort('-createdAt').limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totals: {
        projects: totalProjects,
        services: totalServices,
        blogs: totalBlogs,
        testimonials: totalTestimonials,
        quotes: totalQuotes,
        newQuotes,
        messages: totalMessages,
        unreadMessages,
        applications: totalApplications,
      },
      quotesByStatus,
      recentQuotes,
      recentMessages,
    },
  });
});

module.exports = { getStats };

const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const crudFactory = require('./crudFactory');

const base = crudFactory(Blog, {
  searchFields: ['title', 'excerpt', 'content', 'tags', 'category'],
});

// Override getOne to increment the view counter for public blog reads
const getOne = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const blog = await Blog.findOneAndUpdate(
    isObjectId ? { _id: idOrSlug } : { slug: idOrSlug },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }
  res.status(200).json({ success: true, data: blog });
});

module.exports = { ...base, getOne };

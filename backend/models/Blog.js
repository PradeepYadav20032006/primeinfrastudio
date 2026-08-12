const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    author: { type: String, default: 'PrimeInfraStudio Team' },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.pre('validate', function (next) {
  if (this.title) this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);

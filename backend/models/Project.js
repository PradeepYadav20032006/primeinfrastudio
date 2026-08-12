const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      required: true,
      enum: ['Residential', 'Commercial', 'Interior Design', 'Renovation', 'Industrial'],
    },
    location: { type: String, required: true },
    clientName: { type: String },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    area: { type: String },
    duration: { type: String },
    budgetRange: { type: String },
    status: { type: String, enum: ['Completed', 'Ongoing', 'Upcoming'], default: 'Completed' },
    featured: { type: Boolean, default: false },
    year: { type: Number, default: () => new Date().getFullYear() },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ProjectSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  }
  next();
});

ProjectSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);

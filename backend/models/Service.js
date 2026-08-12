const mongoose = require('mongoose');
const slugify = require('slugify');

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    icon: { type: String, default: 'Building2' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    image: { type: String, required: true },
    features: [{ type: String }],
    startingPrice: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.pre('validate', function (next) {
  if (this.title) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);

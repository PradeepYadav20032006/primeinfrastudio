const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Interior', 'Exterior', 'Construction', 'Renovation', 'Landscape'],
      default: 'Interior',
    },
    image: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);

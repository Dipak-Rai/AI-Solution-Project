const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true },
  fileName: { type: String, trim: true },
  description: { type: String, trim: true, default: '' },
  category: {
    type: String,
    enum: ['latest', 'upcoming', 'general'],
    default: 'general',
  },
  eventDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ category: 1 });

gallerySchema.methods.toClient = function () {
  const data = this.toObject({ getters: true });
  delete data.__v;
  return data;
};

module.exports = mongoose.model('Gallery', gallerySchema);

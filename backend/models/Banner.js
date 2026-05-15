const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  subtitle:    { type: String, default: '' },
  badge:       { type: String, default: '' },        // e.g. "🔥 Hot Deal"
  ctaText:     { type: String, default: 'Shop Now' },
  ctaLink:     { type: String, default: '' },        // affiliate link or category filter
  image:       { type: String, default: '' },        // uploaded image path
  bgColor:     { type: String, default: '#1e3a8a' }, // left panel gradient start
  bgColor2:    { type: String, default: '#4338ca' }, // left panel gradient end
  accentColor: { type: String, default: '#fbbf24' }, // badge + cta highlight
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 },         // display order
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
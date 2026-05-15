const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['Beauty', 'Headphones', 'Electronics', 'Fashion', 'Kitchen', 'Fitness', 'Books', 'Home Decor']
  },
  affiliateLink: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
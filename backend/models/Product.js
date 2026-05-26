const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: [
  'All',
  'Best Sellers',
  'Fashion',
  'Beauty',
  'Electronics',
  'Home',
  'Fitness',
  'Books',
]
  },
  affiliateLink: { type: String, required: true },
  rating:        { type: Number, min: 0, max: 5, default: 0 },
  featured:      { type: Boolean, default: false },

  // ── NEW: Audience targeting ───────────────────────────────────────
  // Who is this product for?
  // Default 'all' = shows everywhere (backward compatible)
  audience: {
    type:    String,
    enum:    ['all', 'men', 'women', 'kids', 'unisex'],
    default: 'all',
    index:   true,
  },

  // ── NEW: Region targeting ─────────────────────────────────────────
  // Where is this product available?
  // Default 'all' = shows in all regions (backward compatible)
  region: {
    type:    String,
    enum:    ['all', 'india', 'global'],
    default: 'all',
    index:   true,
  },

  // ── NEW: Tags for future use ──────────────────────────────────────
  // e.g. ['trending', 'new-arrival', 'sale', 'bestseller']
  tags: {
    type:    [String],
    default: [],
    index:   true,
  },

  // ── NEW: SEO slug ─────────────────────────────────────────────────
  // Auto-generated from name for clean URLs
  // e.g. /shop/men/fashion/blue-running-shoes
  slug: {
    type:   String,
    unique: false, // not required — generated on save if missing
    index:  true,
    sparse: true,
  },

}, { timestamps: true });

// ── Auto-generate slug before saving ──────────────────────────────
productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
      .replace(/\s+/g, '-')            // spaces to hyphens
      .replace(/-+/g, '-')             // collapse multiple hyphens
      .substring(0, 80);               // max 80 chars
  }
  next();
});

// ── Compound indexes for fast filtering ───────────────────────────
productSchema.index({ audience: 1, category: 1 });
productSchema.index({ region:   1, category: 1 });
productSchema.index({ audience: 1, region:   1 });
productSchema.index({ featured: 1, audience: 1 });
productSchema.index({ tags:     1 });
productSchema.index({ name: 'text', description: 'text' }); // full text search
module.exports = mongoose.model('Product', productSchema);
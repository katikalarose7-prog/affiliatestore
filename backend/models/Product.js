const mongoose = require('mongoose');

// ── Store config — single source of truth ─────────────────────────
const STORE_CATEGORIES = {
  amazon:   ['Electronics','Mobiles','Laptops','Kitchen','Furniture','Home Decor',
             'Appliances','Beauty','Fashion','Fitness','Books','Toys','Pet Supplies'],
  myntra:   ['Women Dresses','Women Tops','Women Kurtas','Women Sarees','Women Ethnic Wear',
             'Women Nightwear','Women Activewear','Women Footwear','Women Handbags',
             'Men T-Shirts','Men Shirts','Men Jeans','Men Trousers','Men Ethnic Wear',
             'Men Activewear','Men Nightwear','Men Footwear','Men Watches','Men Accessories',
             'Kids Clothing','Kids Footwear','Kids Accessories','Beauty'],
  flipkart: ['Mobiles','Electronics','Fashion','Home & Furniture','Appliances',
             'Beauty','Grocery','Sports','Toys','Books','Automotive'],
  ajio:     ['Women Dresses','Women Kurtas','Women Sarees','Women Ethnic Wear',
             'Women Nightwear','Women Footwear','Women Handbags',
             'Men T-Shirts','Men Shirts','Men Jeans','Men Ethnic Wear',
             'Men Footwear','Men Watches','Men Accessories',
             'Kids Clothing','Kids Footwear','Kids Accessories'],
}

const ALL_CATEGORIES = [...new Set([
  'Beauty','Headphones','Electronics','Fashion','Kitchen','Fitness',
  'Books','Home Decor','Clothing','Jewellery','Footwear','Bags',
  'Skincare','Watches','Sports','Toys','Other',
  ...Object.values(STORE_CATEGORIES).flat()
])]

const productSchema = new mongoose.Schema({
  // ── Core ──────────────────────────────────────────────────────────
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  image:         { type: String, default: '' },          // Cloudinary secure URL
  cloudinaryPublicId: { type: String, default: '' },     // FIX: store public_id for clean delete/update
  category:      { type: String, required: true },
  affiliateLink: { type: String, required: true },
  rating:        { type: Number, min: 0, max: 5, default: 0 },
  reviews:       { type: Number, default: 0 },
  featured:      { type: Boolean, default: false },

  // ── Store ─────────────────────────────────────────────────────────
  store: {
    type:    String,
    enum:    ['all', 'amazon', 'myntra', 'flipkart', 'ajio'],
    default: 'all',
    index:   true,
  },

  // ── Audience ──────────────────────────────────────────────────────
  audience: {
    type:    String,
    enum:    ['all', 'men', 'women', 'kids', 'unisex'],
    default: 'all',
    index:   true,
  },

  // ── Region ────────────────────────────────────────────────────────
  region: {
    type:    String,
    enum:    ['all', 'india', 'global'],
    default: 'all',
    index:   true,
  },

  // ── Tags (used for homepage quick-filters) ─────────────────────────
  // Tag conventions:
  //   'bestseller'   → Best Sellers filter
  //   'under199'     → Under ₹199 filter
  //   'under499'     → Under ₹499 filter
  //   'under999'     → Under ₹999 filter
  //   'trending'     → Trending Deals filter
  //   'newarrival'   → New Arrivals filter
  //   'toprated'     → Top Rated filter
  //   'editorspick'  → Editor's Picks filter
  tags: { type: [String], default: [], index: true },

  // ── SEO slug ──────────────────────────────────────────────────────
  slug: { type: String, index: true, sparse: true },

}, { timestamps: true })

// ── Auto-generate slug ────────────────────────────────────────────
productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 80)
  }
  next()
})

// ── Compound indexes ──────────────────────────────────────────────
productSchema.index({ store: 1, category: 1 })
productSchema.index({ store: 1, audience: 1 })
productSchema.index({ store: 1, featured: 1 })
productSchema.index({ audience: 1, category: 1 })
productSchema.index({ region: 1, category: 1 })
productSchema.index({ featured: 1, store: 1 })
productSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)

Product.STORE_CATEGORIES = STORE_CATEGORIES

module.exports = Product

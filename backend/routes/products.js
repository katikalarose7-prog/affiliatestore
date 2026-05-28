const express        = require('express');
const router         = express.Router();
const multer         = require('multer');
const cloudinary     = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product        = require('../models/Product');
const authMiddleware = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'primeoffers/products',
    allowed_formats: ['jpg','jpeg','png','webp','gif'],
    transformation:  [{ width:800, height:800, crop:'limit', quality:'auto', fetch_format:'auto' }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function normalizeText(text = '') {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim()
}

// ── In-memory cache ────────────────────────────────────────────────
// Layer 1: global.__productCache  — set at server startup (immediate)
// Layer 2: local cache            — refreshed every 3 minutes
const TTL = 3 * 60 * 1000
const cache = {
  data:      null,
  timestamp: 0,
  isValid()  {
    // Check local cache first
    if (this.data && (Date.now() - this.timestamp) < TTL) return true
    // Fall back to startup warm-up cache
    if (global.__productCache && (Date.now() - global.__productCache.ts) < TTL) {
      this.data      = global.__productCache.data
      this.timestamp = global.__productCache.ts
      return true
    }
    return false
  },
  set(data)  { this.data = data; this.timestamp = Date.now(); global.__productCache = { data, ts: Date.now() } },
  clear()    { this.data = null; this.timestamp = 0; global.__productCache = null },
};

// ═══════════════════════════════════════════════════════════
// PUBLIC: GET /api/products
// ═══════════════════════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    const {
      category, audience, region,
      minPrice, maxPrice, minRating,
      featured, search, tags,
      sort  = 'random',
      limit = 40,          // ← lowered from 200 to 40 for fast initial load
      page  = 1,
    } = req.query;

    const lim  = Math.min(parseInt(limit) || 40, 200); // max 200 per request
    const skip = (parseInt(page) - 1) * lim;

    // ── Use cache for the default homepage request (no filters) ──
    const isDefaultRequest = !category && !audience && !region &&
                             !minPrice  && !maxPrice  && !minRating &&
                             !featured  && !search    && !tags &&
                             sort === 'random' && page == 1;

    if (isDefaultRequest && cache.isValid()) {
      const cached = cache.data.slice(0, lim);
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    // ── Build filter ─────────────────────────────────────────
    const filter = {};

    if (category && category !== 'All') filter.category = category;

    if (audience && audience !== 'all') {
      filter.audience = { $in: [audience, 'all', 'unisex'] };
    }
    if (region && region !== 'all') {
      filter.region = { $in: [region, 'all'] };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (featured === 'true') filter.featured = true;
    if (search) {

  const normalizedSearch = normalizeText(search)

  filter.$or = [

    // Normal search
    { name:        { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { category:    { $regex: search, $options: 'i' } },
    { tags:        { $regex: search, $options: 'i' } },

    // Space-removed search
    { name:        { $regex: normalizedSearch, $options: 'i' } },
    { description: { $regex: normalizedSearch, $options: 'i' } },
    { category:    { $regex: normalizedSearch, $options: 'i' } },
    { tags:        { $regex: normalizedSearch, $options: 'i' } },

  ];
}
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagList };
    }

    // ── Query ────────────────────────────────────────────────
    let products;

    if (sort === 'random') {
      // ── FAST random: fetch slightly more than needed then JS shuffle ──
      // $sample on 1500 docs = full scan = SLOW
      // Instead: fetch with a fast indexed sort then shuffle in JS = FAST
      const fetchLimit = Math.min(lim * 3, 300); // fetch 3x then shuffle down
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region') // only needed fields
        .limit(fetchLimit)
        .lean();                                  // plain JS objects, faster than Mongoose docs

      // Fisher-Yates shuffle in memory
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      products = products.slice(0, lim);

    } else if (sort === 'latest') {
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region')
        .sort({ createdAt: -1 })
        .skip(skip).limit(lim).lean();

    } else if (sort === 'rating') {
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region')
        .sort({ rating: -1 })
        .skip(skip).limit(lim).lean();

    } else if (sort === 'price_asc') {
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region price')
        .sort({ price: 1 })
        .skip(skip).limit(lim).lean();

    } else if (sort === 'price_desc') {
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region price')
        .sort({ price: -1 })
        .skip(skip).limit(lim).lean();

    } else {
      products = await Product.find(filter)
        .select('name description image category affiliateLink rating featured audience region')
        .limit(lim).lean();
    }

    // ── Cache the default homepage result ────────────────────
    if (isDefaultRequest) {
      cache.set(products);
      res.set('X-Cache', 'MISS');
    }

    // ── HTTP cache headers (browser + Cloudflare edge cache) ─
    // Public GET requests can be cached at CDN level for 60 seconds
    if (req.method === 'GET' && !search) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/products/stats ────────────────────────────────
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [total, byAudience, byRegion, byCategory] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([{ $group: { _id: '$audience', count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$region',   count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    res.json({ total, byAudience, byRegion, byCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/products/:id ──────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, affiliateLink,
            rating, featured, audience, region, tags } = req.body;
const image = req.file
  ? req.file.path
  : ''

const product = new Product({
  name,
  description,
  price: parseFloat(price),
  image,
  category,
  affiliateLink,
  rating: parseFloat(rating) || 0,
  featured: featured === 'true' || featured === true,
  audience: audience || 'all',
  region: region || 'all',
  tags: tags
    ? tags.split(',').map(t => t.trim()).filter(Boolean)
    : [],
})
   
    await product.save();
    cache.clear(); // invalidate cache on write
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    if (req.file && existing.image && existing.image.includes('cloudinary')) {
      try {
        const parts = existing.image.split('/');
        const file  = parts[parts.length - 1].split('.')[0];
        const folder= parts[parts.length - 2];
        await cloudinary.uploader.destroy(`${folder}/${file}`);
      } catch (e) { console.warn('Could not delete old image:', e.message); }
    }

    const { name, description, price, category, affiliateLink,
            rating, featured, audience, region, tags } = req.body;
    const updateData = {
      name, description,
      price:    parseFloat(price),
      category, affiliateLink,
      rating:   parseFloat(rating) || 0,
      featured: featured === 'true' || featured === true,
      audience: audience || 'all',
      region:   region   || 'all',
      tags:     tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
if (req.file) updateData.image = req.file.path
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    cache.clear(); // invalidate cache on write
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    if (product.image && product.image.includes('cloudinary')) {
      try {
        const parts = product.image.split('/');
        const file  = parts[parts.length - 1].split('.')[0];
        const folder= parts[parts.length - 2];
        await cloudinary.uploader.destroy(`${folder}/${file}`);
      } catch (e) { console.warn('Could not delete image:', e.message); }
    }

    await Product.findByIdAndDelete(req.params.id);
    cache.clear(); // invalidate cache on write
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Bulk update ────────────────────────────────────────────
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) return res.status(400).json({ message: 'filter and update required' });
    const allowed = ['audience','region','tags','featured','category'];
    const safeUpdate = {};
    for (const key of allowed) {
      if (update[key] !== undefined) safeUpdate[key] = update[key];
    }
    const result = await Product.updateMany(filter, { $set: safeUpdate });
    cache.clear();
    res.json({ message: `Updated ${result.modifiedCount} products`, modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
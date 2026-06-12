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

// FIX: Renamed Cloudinary folder from 'primeoffers/products' → 'bestdealproducts/products'
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'bestdealproducts/products',
    allowed_formats: ['jpg','jpeg','png','webp','gif'],
    transformation:  [{ width:800, height:800, crop:'limit', quality:'auto', fetch_format:'auto' }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── In-memory cache ────────────────────────────────────────────────
const TTL = 3 * 60 * 1000
const cache = {
  data: null, timestamp: 0,
  isValid() {
    if (this.data && (Date.now() - this.timestamp) < TTL) return true
    if (global.__productCache && (Date.now() - global.__productCache.ts) < TTL) {
      this.data = global.__productCache.data
      this.timestamp = global.__productCache.ts
      return true
    }
    return false
  },
  set(data)  { this.data = data; this.timestamp = Date.now(); global.__productCache = { data, ts: Date.now() } },
  clear()    { this.data = null; this.timestamp = 0; global.__productCache = null },
}

// ── GET /api/products/search ───────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q, store } = req.query
    if (!q || q.trim().length < 1) return res.json([])

    const terms = q.trim().split(/\s+/).filter(Boolean)
    const nameFilter = terms.map(t => ({ name: { $regex: t, $options: 'i' } }))
    const filter = { $and: nameFilter }

    if (store && store !== 'all') {
      filter.store = store
    }

    const products = await Product.find(filter)
      .select('name image category rating store affiliateLink')
      .limit(8).lean()

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/products ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      category, audience, region, store,
      minRating, featured, search, tags,
      // Homepage quick-filter support
      priceUnder,
      sort  = 'random',
      limit = 40,
      page  = 1,
    } = req.query

    const lim  = Math.min(parseInt(limit) || 40, 200)
    const skip = (parseInt(page) - 1) * lim

    const isDefault = !category && !audience && !region && !store &&
                      !minRating && !featured && !search && !tags && !priceUnder &&
                      sort === 'random' && page == 1

    if (isDefault && cache.isValid()) {
      res.set('X-Cache', 'HIT')
      return res.json(cache.data.slice(0, lim))
    }

    const filter = {}

    if (category && category !== 'All')  filter.category = category
    if (audience && audience !== 'all')  filter.audience = { $in: [audience, 'all', 'unisex'] }
    if (region   && region   !== 'all')  filter.region   = { $in: [region,   'all'] }
    if (minRating)                       filter.rating   = { $gte: parseFloat(minRating) }
    if (featured === 'true')             filter.featured = true
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim())
      filter.tags   = { $in: tagList }
    }

    // Homepage quick-filter: priceUnder (stored in tags)
    if (priceUnder) {
      const tagMap = {
        '199':  'under199',
        '499':  'under499',
        '999':  'under999',
      }
      const tag = tagMap[priceUnder]
      if (tag) filter.tags = { $in: [tag] }
    }

    if (store && store !== 'all') {
      filter.store = store
    }

    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
      ]
    }

    const SELECT = 'name description image category affiliateLink rating reviews featured audience region store tags cloudinaryPublicId'

    let products

    if (sort === 'random') {
      const fetchLimit = Math.min(lim * 3, 300)
      products = await Product.find(filter).select(SELECT).limit(fetchLimit).lean()
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]]
      }
      products = products.slice(0, lim)
    } else if (sort === 'latest') {
      products = await Product.find(filter).select(SELECT).sort({ createdAt: -1 }).skip(skip).limit(lim).lean()
    } else if (sort === 'rating') {
      products = await Product.find(filter).select(SELECT).sort({ rating: -1 }).skip(skip).limit(lim).lean()
    } else {
      products = await Product.find(filter).select(SELECT).limit(lim).lean()
    }

    if (isDefault) {
      cache.set(products)
      res.set('X-Cache', 'MISS')
    }

    if (!search) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    }

    res.json(products)
  } catch (err) {
    console.error('GET /products error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/products/stats ───────────────────────────────────────
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [total, byAudience, byRegion, byCategory, byStore] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([{ $group: { _id: '$audience', count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$region',   count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$store',    count: { $sum: 1 } } }]),
    ])
    res.json({ total, byAudience, byRegion, byCategory, byStore })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/products/:id ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product) return res.status(404).json({ message: 'Not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/products ────────────────────────────────────────────
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const {
      name, description, category, affiliateLink,
      rating, featured, audience, region, tags, store
    } = req.body
    const image = req.file ? req.file.path : ''
    const cloudinaryPublicId = req.file ? req.file.filename : ''
    const product = new Product({
      name, description,
      image,
      cloudinaryPublicId,
      category,
      affiliateLink,
      rating:   parseFloat(rating)   || 0,
      featured: featured === 'true'  || featured === true,
      audience: audience || 'all',
      region:   region   || 'all',
      store:    store    || 'all',
      tags:     tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    await product.save()
    cache.clear()
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// ── PUT /api/products/:id ─────────────────────────────────────────
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Not found' })

    // Delete old Cloudinary image if a new one is uploaded
    if (req.file && existing.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId)
      } catch (e) { console.warn('Could not delete old image:', e.message) }
    } else if (req.file && existing.image && existing.image.includes('cloudinary')) {
      try {
        const parts = existing.image.split('/')
        const file  = parts[parts.length - 1].split('.')[0]
        const folder= parts[parts.length - 2]
        await cloudinary.uploader.destroy(`${folder}/${file}`)
      } catch (e) { console.warn('Could not delete old image:', e.message) }
    }

    const {
      name, description, category, affiliateLink,
      rating, featured, audience, region, tags, store
    } = req.body
    const updateData = {
      name, description, category, affiliateLink,
      rating:   parseFloat(rating)   || 0,
      featured: featured === 'true'  || featured === true,
      audience: audience || 'all',
      region:   region   || 'all',
      store:    store    || 'all',
      tags:     tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    if (req.file) {
      updateData.image = req.file.path
      updateData.cloudinaryPublicId = req.file.filename
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
    cache.clear()
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// ── DELETE /api/products/:id ──────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not found' })

    // Delete from Cloudinary using stored public_id
    if (product.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId)
      } catch (e) { console.warn('Could not delete image:', e.message) }
    } else if (product.image && product.image.includes('cloudinary')) {
      try {
        const parts = product.image.split('/')
        const file  = parts[parts.length - 1].split('.')[0]
        const folder= parts[parts.length - 2]
        await cloudinary.uploader.destroy(`${folder}/${file}`)
      } catch (e) { console.warn('Could not delete image:', e.message) }
    }

    await Product.findByIdAndDelete(req.params.id)
    cache.clear()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/products/bulk-update ────────────────────────────────
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { filter, update } = req.body
    if (!filter || !update) return res.status(400).json({ message: 'filter and update required' })
    const allowed = ['audience','region','tags','featured','category','store']
    const safeUpdate = {}
    for (const key of allowed) {
      if (update[key] !== undefined) safeUpdate[key] = update[key]
    }
    const result = await Product.updateMany(filter, { $set: safeUpdate })
    cache.clear()
    res.json({ message: `Updated ${result.modifiedCount} products`, modified: result.modifiedCount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;

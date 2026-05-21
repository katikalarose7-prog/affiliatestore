const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// ─── PUBLIC ROUTES ───────────────────────────────────────────

// GET all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, featured, search } = req.query;
    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    //if (search) filter.name = { $regex: search, $options: 'i' };
    if (search) {
  const keywords = search.trim().split(/\s+/)

  filter.$or = [
    {
      name: {
        $regex: keywords.join('|'),
        $options: 'i'
      }
    },
    {
      description: {
        $regex: keywords.join('|'),
        $options: 'i'
      }
    },
    {
      category: {
        $regex: keywords.join('|'),
        $options: 'i'
      }
    }
  ]
}

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN PROTECTED ROUTES ──────────────────────────────────

// POST create product
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, affiliateLink, rating, featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name, description,
      price: parseFloat(price),
      image,
      category,
      affiliateLink,
      rating: parseFloat(rating) || 0,
      featured: featured === 'true' || featured === true
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const { name, description, price, category, affiliateLink, rating, featured } = req.body;

    // If new image uploaded, delete old one
    if (req.file && existing.image) {
      const oldPath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updateData = {
      name, description,
      price: parseFloat(price),
      category,
      affiliateLink,
      rating: parseFloat(rating) || 0,
      featured: featured === 'true' || featured === true,
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    // Delete image file
    if (product.image) {
      const imgPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
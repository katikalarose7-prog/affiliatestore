const express       = require('express');
const router        = express.Router();
const multer        = require('multer');
const path          = require('path');
const fs            = require('fs');
const Banner        = require('../models/Banner');
const authMiddleware = require('../middleware/auth');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'banner-' + unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB for banners
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// ── PUBLIC ────────────────────────────────────────────────────
// GET all active banners (sorted by order)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN PROTECTED ───────────────────────────────────────────
// POST create banner
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, badge, ctaText, ctaLink,
            bgColor, bgColor2, accentColor, active, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const banner = new Banner({
      title, subtitle, badge, ctaText, ctaLink,
      image, bgColor, bgColor2, accentColor,
      active: active === 'true' || active === true,
      order:  parseInt(order) || 0,
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update banner
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await Banner.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    if (req.file && existing.image) {
      const old = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const { title, subtitle, badge, ctaText, ctaLink,
            bgColor, bgColor2, accentColor, active, order } = req.body;

    const update = {
      title, subtitle, badge, ctaText, ctaLink,
      bgColor, bgColor2, accentColor,
      active: active === 'true' || active === true,
      order:  parseInt(order) || 0,
    };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE banner
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Not found' });
    if (banner.image) {
      const imgPath = path.join(__dirname, '..', banner.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
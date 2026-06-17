// bulk-import.js  —  node bulk-import.js
require('dotenv').config();
const mongoose   = require('mongoose');
const fs         = require('fs');
const path       = require('path');
const cloudinary = require('./config/cloudinary');
const Product    = require('./models/Product');

// ── Product list ──────────────────────────────────────
// description: 2-4 meaningful sentences (Amazon requires real content)
// highlights:  3-5 bullet points — key reasons to buy
const products = [
  {
    title:     'Castor Oil - Cold Pressed',
    image:     'castoroil.png',
    affiliate: 'https://amzn.to/4exI8ci',
    category:  'Beauty',
    region:    'india',
    audience:  'all',
    rating:    4.2,
    tags:      ['bestseller'],
    description: 'A pure cold-pressed castor oil that promotes healthy hair growth and nourishes the scalp. Rich in ricinoleic acid, it deeply conditions hair, reduces breakage, and adds thickness over time. Also effective as a moisturiser for dry skin and cracked heels.',
    highlights: [
      'Cold-pressed to retain all natural nutrients and fatty acids',
      'Stimulates hair follicles for thicker, longer hair growth',
      'Free from mineral oils, parabens, and artificial additives',
      'Multi-use: hair, scalp, skin, eyebrows, and eyelashes',
    ],
  },
  {
    title:     'Ear Rings - Pack of 24 Gold Plated',
    image:     'earrings.png',
    affiliate: 'https://amzn.to/4exI8ci',
    category:  'Jewellery',
    region:    'india',
    audience:  'women',
    rating:    4.0,
    tags:      ['trending'],
    description: 'A value pack of 24 beautifully designed gold-plated ear rings suited for everyday wear and festive occasions. Each pair features a secure locking mechanism so you never worry about losing one. The lightweight design ensures comfort even during long hours of wear.',
    highlights: [
      'Pack of 24 pairs — great variety for every outfit',
      'Gold-plated finish with tarnish-resistant coating',
      'Hypoallergenic posts — safe for sensitive ears',
      'Lightweight design comfortable for all-day wear',
    ],
  },
  {
    title:     'ALPS Goodness RoseMary Water for Hair Growth',
    image:     'rosemarywater.png',
    affiliate: 'https://amzn.to/4vHHqiv',
    category:  'Beauty',
    region:    'india',
    audience:  'all',
    rating:    4.3,
    tags:      ['toprated'],
    description: 'ALPS Goodness Rosemary Water is a natural hair tonic that strengthens roots, reduces hair fall, and promotes new growth. Rosemary has clinically proven hair-growth benefits comparable to minoxidil, without the side effects. Simply spray on the scalp and massage for best results.',
    highlights: [
      'Contains pure rosemary extract — clinically proven for hair growth',
      'Reduces hair fall and strengthens roots from within',
      'No sulphates, silicones, or parabens',
      'Easy spray bottle — no mess, no rinse needed',
      'Suitable for all hair types including colour-treated hair',
    ],
  },
  {
    title:     'Premium Black Car Seat Back Organiser with Foldable Tray',
    image:     'carorganiser.png',
    affiliate: 'https://amzn.to/3QcSrt2',
    category:  'Automotive',
    region:    'india',
    audience:  'all',
    rating:    4.1,
    tags:      ['bestseller'],
    description: 'Keep your car interior neat and organised with this multi-pocket seat-back organiser. Features a foldable dining tray, tablet holder, and multiple pockets for water bottles, snacks, and essentials. Ideal for long road trips and keeping rear-seat passengers comfortable.',
    highlights: [
      'Foldable tray table — perfect for work and eating on the go',
      'Built-in tablet/iPad holder with adjustable strap',
      'Multiple pockets for bottles, snacks, phones, and books',
      'Universal fit — attaches securely to any car headrest',
      'Premium Oxford fabric — easy to clean and long-lasting',
    ],
  },
  {
    title:     'FITVERT Car Door Edge & Body Protector Pads — 12 Piece Silicone',
    image:     'fitvert.png',
    affiliate: 'https://amzn.to/4vHpxAi',
    category:  'Automotive',
    region:    'india',
    audience:  'all',
    rating:    4.0,
    tags:      ['under499'],
    description: 'Protect your car doors and body panels from dents and scratches with these self-adhesive silicone guard pads. Designed to absorb impact when doors open in tight parking spots. The transparent design keeps your car looking clean while providing solid protection.',
    highlights: [
      'Pack of 12 — covers all four doors front and back',
      'High-grade silicone absorbs impact and prevents dents',
      '3M self-adhesive backing — no tools, installs in minutes',
      'Transparent design — virtually invisible on your car',
      'Weather-resistant — works in extreme heat and cold',
    ],
  },
  {
    title:     'Humble Car Dashboard Phone Holder — 360° Adjustable',
    image:     'humblecar.png',
    affiliate: 'https://amzn.to/4ecwlyD',
    category:  'Automotive',
    region:    'india',
    audience:  'all',
    rating:    4.2,
    tags:      ['under499'],
    description: 'A sturdy 360-degree adjustable phone mount that keeps your device at eye level for safe navigation while driving. The strong suction base stays firmly in place even on bumpy roads. Compatible with all smartphones up to 7 inches wide.',
    highlights: [
      '360° rotation — view your phone in portrait or landscape',
      'Industrial-strength suction cup — stays firm on any surface',
      'One-handed operation with squeeze-release arm',
      'Fits all smartphones from 4" to 7" wide',
      'Reduces neck strain vs. holding your phone while driving',
    ],
  },
];

// ── Cloudinary upload ─────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function uploadToCloudinary(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder:          'bestdealproducts/products',
    use_filename:    true,
    unique_filename: true,
    overwrite:       false,
    transformation:  [{ width:800, height:800, crop:'limit', quality:'auto', fetch_format:'auto' }],
  });
  return { url: result.secure_url, public_id: result.public_id };
}

// ── Main ──────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  MongoDB connected\n');

  const summary = { imported:0, skipped:0, missingImages:0, failed:0, errors:[] };

  for (const item of products) {
    const label = item.title.slice(0, 50);

    // 1. Skip duplicates
    const existing = await Product.findOne({ affiliateLink: item.affiliate });
    if (existing) { console.log(`⏭️  Duplicate — skipping: ${label}…`); summary.skipped++; continue; }

    // 2. Resolve image
    const imagePath   = item.image ? path.join(UPLOADS_DIR, item.image) : null;
    const imageExists = imagePath && fs.existsSync(imagePath);
    if (item.image && !imageExists) { console.warn(`⚠️  Image not found: ${item.image}`); summary.missingImages++; }

    // 3. Cloudinary upload
    let imageUrl = '', cloudinaryPublicId = '';
    if (imageExists) {
      try {
        const up = await uploadToCloudinary(imagePath);
        imageUrl = up.url; cloudinaryPublicId = up.public_id;
        console.log(`☁️  Uploaded: ${item.image}`);
      } catch (e) {
        console.error(`❌  Cloudinary failed for ${item.image}: ${e.message}`);
        summary.errors.push(`${label}: ${e.message}`);
      }
    }

    // 4. Save to MongoDB
    try {
      await Product.create({
        name:               item.title,
        description:        item.description || item.title,
        highlights:         item.highlights  || [],
        image:              imageUrl,
        cloudinaryPublicId: cloudinaryPublicId,
        category:           item.category || 'Beauty',
        affiliateLink:      item.affiliate,
        rating:             parseFloat(item.rating) || 0,
        featured:           item.featured || false,
        region:             item.region   || 'all',
        audience:           item.audience || 'all',
        tags:               item.tags     || [],
        store:              item.store    || 'amazon',
      });
      console.log(`✅  Imported: ${label}…`);
      summary.imported++;
    } catch (e) {
      console.error(`❌  DB failed for "${label}": ${e.message}`);
      summary.errors.push(`${label}: ${e.message}`);
      summary.failed++;
    }
  }

  console.log('\n════════════════════════════════════════');
  console.log('           IMPORT SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`  ✅  Imported       : ${summary.imported}`);
  console.log(`  ⏭️   Skipped (dup)  : ${summary.skipped}`);
  console.log(`  ⚠️   Missing images : ${summary.missingImages}`);
  console.log(`  ❌  Failed         : ${summary.failed}`);
  if (summary.errors.length) { console.log('\n  Errors:'); summary.errors.forEach(e => console.log(`  • ${e}`)); }
  console.log('════════════════════════════════════════\n');
  process.exit(0);
}

run().catch(err => { console.error('❌  Fatal:', err.message); process.exit(1); });

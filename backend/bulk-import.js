// bulk-import.js
// Run: node bulk-import.js
//
// What this does:
//   1. Reads product list below
//   2. Matches each product with an image file in ./uploads/
//   3. Uploads matched images to Cloudinary (folder: bestdealproducts/products)
//   4. Stores Cloudinary URL + public_id in MongoDB
//   5. Skips duplicates (matched by affiliateLink)
//   6. Logs a full import summary at the end

require('dotenv').config();
const mongoose  = require('mongoose');
const fs        = require('fs');
const path      = require('path');
const cloudinary = require('./config/cloudinary');
const Product   = require('./models/Product');

// ── Product list ───────────────────────────────────────────────────
// image field: filename only (no path). The script will find it in ./uploads/
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
  },
  {
    title:     'Ear rings - pack of 24 - gold plated ear rings',
    image:     'earrings.png',
    affiliate: 'https://amzn.to/4exI8ci',
    category:  'Beauty',
    region:    'india',
    audience:  'women',
    rating:    4.0,
    tags:      ['trending'],
  },
  {
    title:     'ALPS Goodness - RoseMary Water for Hair Growth',
    image:     'rosemarywater.png',
    affiliate: 'https://amzn.to/4vHHqiv',
    category:  'Beauty',
    region:    'india',
    audience:  'all',
    rating:    4.3,
    tags:      ['toprated'],
  },
  {
    title:     'Premium Black Car Seat Back Organizer with Foldable Tray and Multi-Pocket Storage',
    image:     'carorganiser.png',
    affiliate: 'https://amzn.to/3QcSrt2',
    category:  'Electronics',
    region:    'india',
    audience:  'all',
    rating:    4.1,
    tags:      ['bestseller'],
  },
  {
    title:     'FITVERT Car Door Edge & Body Protector Pads – 12-Piece Silicone Shock Guards',
    image:     'fitvert.png',
    affiliate: 'https://amzn.to/4vHpxAi',
    category:  'Electronics',
    region:    'india',
    audience:  'all',
    rating:    4.0,
    tags:      ['under499'],
  },
  {
    title:     'Humble Car Dashboard Phone Holder – 360° Adjustable with Non-Slip Silicone Grip',
    image:     'humblecar.png',
    affiliate: 'https://amzn.to/4ecwlyD',
    category:  'Electronics',
    region:    'india',
    audience:  'all',
    rating:    4.2,
    tags:      ['under499'],
  },
];

// ── Helpers ───────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');

/**
 * Upload a local image file to Cloudinary.
 * Returns { url, public_id } or throws on failure.
 */
async function uploadToCloudinary(filePath, productTitle) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder:         'bestdealproducts/products',
    use_filename:   true,
    unique_filename: true,
    overwrite:      false,
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
    ],
  });
  return { url: result.secure_url, public_id: result.public_id };
}

// ── Main ──────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  MongoDB connected\n');

  const summary = {
    imported:      0,
    skipped:       0,
    missingImages: 0,
    failed:        0,
    errors:        [],
  };

  for (const item of products) {
    const label = item.title.slice(0, 55);

    // ── 1. Skip duplicates ────────────────────────────────────────
    const existing = await Product.findOne({ affiliateLink: item.affiliate });
    if (existing) {
      console.log(`⏭️   Duplicate – skipping: ${label}…`);
      summary.skipped++;
      continue;
    }

    // ── 2. Resolve image path ─────────────────────────────────────
    const imagePath = item.image ? path.join(UPLOADS_DIR, item.image) : null;
    const imageExists = imagePath && fs.existsSync(imagePath);

    if (item.image && !imageExists) {
      console.warn(`⚠️   Image not found: ${item.image} — importing without image`);
      summary.missingImages++;
    }

    // ── 3. Upload to Cloudinary ───────────────────────────────────
    let imageUrl         = '';
    let cloudinaryPublicId = '';

    if (imageExists) {
      try {
        const uploaded = await uploadToCloudinary(imagePath, item.title);
        imageUrl           = uploaded.url;
        cloudinaryPublicId = uploaded.public_id;
        console.log(`☁️   Uploaded to Cloudinary: ${item.image}`);
      } catch (uploadErr) {
        console.error(`❌   Cloudinary upload failed for ${item.image}: ${uploadErr.message}`);
        summary.errors.push(`${label}: Cloudinary error – ${uploadErr.message}`);
        // Continue without image rather than aborting the whole import
      }
    }

    // ── 4. Save to MongoDB ────────────────────────────────────────
    try {
      await Product.create({
        name:               item.title,
        description:        item.title,
        image:              imageUrl,
        cloudinaryPublicId: cloudinaryPublicId,
        category:           item.category  || 'Beauty',
        affiliateLink:      item.affiliate,
        rating:             parseFloat(item.rating) || 0,
        featured:           item.featured  || false,
        region:             item.region    || 'all',
        audience:           item.audience  || 'all',
        tags:               item.tags      || [],
      });
      console.log(`✅  Imported: ${label}…`);
      summary.imported++;
    } catch (dbErr) {
      console.error(`❌   DB save failed for "${label}": ${dbErr.message}`);
      summary.errors.push(`${label}: DB error – ${dbErr.message}`);
      summary.failed++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════');
  console.log('           IMPORT SUMMARY');
  console.log('════════════════════════════════════════════');
  console.log(`  ✅  Imported      : ${summary.imported}`);
  console.log(`  ⏭️   Skipped (dup) : ${summary.skipped}`);
  console.log(`  ⚠️   Missing images: ${summary.missingImages}`);
  console.log(`  ❌  Failed        : ${summary.failed}`);
  if (summary.errors.length > 0) {
    console.log('\n  Errors:');
    summary.errors.forEach(e => console.log(`    • ${e}`));
  }
  console.log('════════════════════════════════════════════\n');

  process.exit(0);
}

run().catch(err => {
  console.error('❌  Fatal error:', err.message);
  process.exit(1);
});

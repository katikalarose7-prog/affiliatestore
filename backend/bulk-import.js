// bulk-import.js  —  node bulk-import.js
require('dotenv').config();
const mongoose   = require('mongoose');
const fs         = require('fs');
const path       = require('path');
const cloudinary = require('./config/cloudinary');
const Product    = require('./models/Product');
const flipkartProducts = require('./flipkart-products.js');

// ── Product list ──────────────────────────────────────
// description: 2-4 meaningful sentences (Amazon requires real content)
// highlights:  3-5 bullet points — key reasons to buy
//
// NOTE ON `image`:
//   - A plain filename (e.g. 'castoroil.png') is looked up in ./uploads
//     and uploaded to Cloudinary, as before.
//   - A full URL (starts with http:// or https://) is treated as an
//     already-hosted remote image and used AS-IS — no Cloudinary
//     upload happens for these.
//
// NOTE ON SHAPE — this file now accepts items in EITHER shape:
//   old/raw scrape shape:    { title, image, affiliate, category, ... }
//   schema-ready shape:      { name, image, affiliateLink, category, ... }
// (the schema-ready shape is what earnkaro-to-schema.js's browser
// script now outputs directly). normalizeItem() below reads whichever
// fields are present so you can paste either shape in without editing
// the import logic each time.
const meeshoProducts = [
  {
    "name": "Women Rayon Jivika Voguish Women Kurta Sets",
    "description": "Women Rayon Jivika Voguish Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Soft and comfortable rayon fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/32962343/ir564_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/AzhNkBJ",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Kurta Sets",
    "description": "Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/502998324/uzckm_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/OjbvZgI",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Trendy Petite Women Kurta Sets",
    "description": "Trendy Petite Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/156518071/0amdq_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/nm4vDjD",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Rayon Adrika Graceful Women Kurta Sets",
    "description": "Women Rayon Adrika Graceful Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Soft and comfortable rayon fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/18604747/01493_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/Dl9EQxf",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Chitrarekha Petite Women Kurta Sets",
    "description": "Chitrarekha Petite Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/299067800/lodp2_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/2iFcdtX",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Cotton Kashvi Fashionable Women Kurta Sets",
    "description": "Women Cotton Kashvi Fashionable Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Comfortable cotton fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/330040829/rjvp4_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/A0INotZ",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Rayon Charvi Sensational Women Kurta Sets",
    "description": "Women Rayon Charvi Sensational Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Soft and comfortable rayon fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/538751297/rpz64_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/23gbnnu",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Jivika Pretty Women Kurta Sets",
    "description": "Jivika Pretty Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/424059908/03omz_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/R2CiMwW",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Viscose Rayon Jivika Attractive Women Kurta Sets",
    "description": "Women Viscose Rayon Jivika Attractive Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Soft and comfortable rayon fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/538224697/n3tvj_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/Vwjr7R1",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Aagyeyi Sensational Women Kurta Sets",
    "description": "Aagyeyi Sensational Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/387883442/bb28w_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/EB6XGUV",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Cotton Aishani Fashionable Women Kurta Sets",
    "description": "Women Cotton Aishani Fashionable Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Comfortable cotton fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/376902392/vz8cg_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/0UbqNW9",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Women Rayon Trendy Fabulous Women Kurta Sets",
    "description": "Women Rayon Trendy Fabulous Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Soft and comfortable rayon fabric",
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/18833757/f1e08_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/VwnXIC0",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Alisha Superior Women Kurta Sets",
    "description": "Alisha Superior Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/319207700/kxgy8_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/53emi1r",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Alisha Ensemble Women Kurta Sets",
    "description": "Alisha Ensemble Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/180708156/fi16z_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/QPXT57Q",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Aishani Attractive Women Kurta Sets",
    "description": "Aishani Attractive Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/280122185/cgz9o_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/2gi5JI4",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Charvi Ensemble Women Kurta Sets",
    "description": "Charvi Ensemble Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/335948914/vr6p8_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/Xa1z2PV",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Abhisarika Sensational Women Kurta Sets",
    "description": "Abhisarika Sensational Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/381228447/qkned_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/U2IErwD",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Abhisarika Pretty Women Kurta Sets",
    "description": "Abhisarika Pretty Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/382035801/ie1a4_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/WA38WBx",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Chitrarekha Sensational Women Kurta Sets",
    "description": "Chitrarekha Sensational Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/544666764/vtnsp_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/Mq3KKvj",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  },
  {
    "name": "Alisha Pretty Women Kurta Sets",
    "description": "Alisha Pretty Women Kurta Sets. A stylish fashion choice available on Meesho. Check the latest price, available sizes, colours and offers before purchasing.",
    "highlights": [
      "Stylish ethnic wear",
      "Available through Meesho"
    ],
    "image": "https://images.meesho.com/images/products/547159254/u2xz6_512.webp",
    "category": "Fashion",
    "affiliateLink": "https://bitli.in/ua3ME2Q",
    "rating": 0,
    "reviews": 0,
    "featured": false,
    "store": "meesho",
    "audience": "women",
    "region": "india",
    "tags": []
  }
];

// Combined product list: existing Meesho items + newly added Flipkart items
const products = [
  ...meeshoProducts,
  ...flipkartProducts
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

function cleanUrl(value) {
  if (typeof value !== 'string') return '';

  value = value.trim();

  // Convert Markdown link:
  // [https://example.com](https://example.com)
  // into:
  // https://example.com
  const markdownMatch = value.match(/^\[.*?\]\((https?:\/\/[^)]+)\)$/i);

  if (markdownMatch) {
    return markdownMatch[1];
  }

  return value;
}

function isRemoteUrl(image) {
  return typeof image === 'string' && /^https?:\/\//i.test(image.trim());
}

function normalizeItem(item) {
  return {
    title: item.title || item.name,

    affiliate: cleanUrl(
      item.affiliate || item.affiliateLink
    ),

    image: cleanUrl(item.image),

    description: item.description,
    highlights: item.highlights,
    category: item.category,
    rating: item.rating,
    featured: item.featured,
    region: item.region,
    audience: item.audience,
    tags: item.tags,
    store: item.store,
  };
}
// ── Main ──────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  MongoDB connected\n');

  const summary = { imported:0, skipped:0, missingImages:0, failed:0, invalid:0, errors:[] };

  for (const raw of products) {
    const item = normalizeItem(raw);

    if (!item.title || !item.affiliate) {
      console.warn(`⚠️  Skipping malformed entry (missing title/name or affiliate link): ${JSON.stringify(raw).slice(0, 80)}...`);
      summary.invalid++;
      continue;
    }

    const label = item.title.slice(0, 50);

    // 1. Skip duplicates
    const existing = await Product.findOne({
  affiliateLink: item.affiliate
});

if (existing) {
  try {
    await Product.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: item.title,
          description: item.description || item.title,
          highlights: item.highlights || [],
          category: item.category || 'Fashion',
          rating: parseFloat(item.rating) || 0,
          featured: item.featured || false,
          region: item.region || 'all',
          audience: item.audience || 'all',
          tags: item.tags || [],
          store: item.store || 'meesho'
        }
      }
    );

    console.log(`🔄 Updated: ${label}…`);
    continue;

  } catch (e) {
    console.error(`❌ Update failed for "${label}": ${e.message}`);
    continue;
  }
}

    // 2. Resolve image — remote URL vs local file
    let imageUrl = '', cloudinaryPublicId = '';

    if (isRemoteUrl(item.image)) {
      // Already-hosted image (e.g. FirstCry CDN) — use directly, no
      // Cloudinary upload.
      imageUrl = item.image;
      console.log(`🔗  Using remote image: ${item.image}`);
    } else {
      const imagePath   = item.image ? path.join(UPLOADS_DIR, item.image) : null;
      const imageExists = imagePath && fs.existsSync(imagePath);
      if (item.image && !imageExists) { console.warn(`⚠️  Image not found: ${item.image}`); summary.missingImages++; }

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
    }

    // 3. Save to MongoDB
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
  console.log(`  ⚠️   Invalid entries: ${summary.invalid}`);
  if (summary.errors.length) { console.log('\n  Errors:'); summary.errors.forEach(e => console.log(`  • ${e}`)); }
  console.log('════════════════════════════════════════\n');
  process.exit(0);
}

run().catch(err => { console.error('❌  Fatal:', err.message); process.exit(1); });
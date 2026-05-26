// migrate-products.js
// Place in: backend/migrate-products.js
// Run ONCE: node migrate-products.js
//
// Automatically assigns audience + region to existing products
// based on their category name — no manual work needed.

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

// ── Rules: category → { audience, region } ────────────────────────
// Adjust these rules to match your actual product catalog
const RULES = [
  // Women-specific categories
  { match: { category: { $in: ['Beauty', 'Skincare', 'Jewellery'] } },
    update: { audience: 'women', region: 'all' } },

  // Men-specific categories
  { match: { category: { $in: ['Headphones', 'Electronics', 'Sports'] } },
    update: { audience: 'all', region: 'all' } },

  // Unisex categories
  { match: { category: { $in: ['Fashion', 'Footwear', 'Bags', 'Watches', 'Clothing'] } },
    update: { audience: 'unisex', region: 'all' } },

  // Region: India-specific (Indian brands/products)
  { match: { $or: [
      { affiliateLink: { $regex: 'amazon\\.in',  $options: 'i' } },
      { affiliateLink: { $regex: 'flipkart\\.com',$options: 'i' } },
      { affiliateLink: { $regex: 'meesho\\.com',  $options: 'i' } },
    ]},
    update: { region: 'india' }
  },

  // Region: Global (non-India links)
  { match: { $and: [
      { affiliateLink: { $not: /amazon\.in/i   } },
      { affiliateLink: { $not: /flipkart\.com/i} },
      { affiliateLink: { $regex: 'amazon\\.(com|co\\.uk|de|fr|ca|au)', $options: 'i' } },
    ]},
    update: { region: 'global' }
  },

  // Fallback: everything else gets audience=all, region=all
  // (already default from schema, this just makes it explicit)
  { match: { audience: { $exists: false } },
    update: { audience: 'all', region: 'all' } },
  { match: { region:   { $exists: false } },
    update: { region: 'all' } },
];

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB\n');

  const total = await Product.countDocuments();
  console.log(`📦  Total products: ${total}\n`);

  // Step 1: Set defaults on ALL products first
  const defaultResult = await Product.updateMany(
    {},
    {
      $set: {
        audience: 'all',
        region:   'all',
        tags:     [],
      }
    }
  );
  console.log(`✅  Set defaults on ${defaultResult.modifiedCount} products\n`);

  // Step 2: Apply specific rules
  for (const rule of RULES) {
    try {
      const result = await Product.updateMany(rule.match, { $set: rule.update });
      if (result.modifiedCount > 0) {
        console.log(`✅  Rule applied: ${JSON.stringify(rule.update)} → ${result.modifiedCount} products`);
      }
    } catch (e) {
      console.warn(`⚠️   Rule failed: ${e.message}`);
    }
  }

  // Step 3: Generate slugs for all products
  console.log('\n🔄  Generating slugs...');
  const products = await Product.find({ slug: { $exists: false } });
  let slugged = 0;
  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 80);
    await Product.updateOne({ _id: p._id }, { $set: { slug } });
    slugged++;
  }
  console.log(`✅  Generated slugs for ${slugged} products`);

  // Step 4: Print summary
  console.log('\n📊  Migration Summary:');
  const summary = await Product.aggregate([
    { $group: {
      _id: { audience: '$audience', region: '$region' },
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ]);

  for (const s of summary) {
    console.log(`   audience=${s._id.audience}  region=${s._id.region}  →  ${s.count} products`);
  }

  console.log('\n🎉  Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌  Migration failed:', err.message);
  process.exit(1);
});
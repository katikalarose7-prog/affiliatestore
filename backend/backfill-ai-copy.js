/**
 * backfill-ai-copy.js
 *
 * Run this once (and again whenever new products are added) to
 * generate and store real AI copy for every product that doesn't
 * have it yet, on product.aiCopy.
 *
 * Usage:  node backfill-ai-copy.js
 *
 * Lives in backend/ root alongside your other one-off scripts
 * (bulk-import.js, fix-affiliate.js, migrate-products.js).
 */

require('dotenv').config(); // loads .env — this script runs standalone, not through server.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { generateProductCopy } = require('./services/aiCopyGenerator');

// Check your .env / config for the actual variable name you use —
// adjust if it's neither of these.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const DELAY_MS = 1200; // small gap between calls to stay well under rate limits

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!MONGO_URI) {
    throw new Error('No Mongo connection string found in process.env — check your .env variable name.');
  }

  await mongoose.connect(MONGO_URI);

  const products = await Product.find({
    $or: [
      { aiCopy: { $exists: false } },
      { 'aiCopy.description': { $in: [null, ''] } },
    ],
  });

  console.log(`Found ${products.length} products needing AI copy.`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const copy = await generateProductCopy(product.toObject());
      product.aiCopy = { ...copy, generatedAt: new Date() };
      await product.save();
      success++;
      console.log(`✓ ${product.name || product._id}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${product.name || product._id}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Backfill script failed:', err);
  process.exit(1);
});
/**
 * fix-amazon-tags.js
 *
 * Goes through every product with an Amazon affiliate link and rebuilds
 * it as a clean link: https://www.amazon.in/dp/{ASIN}?tag=picksystore03-21&linkCode=ll2
 *
 * This strips out all the extra tracking junk (pd_rd_w, dib, crid, etc.)
 * that Amazon appends when you copy a link off a live product page —
 * none of that is needed for affiliate tracking, only `tag` matters,
 * and dropping it makes every link short, clean, and easy to verify.
 *
 * amzn.to short links CANNOT be fixed this way (the tag is baked in
 * server-side when the short link is created) — those are reported
 * separately at the end so you can regenerate them via Amazon
 * SiteStripe with the new tag.
 *
 * Any link that isn't a recognizable amazon.<tld> URL with a /dp/ or
 * /gp/product/ ASIN in it is reported as failed rather than guessed at.
 *
 * Usage:
 *   node fix-amazon-tags.js          → preview only, changes nothing
 *   node fix-amazon-tags.js --apply  → actually saves the changes
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

const NEW_TAG = 'picksystore03-21'
const APPLY = process.argv.includes('--apply')

// Matches /dp/ASIN or /gp/product/ASIN anywhere in the path
const ASIN_REGEX = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i

function extractAsinAndDomain(rawUrl) {
  const url = new URL(rawUrl)
  const match = url.pathname.match(ASIN_REGEX)
  if (!match) return null
  return { asin: match[1], domain: url.hostname }
}

function buildCleanLink(domain, asin) {
  return `https://${domain}/dp/${asin}?tag=${NEW_TAG}&linkCode=ll2`
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI)

  const products = await Product.find({
    affiliateLink: { $regex: 'amazon\\.|amzn\\.to', $options: 'i' }
  })

  console.log(`Found ${products.length} Amazon-linked product(s)\n`)

  let updated = 0
  let alreadyCorrect = 0
  const shortLinks = []
  const failed = []

  for (const p of products) {
    const original = p.affiliateLink

    // Short links (amzn.to) can't be edited — the tag is set server-side.
    if (/amzn\.to/i.test(original)) {
      shortLinks.push({ name: p.name, id: p._id, link: original })
      continue
    }

    try {
      const info = extractAsinAndDomain(original)

      if (!info) {
        failed.push({
          name: p.name,
          id: p._id,
          link: original,
          error: 'No /dp/ or /gp/product/ ASIN found in URL'
        })
        continue
      }

      const newLink = buildCleanLink(info.domain, info.asin)

      if (original === newLink) {
        alreadyCorrect++
        continue
      }

      console.log(`${APPLY ? 'Updating' : '[preview]'}: ${p.name}`)
      console.log(`  old: ${original}`)
      console.log(`  new: ${newLink}\n`)

      if (APPLY) {
        p.affiliateLink = newLink
        await p.save()
      }
      updated++
    } catch (err) {
      failed.push({ name: p.name, id: p._id, link: original, error: err.message })
    }
  }

  console.log('──────────────────────────────')
  console.log(`${APPLY ? 'Updated' : 'Would update'}: ${updated}`)
  console.log(`Already correct: ${alreadyCorrect}`)
  console.log(`Short links (need manual fix): ${shortLinks.length}`)
  console.log(`Failed to parse / no ASIN found: ${failed.length}`)

  if (shortLinks.length) {
    console.log('\n⚠️  These use amzn.to short links — the tag is baked in')
    console.log('   server-side, so this script cannot fix them. Regenerate')
    console.log(`   these via Amazon SiteStripe with your ${NEW_TAG} tag:`)
    shortLinks.forEach(s => console.log(`   - [${s.id}] ${s.name}: ${s.link}`))
  }

  if (failed.length) {
    console.log('\n❌  These links had no /dp/ or /gp/product/ ASIN — check manually:')
    failed.forEach(f => console.log(`   - [${f.id}] ${f.name}: ${f.link} (${f.error})`))
  }

  if (!APPLY && updated > 0) {
    console.log('\nThis was a PREVIEW — nothing was saved.')
    console.log('Run again with --apply to actually update the database:')
    console.log('  node fix-amazon-tags.js --apply')
  }

  process.exit()
}

run()
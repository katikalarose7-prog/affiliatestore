// routes/search.js  — drop-in addition, or merge into products.js
// Replaces the old /search route.
// Returns results grouped by category, up to 4 per category, max 6 categories.

const express = require('express')
const router  = express.Router()
const Product = require('../models/Product')

/**
 * GET /api/search?q=earrings&store=amazon
 *
 * Response shape:
 * {
 *   query: "earrings",
 *   total: 14,
 *   groups: [
 *     {
 *       category: "Beauty",
 *       count: 3,
 *       products: [ { _id, name, image, category, rating, store, affiliateLink } ]
 *     },
 *     { category: "Fashion", count: 2, products: [...] }
 *   ]
 * }
 */
router.get('/', async (req, res) => {
  try {
    const { q, store } = req.query
    const query = (q || '').trim()

    if (query.length < 1) return res.json({ query: '', total: 0, groups: [] })

    // Build a text OR regex filter that tolerates partial matches
    const terms  = query.split(/\s+/).filter(Boolean)
    const regexes = terms.map(t => new RegExp(t, 'i'))

    // Score: products matching all terms in name rank highest,
    // then products matching in description / category
    const filter = {
      $or: [
        // All terms in name
        { $and: regexes.map(r => ({ name: r })) },
        // All terms in description
        { $and: regexes.map(r => ({ description: r })) },
        // Any term in category
        { category: regexes[0] },
      ],
    }

    if (store && store !== 'all') filter.store = store

    // Fetch up to 60 candidates, sorted by rating desc so best items surface first
    const raw = await Product.find(filter)
      .select('name image category rating store affiliateLink description')
      .sort({ rating: -1 })
      .limit(60)
      .lean()

    // Group by category
    const map = {}
    for (const p of raw) {
      const cat = p.category || 'Other'
      if (!map[cat]) map[cat] = []
      if (map[cat].length < 4) map[cat].push(p)   // max 4 per category
    }

    // Sort categories: most results first, then alphabetically
    const groups = Object.entries(map)
      .sort(([, a], [, b]) => b.length - a.length || a[0].localeCompare(b[0]))
      .slice(0, 6)  // max 6 categories in dropdown
      .map(([category, products]) => ({
        category,
        count: products.length,
        products,
      }))

    const total = groups.reduce((s, g) => s + g.count, 0)

    res.json({ query, total, groups })
  } catch (err) {
    console.error('Search error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

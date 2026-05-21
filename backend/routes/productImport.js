const express = require('express')
const router = express.Router()
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')

const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')

const upload = multer({
  dest: 'uploads/csv/'
})

router.post(
  '/import',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {

    try {

      const mode = req.body.mode || 'upsert'

      const results = []

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', data => results.push(data))

        .on('end', async () => {

          let created = 0
          let updated = 0
          let skipped = 0

          for (const row of results) {

            // FIND EXISTING PRODUCT
            const existing = await Product.findOne({
              affiliateLink: row.affiliateLink
            })

            // PRODUCT DATA
            const payload = {
              name: row.name,
              description: row.description,
              price: Number(row.price || 0),
              category: row.category || 'Electronics',
              affiliateLink: row.affiliateLink,
              rating: Number(row.rating || 4),
              featured: row.featured === 'true'
            }

            // ADD NEW ONLY
            if (mode === 'new') {

              if (existing) {
                skipped++
                continue
              }

              await Product.create(payload)
              created++
            }

            // UPDATE ONLY
            else if (mode === 'update') {

              if (!existing) {
                skipped++
                continue
              }

              await Product.findByIdAndUpdate(
                existing._id,
                payload
              )

              updated++
            }

            // UPSERT
            else {

              if (existing) {

                await Product.findByIdAndUpdate(
                  existing._id,
                  payload
                )

                updated++

              } else {

                await Product.create(payload)

                created++
              }
            }
          }

          fs.unlinkSync(req.file.path)

          res.json({
            success: true,
            created,
            updated,
            skipped
          })
        })

    } catch (err) {

      console.log(err)

      res.status(500).json({
        message: 'Import failed'
      })
    }
  }
)

module.exports = router
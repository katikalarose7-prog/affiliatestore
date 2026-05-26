require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

async function run() {
  await mongoose.connect(process.env.MONGO_URI)

  const products = await Product.find({
    affiliateLink: { $regex: 'mydeals03c-21' }
  })

  for (const p of products) {
    p.affiliateLink = p.affiliateLink.replace(
      'mydeals03c-21',
      'primeoffers02-21'
    )

    await p.save()

    console.log('Updated:', p.name)
  }

  console.log('Done')
  process.exit()
}

run()
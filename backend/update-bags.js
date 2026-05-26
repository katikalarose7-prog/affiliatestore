require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const result = await Product.updateMany(
      { category: 'Fashion' },
      {
        $set: {
          audience: 'women',
          region: 'india'
        }
      },
      
    )

    console.log('Updated:', result.modifiedCount)

    mongoose.connection.close()
  } catch (err) {
    console.log(err)
  }
}

run()
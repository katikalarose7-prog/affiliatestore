const express = require('express')
const axios = require('axios')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const imageUrl = req.query.url

    if (!imageUrl) {
      return res.status(400).json({
        message: 'Missing image URL'
      })
    }

    const response = await axios.get(imageUrl, {
      responseType: 'stream'
    })

    res.set('Content-Type', response.headers['content-type'])

    response.data.pipe(res)

  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch image'
    })
  }
})

module.exports = router
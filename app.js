const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { Product } = require('./models/product')

process.loadEnvFile()
const PORT = process.env.PORT || 1234

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/api/productos', async (req, res) => {
  const allProducts = await Product.find()
  if (allProducts.length === 0) {
    return res.status(404).json({ error: 'No hay productos que mostrar' })
  }
  res.json(allProducts)
})

app.get('/api/productos/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const product = await Product.findOne({ codigo: id })

    if (!product) {
      return res.status(404).json({ error: 'No existe un producto con ese codigo' })
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Error al tratar de obtener un producto' })
  }
})

app.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log(`Server listening on: http://localhost:${PORT}`)
})
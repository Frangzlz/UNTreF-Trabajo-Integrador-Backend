const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { Product } = require('./models/product')

process.loadEnvFile()
const PORT = process.env.PORT || 1234

app.use(express.json())

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

app.get('/api/productos/:codigo', async (req, res) => {
  const codigo = parseInt(req.params.codigo)
  try {
    const product = await Product.findOne({ codigo })

    if (!product) {
      return res.status(404).json({ error: 'No existe un producto con ese codigo' })
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Error al tratar de obtener un producto' })
  }
})

app.post('/api/productos', async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    const existe = await Product.findOne({ codigo: newProduct.codigo })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un producto con este codigo' })
    }

    const newSavedProduct = await newProduct.save()
    return res.status(201).json(newSavedProduct)
  } catch (err) {
    return res.status(400).json({ error: 'Error al tratar de guardar el producto: ' + err })
  }
})

app.put('/api/productos/:codigo', async (req, res) => {
  const codigo = parseInt(req.params.codigo)
  
  try {
    const updatedProduct = await Product.findOneAndUpdate({ codigo }, req.body, { new: true })

    if (!updatedProduct) {
      return res.status(404).json({ error: 'No se encontro el producto' })
    }

    return res.json({updatedProduct})
  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor: ' + err})
  }
})

app.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log(`Server listening on: http://localhost:${PORT}`)
})
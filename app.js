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

app.get('/api/productos/buscar', async (req, res) => {
  const query = req.query.q

  if (!query) {
    return res.status(400).json({ error: 'Para buscar se necesita el parametro ?q=' })
  }

  try {
    const product = await Product.find({ nombre: { $regex: query, $options: 'i' } })

    if (product.length === 0) {
      return res.json({ mensaje: 'No se encontro ningun producto' })
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Error al tratar de obtener un producto' })
  }
})

app.get('/api/productos/categoria/:nombre', async (req, res) => {
  const categoria = req.params.nombre

  try {
    const products = await Product.find({ categoria: categoria })

    if (products.length === 0) {
      return res.json({ mensaje: 'No se encontro ningun producto con esta categoria' })
    }

    return res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Error al tratar de obtener un producto' })
  }
})

app.get('/api/productos/precio/:min-:max', async (req, res) => {
  const min = parseInt(req.params.min)
  const max = parseInt(req.params.max)

  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({ error: 'Los parametros (min y max) deben ser numeros enteros' })
  }

  try {
    const products = await Product.find({ precio: { $gte: min, $lte: max } })
  
    if (products.length === 0) {
      return res.json({ mensaje: 'No se encontro ningun producto con estos precios' })
    }

    return res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Error al tratar de obtener un producto' })
  }
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

app.post('/api/productos/masivo', async (req, res) => {
  const products = req.body

  if (products.length === 0) {
    return res.status(400).json({ error: 'Se requiere un array de productos que no este vacio' })
  }

  const productsToAdd = []

  for (let i = 0; i < products.length; i++) {
    try {
      if (typeof products[i].codigo !== 'number') continue

      const existe = await Product.findOne({ codigo: products[i].codigo })
  
      if (existe) {
        continue
      }
  
      productsToAdd.push(products[i])
    } catch {
      return res.status(500).json({ error: 'Error interno del servidor'})
    }
  }

  try {
    const productsAdded = await Product.insertMany(productsToAdd)
  
    if (productsAdded.length === 0) {
      return res.status(400).json({ error: 'Estos productos estan mal formados' })
    }
  
    return res.status(201).json(productsAdded)
  } catch {
    return res.status(400).json({ error: 'Hay campos incompletos o mal formados' })
  }
})

app.put('/api/productos/:codigo', async (req, res) => {
  const codigo = parseInt(req.params.codigo)

  if (isNaN(codigo)) {
    return res.status(400).json({ error: 'El codigo debe ser un numero' })
  }
  
  try {
    const updatedProduct = await Product.findOneAndUpdate({ codigo }, req.body, { new: true })

    if (!updatedProduct) {
      return res.status(404).json({ error: 'No se encontro el producto' })
    }

    return res.json({updatedProduct})
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor'})
  }
})

app.delete('/api/productos/:codigo', async (req, res) => {
  const codigo = parseInt(req.params.codigo)

  if (isNaN(codigo)) {
    return res.status(400).json({ error: 'El codigo debe ser un numero' })
  }

  try {
    const deletedProduct = await Product.findOneAndDelete({ codigo })
  
    if (!deletedProduct) {
      return res.status(404).json({ error: 'No se pudo encontrar el producto a eliminar' })
    }
  
    return res.json({
      mensaje: 'Producto eliminado correctamente',
      productoEliminado: deletedProduct
    })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor'})
  }
})

app.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log(`Server listening on: http://localhost:${PORT}`)
})
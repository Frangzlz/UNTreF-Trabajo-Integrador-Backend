const express = require('express')
const app = express()
const { connectToDb } = require('./config/database')
const routerProducts = require('./routes/productRoutes')

process.loadEnvFile()
const PORT = process.env.PORT || 1234

// Middleware para los JSON
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.use('/api/productos', routerProducts)

app.listen(PORT, async () => {
  await connectToDb()
  console.log(`Server listening on: http://localhost:${PORT}`)
})
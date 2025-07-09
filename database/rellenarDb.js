const mongoose = require('mongoose')
const products = require('../data/electronicos.json')
const { Product } = require('../models/product')
process.loadEnvFile('../.env')

async function rellenarDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conectado a MongoDB')
  } catch (err) {
    console.log('Error al conectar con la DB: ', err)
  }

  try {
    const existencias = await Product.find()
    if (existencias.length > 0) {
      console.log('La base de datos ya posee entidades')
      return
    }

    await Product.insertMany(products)
    console.log('Base de datos rellenada correctamente')
  } catch (err) {
    console.log('Error al rellenar la base de datos: ', err)
  } finally {
    mongoose.connection.close()
  }
}

rellenarDb();
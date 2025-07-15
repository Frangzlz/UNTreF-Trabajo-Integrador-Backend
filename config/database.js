const mongoose = require('mongoose')
process.loadEnvFile('./.env')

async function connectToDb () {
  try {
      await mongoose.connect(process.env.MONGODB_URI)
    } catch (err) {
      console.log('Error al conectar con la DB: ', err)
    }
}

module.exports = { connectToDb }
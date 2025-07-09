const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  categoria: {
    type: [String],
    required: true
  }
})

const Product = mongoose.model("Product", ProductSchema)

module.exports = { Product }
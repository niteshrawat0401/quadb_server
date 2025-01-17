const {Schema, model} = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: false,
    min: 0,
  },
  mrp: {
    type: Number,
    min: 0,
  },
  measurements: {
    type: String,
    trim: true,
  },
  colors: {
    type: String
  },
  images: {
    type: String, 
  },
  additionalInfo: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model('Product', productSchema);
module.exports = Product;
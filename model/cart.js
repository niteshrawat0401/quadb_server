const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: false,
        default : 0
      },
    },
  ],
  subtotal: { 
      type: Number, 
      required: false,
      default : 0
  },
  total: { 
      type: Number, 
      required: false 
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

const Cart = model("Cart", cartSchema);
module.exports = Cart;

//cartModel.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        price: {
          type: Number,
          required: true
        },
        color: String,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);

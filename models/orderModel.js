//orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems:[
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        price: Number,
        color: String,
      }
    ],
    totalOrderPrice: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit_card"],
      default: 'cash'
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    deliveredAt: Date,
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    taxPrice: Number,
    shippingPrice: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

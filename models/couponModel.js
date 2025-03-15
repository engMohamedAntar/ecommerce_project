//couponModel.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon is required"],
      unique: true,
      minLength: [3, "Very short coupon name"],
      maxLength: [20, "Very long coupon name"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      require: [true, "coupon expiryDate is required"]
    },
    discount: {
      type: Number,
      required: [true, "coupon discout is required"]
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Coupon", couponSchema);

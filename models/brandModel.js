//brandModel.js
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand is required"],
      unique: true,
      minLength: [3, "Very short brand name"],
      maxLength: [20, "Very long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", BrandSchema);

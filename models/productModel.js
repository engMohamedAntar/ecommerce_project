//productModel.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product is required"],
      trim: true,
      unique: true,
      minLength: [3, "Very short product name"],
      maxLength: [200, "Very long product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      minLength: [3, "Too short description"],
      maxLength: [500, "Too long description"],
    },
    color: [String],
    price: {
      type: Number,
      required: true,
    },
    priceAfterDiscount: Number,
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must belong to a category"],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      min: [1, "ratings must be in range 1:5"],
      max: [5, "ratings must be in range 1:5"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);

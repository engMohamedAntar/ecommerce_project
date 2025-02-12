//categoryModel.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'category is required'],
      unique: true,
      minLength: [3, "Very short category name"],
      maxLength: [20, "Very long category name"]
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports= mongoose.model('Category', CategorySchema);

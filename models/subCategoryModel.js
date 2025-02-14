//subCategoryModel.js
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'subCategory is required'],
      unique: true,
      minLength: [3, "Short subCategory name"],
      maxLength: [20, "Long subCategory name"]
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref:'Category',
        required: true
    }
  },
  {
    timestamps: true,
  }
);


module.exports= mongoose.model('SubCategory', subCategorySchema);
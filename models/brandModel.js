//brandModel.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
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

const setImageUrl= (doc)=>{
  doc.image= `${process.env.BASE_URL}/brands/${doc.image}`;
}

// work for the create
brandSchema.post('save', function(doc) {
  setImageUrl(doc);
});
// work for the findOne, find, update
brandSchema.post('init', function(doc) { //?
  setImageUrl(doc);
});

module.exports = mongoose.model("Brand", brandSchema);

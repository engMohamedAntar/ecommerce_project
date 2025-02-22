//categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImageUrl= (doc)=>{
  doc.image= `${process.env.BASE_URL}/categories/${doc.image}`;
}

// work for the create
categorySchema.post('save', function(doc) {
  setImageUrl(doc);
});
// work for the findOne, find, update
categorySchema.post('init', function(doc) { //?
  setImageUrl(doc);
});




module.exports= mongoose.model('Category', categorySchema);





//notices
//post('init') → Runs when loading data from the database.

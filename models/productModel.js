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
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "ratings must be in range 1:5"],
      max: [5, "ratings must be in range 1:5"],
    },
  },
  {
    timestamps: true,
  }
);
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageUrl= (doc)=>{
  //set url for imageCover
  if(doc.imageCover) {
    const imgUrl= `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover= imgUrl;
  }

  //set url for images
  if(doc.images) {
    const images= [];
    doc.images.forEach((img)=>{
      const imgname= `${process.env.BASE_URL}/products/${img}`;
      images.push(imgname);
    })
    doc.images= images;
  }
}

// work for the create
ProductSchema.post('save', function(doc) {
  setImageUrl(doc);
});
// work for the findOne, find, update
ProductSchema.post('init', function(doc) {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", ProductSchema);

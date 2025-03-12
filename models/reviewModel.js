//reviewModel.js
const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

// populate user field
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

//calc reatingsAverage and ratingsQuantity for each product
reviewSchema.statics.calcRatingsAvgAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: "$rating" },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: result[0]. ratingsQuantity,
      ratingsAverage: result[0].ratingsAverage,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcRatingsAvgAndQuantity(this.product);
});

reviewSchema.post(/^findOneAnd/, function(doc) {
  doc.constructor.calcRatingsAvgAndQuantity(doc.product);
});

module.exports = mongoose.model("Review", reviewSchema);

// notices
/*
{ $match: { product: productId } } filters the reviews first, so we only work with reviews for the specified product.
_id: '$product' groups those already filtered reviews, allowing us to calculate ratingsAverage and ratingsQuantity.
*/

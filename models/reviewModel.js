//reviewModel.js
const mongoose= require('mongoose');
const Product = require('./productModel');

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
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
  },
  { timestamps: true }
);

// populate user field
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});


// Function to calculate and update product ratings
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } }, // Find all reviews for the product
    {
      $group: {
        _id: '$product',
        ratingsQuantity: { $sum: 1 }, // Count total reviews
        ratingsAverage: { $avg: '$rating' }, // Get average rating
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: result[0].ratingsQuantity,
      ratingsAverage: result[0].ratingsAverage.toFixed(2), // Store only two decimal places
    });
  } else {
    // If no reviews left, reset the values
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Update product ratings after saving a new review
reviewSchema.post('save', function (doc) {
  doc.constructor.calcAverageRatings(doc.product);
});

// Update product ratings after updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});
/////////////////

module.exports= mongoose.model('Review', reviewSchema);

const mongoose= require('mongoose');

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


//works in the create
reviewSchema.post('save', async function(doc) {
  await doc.populate({ path: "user", select: "name" });
});
// work for the findOne, find, update
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

module.exports= mongoose.model('Review', reviewSchema);

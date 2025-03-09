//reviewService.js
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Review = require("../models/reviewModel");
const factoryHandler = require("./factoryHandler");
const ApiError = require("../utils/apiError");

//used in the getReviews reoute
exports.addFilterObjToReq = (req, res, next) => {
  let filterObj = {};
  if (req.params.productid) filterObj = { product: req.params.productid };
  req.filterObj = filterObj;
  next();
};

//used in the createReview
exports.addProductIdAndUserToBody = (req, res, next) => {
  if (req.params.productid) //in nested route
    req.body.product = req.params.productid;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc create a review
// @route POST api/v1/reviews
// @access protect/user
exports.createReview = factoryHandler.createOne(Review, "Review");

// @desc get all reviews
// @route GET api/v1/reviews
// @access public
exports.getReviews = factoryHandler.getAll(Review);

// @desc get a single review
// @route GET api/v1/reviews
// @access public
exports.getReview = factoryHandler.getOne(Review);

// @desc update a review
// @route PUT api/v1/reviews
// @access protect/user
exports.updateReview = asyncHandler(async (req, res, next) => {
  if (req.body.review) req.body.slug = slugify(req.body.review);
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(201).json({ status: "success", data: review });
});

// @desc delete a review
// @route DELETE api/v1/reviews
// @access protect/user,admin
exports.deleteReview = factoryHandler.deleteOne(Review);

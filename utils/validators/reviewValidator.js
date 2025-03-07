//reviewValidator.js
const { check } = require("express-validator");
const validatorMiddleware= require('../../middlewares/validatorMiddleware');
const Review= require('../../models/reviewModel');
const ApiError = require("../apiError");

exports.createReviewValidator = [
  check("review")
  .optional(),
  check("rating")
  .notEmpty().withMessage("review must have a name")
  .isFloat({min: 1, max: 5}).withMessage('rating must be between 1 and 5'),

  check('user')
  .notEmpty().withMessage('user is required')
  .isMongoId().withMessage('user not a valid mongoId')
  .custom(async(val, {req})=>{
   if(req.user._id.toString() !== val)
    return Promise.reject(new ApiError('Can not create a review with another user id', 400));
   return true;
  }),

  check('product')
  .notEmpty().withMessage('product is required')
  .isMongoId().withMessage('product not a valid mongoId')
  .custom(async(val, {req})=>{ //validate that logged user didn't review this product before
    const review= await Review.findOne({product: val, user: req.user.id});
    if(review)
      return Promise.reject(new ApiError('This user reviewed this product before', 400));
    return true;
  }),

  validatorMiddleware
];

exports.updateReviewValidator = [
  check('id')
  .isMongoId().withMessage('id not a valid mongoId')
  .custom(async(val, {req})=>{ //ensure user is updating his own review
    const review= await Review.findById(val);
    if(!review)
      return Promise.reject(new ApiError('No review found for this id', 404));
    if(review.user._id.toString() !== req.user._id.toString())
      return Promise.reject(new ApiError('You can only update your own review', 400));
    return true;
  }),
  check("review")
  .optional()
  .isLength({min: 5}).withMessage('too short review name'),
  check("rating")
  .optional()
  .isFloat({min: 1, max: 5}),
  check('user')
  .optional()
  .isMongoId().withMessage('user not a valid mongoId'),
  check('product')
  .optional()
  .isMongoId().withMessage('product not a valid mongoId'),
  
  validatorMiddleware
];


exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId ")
  .custom(async(val, {req})=>{
    if(req.user.role=== 'admin')
      return true;
    const review= await Review.findById(val);
    if(!review)
      return Promise.reject(new ApiError('No review found for this id', 404));
    if(review.user._id.toString() !== req.user._id.toString())
      return Promise.reject(new ApiError('You can only delete your own review', 400));
    return true;
  }),
  validatorMiddleware
];
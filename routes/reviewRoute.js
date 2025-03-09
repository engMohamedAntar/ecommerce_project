//reviewRoute.js
const express = require("express");

const router = express.Router({mergeParams: true});
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  addFilterObjToReq,
  addProductIdAndUserToBody,
} = require("../services/reviewService");
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator
} = require("../utils/validators/reviewValidator");
const {protect, allowedTo}= require('../services/authService');

router.post("/", protect, allowedTo('user'), addProductIdAndUserToBody, createReviewValidator, createReview);
router.get("/:id", getReviewValidator, getReview);
router.get("/", addFilterObjToReq, getReviews); 
router.put("/:id",protect, allowedTo('user'), updateReviewValidator, updateReview);
router.delete("/:id",protect, allowedTo('user','admin'), deleteReviewValidator, deleteReview);
module.exports = router;

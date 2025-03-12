//couponRoute.js
const express = require("express");

const router = express.Router();
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
const {
  getCouponValidator,
  createCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");
const {protect, allowedTo}= require('../services/authService');

router.use(protect, allowedTo('admin'));

router.post("/",createCouponValidator, createCoupon);
router.get("/:id", getCouponValidator, getCoupon);
router.get("/", getCoupons); 
router.put("/:id",  updateCoupon);
router.delete("/:id", deleteCouponValidator, deleteCoupon);
module.exports = router;

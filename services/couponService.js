//couponService.js
const Coupon = require("../models/couponModel");
const factoryHandler = require("./factoryHandler");

// @desc create a coupon
// @route POST api/v1/coupons
// @access private-admin
exports.createCoupon = factoryHandler.createOne(Coupon);

// @desc get all coupons
// @route GET api/v1/coupons
// @access private-admin
exports.getCoupons = factoryHandler.getAll(Coupon);

// @desc get a single coupon
// @route GET api/v1/coupons
// @access private-admin
exports.getCoupon = factoryHandler.getOne(Coupon);

// @desc update a coupon
// @route PUT api/v1/coupons
// @access private-admin
exports.updateCoupon = factoryHandler.updateOne(Coupon);

// @desc delete a coupon
// @route DELETE api/v1/coupons
// @access private-admin
exports.deleteCoupon = factoryHandler.deleteOne(Coupon);

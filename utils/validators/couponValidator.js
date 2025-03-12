//couponValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("coupon must have a name")
    .isLength({ min: 3 })
    .withMessage("too short coupon name")
    .isLength({ max: 32 })
    .withMessage("too long coupon name"),
  check("expiryDate").isDate().withMessage("expiryDate must be a date"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short coupon name")
    .isLength({ max: 32 })
    .withMessage("too long coupon name"),
  check("expireyDate")
    .optional()
    .isDate()
    .withMessage("expiryDate must be a date"),
  validatorMiddleware,
];

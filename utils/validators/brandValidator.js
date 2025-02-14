//brandValidator.js
const { check } = require("express-validator");
const validatorMiddleware= require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware
];

exports.createBrandValidator = [
  check("name")
  .notEmpty().withMessage("brand must have a name")
  .isLength({min: 3}).withMessage('too short brand name')
  .isLength({max: 32}).withMessage('too long brand name'),
  validatorMiddleware
];



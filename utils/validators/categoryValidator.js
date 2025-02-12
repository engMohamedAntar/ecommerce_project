//categoryValidator.js
const { check } = require("express-validator");
const validatorMiddleware= require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware
];

exports.createCategoryValidator = [
  check("name")
  .notEmpty().withMessage("category must have a name")
  .isLength({min: 3}).withMessage('too short category name')
  .isLength({max: 32}).withMessage('too long category name'),
  validatorMiddleware
];



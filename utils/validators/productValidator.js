//productValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("product must have a name")
    .isLength({ min: 3 })
    .withMessage("Very short product name")
    .isLength({ max: 200 })
    .withMessage("Too long product name"),
  check('description')
    .notEmpty()
    .isLength({min:3}).withMessage('Very short product description')
    .isLength({max: 500}).withMessage('Too long product description'),
  check('price')
  .notEmpty().withMessage('price is required')
  .isNumeric().withMessage('price must be a number'),
  check('priceAfterDiscount')
    .isFloat()
    .isNumeric().withMessage('quantity must be a number')
    .custom((val, {req})=>{
      if(req.body.price< val) 
        throw new Error('priceAfterDiscount must be lower than price');
      return true;
    }),
  check('color')
    .optional()
    .isArray().withMessage('color filed should be an array'),
  check('quantity')
    .notEmpty().withMessage('quantity is required')
    .isNumeric().withMessage('quantity must be a number'),
  check('sold')
    .isNumeric().withMessage('sold must be a number'),
  check('imageCover')
    .notEmpty().withMessage('imageCover is required'),
  check('images')
    .optional()
    .isArray().withMessage('images filed should be an array'),
  check('category')
    .notEmpty()
    .isMongoId().withMessage('category is not a valid mongoId'),
  check('subCategories')
    .optional()  
    .isMongoId().withMessage('subcategory not a valid mongo id')
    .isArray(),
  check('brand')
    .optional()
    .isMongoId().withMessage('brand not a valid mongo id'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .isFloat()
    .isLength({min:1}).withMessage('min ratingAverage is 1')
    .isLength({max:5}).withMessage('max ratingAverage is 5'),
  check('ratingsQuantity')
    .optional()
    .isNumeric().withMessage('ratingsQuantity muste be a number'),
  validatorMiddleware
];

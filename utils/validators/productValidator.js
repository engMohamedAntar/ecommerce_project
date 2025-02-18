//productValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

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
  check("description")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Very short product description")
    .isLength({ max: 500 })
    .withMessage("Too long product description"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number"),
  check("priceAfterDiscount")
    .isFloat()
    .isNumeric()
    .withMessage("quantity must be a number")
    .custom((val, { req }) => {
      if (req.body.price < val)
        throw new Error("priceAfterDiscount must be lower than price");
      return true;
    }),
  check("color")
    .optional()
    .isArray()
    .withMessage("color filed should be an array"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("sold").isNumeric().withMessage("sold must be a number"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images filed should be an array"),
  check("category")
    .notEmpty()
    .isMongoId()
    .withMessage("category not valid mongoId")
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category)
          return Promise.reject(new Error("category not exist in DB"));
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("subcategory not a valid mongo id")
    .isArray()
    .withMessage("subcategories must be an array")
    .custom((subcategories)=>{
      const uniqueSubCats= new Set(subcategories);
      if(uniqueSubCats.size !== subcategories.length)
        return Promise.reject(new Error('subcategories can not have duplicates'));
      return true;
    })
    .custom((subcategories) =>
      SubCategory.find({ _id: { $in: subcategories } }).then(
        (matched_subcats) => {
          if (matched_subcats.length !== subcategories.length)
            return Promise.reject(new Error("subcategory not exist in DB"));
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          let ids = [];
          subcategories.forEach((subcat) => ids.push(subcat._id.toString()));
          if (!val.every((v) => ids.includes(v)))
            return Promise.reject(
              new Error("subcategories must belong to the category")
            );
        }
      )
    ),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("brand not a valid mongo id"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .isFloat()
    .isLength({ min: 1 })
    .withMessage("min ratingAverage is 1")
    .isLength({ max: 5 })
    .withMessage("max ratingAverage is 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity muste be a number"),
  validatorMiddleware,
];

//notices
//Category.findById(val) --> this function returns a promise, and it could be resolved or rejected.

//categoryService.js
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc create a category
// @route POST api/v1/categories
// @access private/admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });

  res.status(201).json({ status: "success", data: category });
});

// @desc get all categories
// @route GET api/v1/categories
// @access public
exports.getCategories = asyncHandler(async (req, res, next) => {
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc get a single category
// @route GET api/v1/categories
// @access public
exports.getCategory = asyncHandler(async (req, res, next) => {  
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(new ApiError(`No category found for ${req.params.id}`,404));
  res.status(200).json({ data: category });
});

// @desc update a category
// @route PUT api/v1/categories
// @access public
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!category)
    return next(new ApiError(`No category found for ${req.params.id}`,404));

  res.status(200).json({ status: "success", data: category });
});

// @desc delete a category
// @route DELETE api/v1/categories
// @access public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if(!category)
    return next(new ApiError(`No category found for ${req.params.id}`,404));
  res.status(204).send();
});

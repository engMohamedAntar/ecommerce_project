//brandService.js
const Brand = require("../models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc create a brand
// @route POST api/v1/categories
// @access private/admin
exports.createBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({ status: "success", data: brand });
});

// @desc get all categories
// @route GET api/v1/categories
// @access public
exports.getCategories = asyncHandler(async (req, res, next) => {
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc get a single brand
// @route GET api/v1/categories
// @access public
exports.getBrand = asyncHandler(async (req, res, next) => {  
  const brand = await Brand.findById(req.params.id);
  if (!brand)
    return next(new ApiError(`No brand found for ${req.params.id}`,404));
  res.status(200).json({ data: brand });
});

// @desc update a brand
// @route PUT api/v1/categories
// @access private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!brand)
    return next(new ApiError(`No brand found for ${req.params.id}`,404));

  res.status(200).json({ status: "success", data: brand });
});

// @desc delete a brand
// @route DELETE api/v1/categories
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if(!brand)
    return next(new ApiError(`No brand found for ${req.params.id}`,404));
  res.status(204).send();
});

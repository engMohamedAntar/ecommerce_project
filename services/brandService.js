//brandService.js
const Brand = require("../models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// @desc create a brand
// @route POST api/v1/brands
// @access private/admin
exports.createBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({ status: "success", data: brand });
});

// @desc get all brands
// @route GET api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const countDocs= await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find({}), req.query)
    .paginate(countDocs)
    .filter()
    .fieldFilter()
    .sort()
    .search('Brand');

  const { mongooseQuery, paginationInfo } = apiFeatures;
  const brands = await mongooseQuery;
  res.status(200).json({ results: brands.length, paginationInfo, data: brands });
});

// @desc get a single brand
// @route GET api/v1/brands
// @access public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand)
    return next(new ApiError(`No brand found for ${req.params.id}`, 404));
  res.status(200).json({ data: brand });
});

// @desc update a brand
// @route PUT api/v1/brands
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
    return next(new ApiError(`No brand found for ${req.params.id}`, 404));

  res.status(200).json({ status: "success", data: brand });
});

// @desc delete a brand
// @route DELETE api/v1/brands
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand)
    return next(new ApiError(`No brand found for ${req.params.id}`, 404));
  res.status(204).send();
});

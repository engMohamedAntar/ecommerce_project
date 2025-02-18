//productService.js
const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc create a product
// @route POST api/v1/products
// @access private/admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const product = await Product.create(req.body);

  res.status(201).json({ status: "success", data: product });
});

// @desc get all products
// @route GET api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fieldFilter()
    .paginate()
    .search();
  //execute query
  const products = await apiFeatures.mongooseQuery;
  res.status(200).json({ results: products.length, data: products });
});

// @desc get a single product
// @route GET api/v1/products
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new ApiError(`No product found for ${req.params.id}`, 404));
  res.status(200).json({ data: product });
});

// @desc update a product
// @route PUT api/v1/products
// @access private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product)
    return next(new ApiError(`No product found for ${req.params.id}`, 404));

  res.status(200).json({ status: "success", data: product });
});

// @desc delete a product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return next(new ApiError(`No product found for ${req.params.id}`, 404));
  res.status(204).send();
});

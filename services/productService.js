//productService.js
const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler= require('./factoryHandler');

// @desc create a product
// @route POST api/v1/products
// @access private/admin
exports.createProduct = factoryHandler.createOne(Product);

// @desc get all products
// @route GET api/v1/products
// @access public
exports.getProducts = factoryHandler.getAll(Product,'Product');
// @desc get a single product
// @route GET api/v1/products
// @access public
exports.getProduct = factoryHandler.getOne(Product);

// @desc update a product
// @route PUT api/v1/products
// @access private
exports.updateProduct = factoryHandler.updateOne(Product);
// @desc delete a product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = factoryHandler.deleteOne(Product);
//brandService.js
const Brand = require("../models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler= require('./factoryHandler');

// @desc create a brand
// @route POST api/v1/brands
// @access private/admin
exports.createBrand = factoryHandler.createOne(Brand);

// @desc get all brands
// @route GET api/v1/brands
// @access public
exports.getBrands = factoryHandler.getAll(Brand);

// @desc get a single brand
// @route GET api/v1/brands
// @access public
exports.getBrand = factoryHandler.getOne(Brand);

// @desc update a brand
// @route PUT api/v1/brands
// @access private
exports.updateBrand = factoryHandler.updateOne(Brand);

// @desc delete a brand
// @route DELETE api/v1/brands
// @access private
exports.deleteBrand = factoryHandler.deleteOne(Brand);

//subCategoryService.js
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler= require('./factoryHandler');

//adds the category filed 'category' to the req.body in the createSubCategory route
exports.addCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryid) req.body.category = req.params.categoryid;
  next();
};

// @desc create subcategory
// @route POST api/v1/subcategories/
// @access Private-admin
exports.createSubCategory = factoryHandler.createOne(SubCategory);

exports.addFilterObjToReq = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryid) filterObject = { category: req.params.categoryid };
  req.filterObj = filterObject;
  next();
};

// @desc get all subcategories
// @route GET api/v1/subcategories/
// @access Public
exports.getSubCategories = factoryHandler.getAll(SubCategory);

// @desc get specific subcategory
// @route GET api/v1/subcategories/:id
// @access Public
exports.getSubCategory = factoryHandler.getOne(SubCategory);

// @desc update specific subcategory
// @route PUT api/v1/subcategories/:id
// @access private-admin
exports.updateSubCategory = factoryHandler.updateOne(SubCategory);

// @desc delete specific subcategory
// @route DELETE api/v1/subcategories/:id
// @access private-admin
exports.deleteSubCategory = factoryHandler.deleteOne(SubCategory);
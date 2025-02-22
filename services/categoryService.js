//categoryService.js
const sharp= require('sharp');
const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler= require('./factoryHandler');
const {uploadImage}= require('../middlewares/uploadImageMiddleware');

exports.uploadImage= uploadImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {    
  const filename = `image-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/categories/${filename}`);
 
    req.body.image = filename;
  
  next();
});


// @desc create a category
// @route POST api/v1/categories
// @access private/admin
exports.createCategory = factoryHandler.createOne(Category)

// @desc get all categories
// @route GET api/v1/categories
// @access public
exports.getCategories = factoryHandler.getAll(Category);
// @desc get a single category
// @route GET api/v1/categories
// @access public
exports.getCategory = factoryHandler.getOne(Category);

// @desc update a category
// @route PUT api/v1/categories
// @access public
exports.updateCategory = factoryHandler.updateOne(Category);
// @desc delete a category
// @route DELETE api/v1/categories
// @access public
exports.deleteCategory = factoryHandler.deleteOne(Category);
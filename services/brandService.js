//brandService.js
const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Brand = require("../models/brandModel");
const factoryHandler = require("./factoryHandler");
const ApiError = require("../utils/apiError");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadImage= uploadImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if(req.file) {
    const filename = `image-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }
  next();
});

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

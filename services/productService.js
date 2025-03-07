//productService.js
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("./factoryHandler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadMixOfImages = uploadMixOfImages;
exports.resizeImage = asyncHandler(async (req, res, next) => {
  let filename = `image-${uuidv4()}-${Date.now()}-cover.jpeg`;

  if (req.files&& req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(400, 400)
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${filename}`);

      req.body.imageCover = filename;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, idx) => {
        filename = `image-${uuidv4()}-${Date.now()}-${idx}.jpeg`;
        if (req.files.imageCover) {
          await sharp(img.buffer)
            .resize(400, 400)
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${filename}`);
        }
        req.body.images.push(filename);
      })
    );
  }
  next();
});

// @desc create a product
// @route POST api/v1/products
// @access private/admin
exports.createProduct = factoryHandler.createOne(Product);

// @desc get all products
// @route GET api/v1/products
// @access public
exports.getProducts = factoryHandler.getAll(Product, "Product");
// @desc get a single product
// @route GET api/v1/products
// @access public
exports.getProduct = factoryHandler.getOne(Product, "reviews");

// @desc update a product
// @route PUT api/v1/products
// @access private
exports.updateProduct = factoryHandler.updateOne(Product);
// @desc delete a product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = factoryHandler.deleteOne(Product);

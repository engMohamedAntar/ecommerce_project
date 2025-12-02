//productRoute.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadMixOfImages,
  resizeImage,
} = require("../services/productService");
const { getProductValidator, createProductValidator, deleteProductValidator, updateProductValidator } = require("../utils/validators/productValidator");
const {protect, allowedTo}= require('../services/authService');
const reviewRoute= require('../routes/reviewRoute');

// nested route api/v1/products/67cc261a3b87c14d9dc37095/reviews
router.use("/:productid/reviews", reviewRoute);

router.post("/", protect, allowedTo('admin'),  uploadMixOfImages(), resizeImage, createProductValidator, createProduct);

router.get("/:id", getProductValidator, getProduct);

router.get("/", getProducts);
router.put("/:id", protect, allowedTo('admin'),  uploadMixOfImages(), resizeImage, updateProductValidator, updateProduct);
router.delete("/:id", protect, allowedTo('admin'), deleteProductValidator, deleteProduct);
module.exports = router;

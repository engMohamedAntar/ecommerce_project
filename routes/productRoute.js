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
  resizeImage
} = require("../services/productService");

const { getProductValidator, createProductValidator, deleteProductValidator, updateProductValidator } = require("../utils/validators/productValidator");

router.post("/", uploadMixOfImages(), resizeImage, createProductValidator, createProduct);
router.get("/:id", getProductValidator, getProduct);
router.get("/", getProducts);
router.put("/:id", uploadMixOfImages(), resizeImage, updateProductValidator, updateProduct);
router.delete("/:id",deleteProductValidator, deleteProduct);
module.exports = router;

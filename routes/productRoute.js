//productRoute.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../services/productService");
const { getProductValidator, createProductValidator, deleteProductValidator, updateProductValidator } = require("../utils/validators/productValidator");
router.post("/",createProductValidator, createProduct);
router.get("/:id", getProductValidator, getProduct);
router.get("/", getProducts);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id",deleteProductValidator, deleteProduct);
module.exports = router;

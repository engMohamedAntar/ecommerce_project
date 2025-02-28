//categoryRoute.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../services/categoryService");
const { getCategoryValidator, createCategoryValidator, deleteCategoryValidator } = require("../utils/validators/categoryValidator");
const subCategoryRoute= require('./subCategoryRoute');
const {uploadImage, resizeImage}= require('../services/categoryService');
const {protect, allowedTo}= require('../services/authService');

router.use("/:categoryid/subcategories", subCategoryRoute)

router.post("/",protect, allowedTo('admin'),uploadImage, resizeImage, createCategoryValidator, createCategory);
router.get("/:id", getCategoryValidator, getCategory);
router.get("/", getCategories);
router.put("/:id",protect, allowedTo('admin'), uploadImage, resizeImage, updateCategory);
router.delete("/:id", protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory);
module.exports = router;

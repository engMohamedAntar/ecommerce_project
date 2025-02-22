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

router.use("/:categoryid/subcategories", subCategoryRoute)

router.post("/",uploadImage, resizeImage, createCategoryValidator, createCategory);
router.get("/:id", getCategoryValidator, getCategory);
router.get("/", getCategories);
router.put("/:id", uploadImage, resizeImage, updateCategory);
router.delete("/:id",deleteCategoryValidator, deleteCategory);
module.exports = router;

// subCategoryRoute.js
const express = require("express");
const router = express.Router({mergeParams:true});
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  addCategoryIdToBody,
  addFilterObjToReq
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {protect, allowedTo}= require('../services/authService');

router.post("/", protect, allowedTo('admin'),  addCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router.get("/",addFilterObjToReq, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);
router.put("/:id", protect, allowedTo('admin'),  updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", protect, allowedTo('admin'),  deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;

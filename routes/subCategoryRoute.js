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

router.post("/", addCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router.get("/",addFilterObjToReq, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);
router.put("/:id", updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;

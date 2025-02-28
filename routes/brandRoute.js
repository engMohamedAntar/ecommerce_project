//brandRoute.js
const express = require("express");

const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const {uploadImage, resizeImage}= require('../services/brandService');
const {protect, allowedTo}= require('../services/authService');

router.post("/",protect, allowedTo('admin'), uploadImage, resizeImage, createBrandValidator, createBrand);
router.get("/:id", getBrandValidator, getBrand);
router.get("/", getBrands); 
router.put("/:id",protect, allowedTo('admin'), uploadImage, resizeImage, updateBrand);
router.delete("/:id",protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);
module.exports = router;

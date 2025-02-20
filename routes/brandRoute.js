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


router.post("/", uploadImage, resizeImage, createBrandValidator, createBrand);
router.get("/:id", getBrandValidator, getBrand);
router.get("/", getBrands);
router.put("/:id", uploadImage, resizeImage, updateBrand);
router.delete("/:id", deleteBrandValidator, deleteBrand);
module.exports = router;

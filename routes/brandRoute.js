//brandRoute.js
const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
} = require("../services/brandService");
const { getBrandValidator, createBrandValidator, deleteBrandValidator } = require("../utils/validators/brandValidator");
router.post("/",createBrandValidator, createBrand);
router.get("/:id", getBrandValidator, getBrand);
router.get("/", getBrands);
router.put("/:id", updateBrand);
router.delete("/:id",deleteBrandValidator, deleteBrand);
module.exports = router;

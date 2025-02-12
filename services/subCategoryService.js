//subCategoryService.js
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

// @desc create subcategory
// @route POST api/v1/subCategories/
// @access Private-admin
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    categoryId,
  });

  res.status(201).json({ status: "success", data: subCategory });
});

// @desc get all subcategories
// @route GET api/v1/subCategories/
// @access Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await SubCategory.find({});

  res.status(200).json({ status: "success", data: subCategories });
});

// @desc get specific subcategory
// @route GET api/v1/subCategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory)
    return next(new ApiError(`No subcategory found for ${req.params.id}`));

  res.status(200).json({ status: "success", data: subCategory });
});

// @desc update specific subcategory
// @route PUT api/v1/subCategories/:id
// @access private-admin
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  if(req.body.name)
    req.body.slug= slugify(req.body.name);
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!subCategory)
    return next(new ApiError(`No subcategory found for ${req.params.id}`));

  res.status(200).json({ status: "success", data: subCategory });
});

// @desc delete specific subcategory
// @route DELETE api/v1/subCategories/:id
// @access private-admin
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory)
    return next(new ApiError(`No subcategory found for ${req.params.id}`));

  res.status(204).send();
});

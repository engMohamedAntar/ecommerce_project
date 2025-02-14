//subCategoryService.js
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

//adds the category filed 'category' to the req.body in the createSubCategory route
exports.addCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryid) req.body.category = req.params.categoryid;
  next();
};

// @desc create subcategory
// @route POST api/v1/subcategories/
// @access Private-admin
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ status: "success", data: subCategory });
});

exports.addFilterObjToReq = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryid) filterObject = { category: req.params.categoryid };
  req.filterObj = filterObject;
  next();
};

// @desc get all subcategories
// @route GET api/v1/subcategories/
// @access Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  //impliment pagenation
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = limit * (page - 1);

  const filterObject = req.filterObj;

  const subCategories = await SubCategory.find(filterObject)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    resluts: subCategories.length,
    data: subCategories,
  });
});

// @desc get specific subcategory
// @route GET api/v1/subcategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory)
    return next(new ApiError(`No subcategory found for ${req.params.id}`));

  res.status(200).json({ status: "success", data: subCategory });
});

// @desc update specific subcategory
// @route PUT api/v1/subcategories/:id
// @access private-admin
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
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
// @route DELETE api/v1/subcategories/:id
// @access private-admin
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory)
    return next(new ApiError(`No subcategory found for ${req.params.id}`));

  res.status(204).send();
});

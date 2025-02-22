const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const ApiFeatures= require('../utils/apiFeatures');
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new ApiError(`No doument found for ${req.params.id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.name) req.body.slug = slugify(req.body.name);
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document)
      return next(new ApiError(`No document found for ${req.params.id}`, 404));
    document.save();
    res.status(200).json({ status: "success", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.name);
    const document = await Model.create(req.body);
    res.status(201).json({ status: "success", data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document)
      return next(new ApiError(`No document found for ${req.params.id}`, 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName= '') =>
  asyncHandler(async (req, res, next) => {
    let filterObj= {};
    if(req.filterObj)
      filterObj= req.filterObj;
    const countDocs = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObj), req.query)
      .paginate(countDocs)
      .filter()
      .fieldFilter()
      .sort()
      .search(modelName);

    const { mongooseQuery, paginationInfo } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationInfo, data: documents });
  });

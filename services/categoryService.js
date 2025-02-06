const CategoryModel= require('../models/categoryModel');

exports.createCategory = async (req, res, next) => {
  const category = await CategoryModel.create({
    name: req.body.name,
  });
  res.json({ status: "success", data: category });
};

const sharp = require("sharp");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const mongoose= require('mongoose'
)
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const factoryHandler = require("./factoryHandler");
const createJWT = require("../utils/createJWT");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadImage = uploadImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  console.log("File received in resizeImage middleware:", req.file); // Debug log

  const filename = `image-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/users/${filename}`);
  }
  req.body.profileImage = filename;
  next();
});

// @desc create a new user
// @route POST api/v1/users
// @access Private-admin
exports.createUser = factoryHandler.createOne(User);

// @desc get all users
// @route GET api/v1/users
// @access private-admin
exports.getUsers = factoryHandler.getAll(User);

// @desc get a single user
// @route GET api/v1/users/:id
// @access private-admin
exports.getUser = factoryHandler.getOne(User);

// @desc update a user
// @route PUT api/v1/users/:id
// @access private-admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, profileImage, role, wishList } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, profileImage, role, wishList },
    { new: true }
  );
  if (!user) return next(new ApiError("No user found for this id", 404));
  res.status(200).json({ status: "success", data: user });
});

// @desc delete a user
// @route DELETE api/v1/users/:id
// @access private-admin
exports.deleteUser = factoryHandler.deleteOne(User);




// @desc change user user password
// @route PUT api/v1/users/changepassword/:id
// @access private-admin
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) next(new ApiError(`No user found for ${req.params.id}`, 404));

  res.status(200).json({ status: "success", data: user });
});

// @desc getLoggedUser data
// @route PUT api/v1/users/getme
// @access protect-user
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc getLoggedUser data
// @route PUT api/v1/users/changemypassword
// @access protect-user
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  const token = createJWT({ id: user._id });
  res.status(200).json({ status: "success", data: user, token });
});

// @desc getLoggedUser data
// @route PUT api/v1/users/updatemydata
// @access protect-user
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id= req.user._id;
  next();
});

// @desc deactivate logged user
// @route PUT api/v1/users/deactivateme
// @access protect-user
exports.deactivateMe = asyncHandler(async (req, res, next) => {  
  await User.findByIdAndUpdate(req.user._id, {isActive: false});
  
  res.status(204).send();
});
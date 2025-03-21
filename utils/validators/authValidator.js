//userValidator.js
const bcrypt = require("bcrypt");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const ApiError = require("../apiError");
const User = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("user must have a name")
    .isLength({ min: 3 })
    .withMessage("too short user name")
    .isLength({ max: 32 })
    .withMessage("too long user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(req.body.name);
      return true;
    }),
  check("email")
    .isEmail().withMessage("email is not valid")
    .notEmpty().withMessage("email can not be empty"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 digits")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(
          new ApiError("password not equal to passwordConfirm")
        );
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number"),
  validatorMiddleware,
];

exports.logInValidator = [

  check("email")
    .isEmail().withMessage("email is not valid")
    .notEmpty().withMessage("email can not be empty").custom(async(val,{req})=>{
      const user= await User.findOne({email: val});
      if(!user)
        return Promise.reject(new Error('no user found',404));
      if(user.isActive===false)
        return Promise.reject(new Error('user deactivated',404));
      return true;
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 digits"),
  validatorMiddleware
];
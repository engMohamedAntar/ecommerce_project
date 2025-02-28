//userValidator.js
const bcrypt = require("bcrypt");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const ApiError = require("../apiError");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Not a valid mongoId "),
  validatorMiddleware,
];

exports.createUserValidator = [
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
    .isEmail()
    .withMessage("email is not valid")
    .notEmpty()
    .withMessage("email can not be empty"),

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

  check("phone").optional().isMobilePhone("ar-EG").withMessage("invalid phone number"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short user name")
    .isLength({ max: 32 })
    .withMessage("too long user name")
    .custom((val, { req }) => {
      if (req.body.name) req.body.slug = slugify(req.body.name);
      return true;
    }),
  check("email").optional().isEmail().withMessage("email is not valid"),

  check("phone")
    .isMobilePhone("ar-EG")
    .withMessage("invalid phone number")
    .optional(),
  check("imageCover").optional(),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId("invalid mongo id"),
  body("currentPassword").notEmpty().withMessage("currentPassword is required"),
  body("confirmPassword").notEmpty().withMessage("confirmPassword is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .custom(async (val, { req }) => {
      //ensure current password is correct
      const user = await User.findById(req.params.id);
      if (!user) return Promise.reject(new Error("No user found for this id"));
      const isCorrectCurPass = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectCurPass)
        return Promise.reject(new Error("Wrong current password"));

      //ensure newPassword equal confirmPassword
      if (val !== req.body.confirmPassword)
        return Promise.reject(
          new Error("newPassword not equal confirmPassword")
        );
      return true;
    }),
  validatorMiddleware,
];

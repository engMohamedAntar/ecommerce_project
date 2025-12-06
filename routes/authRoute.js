//authRoute.js
const express = require("express");

const router = express.Router();
const {
  signUp,
  logIn,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  uploadImage,
  resizeImage,
} = require("../services/authService");
const {
  signUpValidator,
  logInValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", uploadImage, resizeImage, signUpValidator, signUp);
router.post("/login", logInValidator, logIn);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyresetcode", verifyResetCode);
router.put("/resetpassword", resetPassword);
module.exports = router;

//authRoute.js
const express = require("express");
const passport = require("passport");
// require("../strategies/local-strategy");

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

//login using passport
// router.post("/login", passport.authenticate("local"), (req, res) => {
//   res.json({ user: req.user });
// });

//logout using passport
// router.post("/logout", (req, res, next) => {
//   if (!req.user) return res.sendStatus(401);
//   req.logOut((err) => {
//     if (err) return res.sendStatus(400);
//     res.send(200);
//   });
// });
//authRoute.js
const express = require("express");

const router = express.Router();
const { signUp, logIn } = require("../services/authService");
const { signUpValidator, logInValidator } = require("../utils/validators/authValidator");

router.post("/signup", signUpValidator, signUp);
router.post("/login", logInValidator, logIn);
module.exports = router;

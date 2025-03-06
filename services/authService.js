const crypto = require("crypto");
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail= require('../utils/sendEmail');
const createJWT= require('../utils/createJWT');

// @desc signUp
// @route POST api/v1/auth/signup
// @access public
exports.signUp = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return next(new ApiError("This email already exist", 409));
  const { name, email, password, passwordConfirm, phone } = req.body;
  user = await User.create({ name, email, password, passwordConfirm, phone });
  //create a token
  const token = createJWT({ id: user._id });
  res.status(201).json({ data: user, token });
};

// @desc logIn
// @route POST api/v1/auth/login
// @access public
exports.logIn = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return next(new ApiError("invalid email or password", 401));
  //create a token
  const token = createJWT({ id: user._id });
  res.status(200).json({ data: user, token });
};

// @desc create the protect middlewaare
exports.protect = asyncHandler(async (req, res, next) => {
  // check weather token exist (user is loggedIn)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new ApiError("Not loggedIn please login first.", 401));
  const token = req.headers.authorization.split(" ")[1];
  
  // verify token (not expired and valid)
  const decoded = jwt.verify(token, process.env.JWT_SECRET); //?
  
  // ensure that the user still exit
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new ApiError("user of this token does no longer exist", 401));

  // check if the user password changed after token is created
  if (user.passwordChangedAt) {
    let passwordChangedAt = user.passwordChangedAt;
    const jwtCreatedAt = decoded.iat;
    passwordChangedAt = parseInt(passwordChangedAt.getTime() / 1000);
    if (passwordChangedAt > jwtCreatedAt)
      return next(new ApiError("password changed, please logIn again", 401));
  }
  //check weather the user account is deactivated 
  if(!user.isActive)
    return next(new ApiError("This user is deactivated, activate it first.", 401));

  req.user = user;  
  next();
});

exports.allowedTo =
  (...roles) =>
  (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role))
      return next(
        new ApiError("you are not permited to access this route", 403)
      );
    next();
  };

// @desc forgotPassword function
// @route POST api/v1/auth/fotgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) find if user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`No user found for this email ${req.body.email}`, 404)
    );

  // 2) create the verification code and save it to DB.
  const resetCode = Math.floor(Math.random() * 1000000 + 1).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  user.save();

  //3) send the resetCode to the user email.
  try{
      await sendEmail({
    email: user.email,
    subject:'E-eommerce reset code',
    text: `Hi\nWe recieved a request to reset the password on your E-commerce Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep you account secure.\n Mohamed Antar`
  })
  } catch(err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    return next(new ApiError('error occured during sending email',500));
  }

  res
    .status(200)
    .json({ status: "success", message: "ResetCode sent to your email" });
});

// @desc verify that passwordResetCode is correct
// @route POST api/v1/auth/verifyresetcode
// @access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
  .createHash("sha256")
  .update(req.body.resetCode)
  .digest("hex");
  const user= await User.findOne({email: req.body.email, passwordResetCode: hashedResetCode, passwordResetExpires: { $gt: Date.now() }});
  if(!user)
    return next(new ApiError(`resetCode invalid or expired`, 400));

  user.passwordResetVerified= true;

  await user.save();
  res.status(200).json({status: 'success', message: 'ResetCode is verified'});
});


// @desc reset the password
// @route PUT api/v1/auth/resetpassword
// @access Public
exports.resetPassword= asyncHandler(async (req, res, next) => {
  const user= await User.findOne({email: req.body.email});
  if(!user)
    return next(new ApiError(`No user found for this email ${req.body.email}`, 404));
  
  if(!user.passwordResetVerified)
    return next(new ApiError('passwordResetCode not verified', 400));
  
  const newPassword= req.body.newPassword;
  user.password= newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token= createJWT({ id: user._id });
  res.status(200).json({message: 'password changed properly.', token});
});



//notices
/* 
jwt.verify ==> if token is expired jwt.verify will throw an error automatically
*/

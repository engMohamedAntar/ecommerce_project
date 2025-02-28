const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler= require('express-async-handler');
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

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
exports.protect = asyncHandler( async (req, res, next) => {
  // check weather token exist (user is loggedIn)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new ApiError("Not loggedIn please login first.", 401));
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  // verify token (not expired and valid)
  const decoded = jwt.verify(token, process.env.JWT_SECRET); //?
  console.log(decoded);
  
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

  req.user = user;
  
  next();
});

exports.allowedTo= (...roles) => (req, res, next)=>{
  const user= req.user;
  if(!roles.includes(user.role))
    return next(new ApiError('you are not permited to access this route', 403));
  next();
}
//notices
/* 
jwt.verify ==> if token is expired jwt.verify will throw an error automatically
*/

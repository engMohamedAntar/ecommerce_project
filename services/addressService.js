const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc add address to user
// @route POST api/v1/addresses
// @access protect-user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: {addresses: req.body},
  }, { new: true });
  res
    .status(200)
    .json({
      message: "address added successfully",
      addresses: user.addresses,
    });
});

// @desc Remove user address
// @route DELETE api/v1/addresses/:addressid
// @access protect-user
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {addresses: {_id: req.params.addressid}},
      }, { new: true });
      res
        .status(200)
        .json({
          message: "address removed successfully",
          addresses: user.addresses,
        });
});

// @desc get logged user addresses
// @route get api/v1/addresses
// @access protect-user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user= await User.findById(req.user._id);
      res
        .status(200)
        .json({
          status: "success",
          addresses: user.addresses,
        });
});

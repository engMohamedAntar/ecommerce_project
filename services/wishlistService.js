const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc add product to wishList
// @route POST api/v1/wishlist
// @access protect-user
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: {wishList: req.body.product},
  }, { new: true });
  res
    .status(200)
    .json({
      message: "product added successfully to wishlist",
      wishList: user.wishList,
    });
});

// @desc Remove product from wishList
// @route DELETE api/v1/wishlist/:productid
// @access protect-user
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {wishList: req.params.productid},
      }, { new: true });
      res
        .status(200)
        .json({
          message: "product removed successfully from wishlist",
          wishList: user.wishList,
        });
});

// @desc get logged user wishList
// @route get api/v1/wishlist
// @access protect-user
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
    const user= await User.findById(req.user._id).populate({path:"wishList", select: "name"});
      res
        .status(200)
        .json({
          status: "success",
          wishList: user.wishList,
        });
});

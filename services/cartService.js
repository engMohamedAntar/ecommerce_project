const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Coupon= require('../models/couponModel');

const calcTotalCartPrice= (cart)=>{
  cart.totalPrice= cart.cartItems.reduce((acc, item)=> acc+= item.quantity* item.price, 0);
  cart.totalPriceAfterDiscount= undefined;
}

// @desc add product to logged user cart
// @route POST api/v1/cart
// @access protect-user
exports.addProductToShoppingCart = asyncHandler(async (req, res, next) => {
  const {productId, quantity=1, color}= req.body;
  //get logged user cart
  let cart= await Cart.findOne({user: req.user._id});
  const product= await Product.findById(productId);
  if(!product)
    return next(new ApiError('no product found', 404));

  if(!cart) {
    cart= await Cart.create({
      user: req.user._id,
      cartItems: [{product: productId, quantity, color, price: product.price}],
    })
  } else {
    //find weather product already exist in the cart
    const item= cart.cartItems.find(item=> item.product.toString()=== productId && item.color== color);
    if(item) {
      item.quantity+= quantity;      
    } else {
      cart.cartItems.push({product: productId, quantity, color, price: product.price})
    }
  }
  //calc totalPrice
  calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({ status: "success", numOfCartItems:cart.cartItems.length,  data: cart});
});

// @desc get logged user cart
// @route GET api/v1/cart
// @access protect-user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("No cart found for this user", 404));
  res.status(200).json({ status: "success", numOfCartItems:cart.cartItems.length, data: cart });
});

// @desc remove product from cart
// @route GET api/v1/cart/:productid
// @access protect-user
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  //get logged user cart
  const cart= await Cart.findOneAndUpdate({user: req.user._id}, {
    $pull: {cartItems: {product: req.params.productid}}
  }, {new: true});

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({ status: "success", numOfCartItems:cart.cartItems.length, data: cart });
});

// @desc delete logged user cart
// @route GET api/v1/cart
// @access protect-user
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc update cartItem quanity
// @route put api/v1/cart/itemid
// @access protect-user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart= await Cart.findOne({user: req.user._id});
  if (!cart) return next(new ApiError("No cart found for this user", 404));

  const item= cart.cartItems.find(item=> item._id.toString()===req.params.itemid);
  if(!item)
    return next(new ApiError("No item found for this itemid", 404));
  
  item.quantity= req.body.quantity;
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({ status: "success", numOfCartItems:cart.cartItems.length, data: cart });
});

// @desc update cartItem quanity
// @route put api/v1/cart/applycoupon
// @access protect-user
exports.applyCouponOnCart= asyncHandler(async (req,res,next)=>{
  //find logged user cart
  const cart= await Cart.findOne({user: req.user._id});
  if(!cart)
    return next(new ApiError('No cart found for this user', 404));

  //validate that coupon is valid
  const coupon= await Coupon.findOne({name: req.body.coupon});
  if(!coupon || coupon.expiryDate< Date.now())
    return next(new ApiError('Coupon is invalid or expired', 400));
  
  //update the cart totalPriceAfterDiscount
  cart.totalPriceAfterDiscount= cart.totalPrice - (cart.totalPrice * coupon.discount/100);
  await cart.save();
  res.status(200).json({status: 'success', message: "coupon applied", data: cart});
});
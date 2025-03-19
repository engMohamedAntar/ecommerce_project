//orderService.js
const stripe = require("stripe")(
  "sk_test_51Qj2UgKiTGea6E93jhLzMjg2LbSIPV5ZkrClz1jucGl1gJFHNVkp4SUSG3ruJvJp1fG1QpvrhlxmU7IZaM73ZS4j00KVO3uMIp"
);
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const factoryHandler = require("./factoryHandler");

// @desc create cash order
// @route POST api/v1/orders/:cartid
// @access protect-user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) get logged user cart
  const cart = await Cart.findById(req.params.cartid);
  if (!cart) return next(new ApiError("No cart found for this id", 404));

  // 2) get cart price
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) create cash order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    // 4) update products quantity and sold
    const bulkOption = order.cartItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Product.bulkWrite(bulkOption);

    // 5) clear cart
    await Cart.findByIdAndDelete(req.params.cartid);
  }

  // 6) return the response
  res.status(201).json({ status: "success", data: order });
});

//Only get orders of the logged user (used in the getAllOrders middleware)
exports.filterOrders = (req, res, next) => {
  let filterObj = {};
  if (req.user.role === "user") filterObj = { user: req.user._id };
  req.filterObj = filterObj;
  next();
};

// @desc get all orders
// @route POST api/v1/orders
// @access protect-user-admin
exports.getAllOrders = factoryHandler.getAll(Order);

// @desc get a single order
// @route GET api/v1/orders/:id
// @access protect-user-admin
exports.getSingleOrder = factoryHandler.getOne(Order);

// @desc update Order Status to paid
// @route PUT api/v1/orders/:id/pay
// @access private-admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true }
  );
  res.status(200).json({ status: "success", data: order });
});

// @desc update Order Status to deliverd
// @route PUT api/v1/orders/:id/deliver
// @access private-admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true }
  );
  res.status(200).json({ status: "success", data: order });
});

// @desc create checkout_session
// @route PUT api/v1/orders/:cartid/checkout_session
// @access private-admin
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  //get the cart
  const cart = await Cart.findById(req.params.cartid);
  if (!cart) {
    return next(new ApiError("No cart found for this ID", 404));
  }
  //get totalOrderPrice
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const user = await User.findById(cart.user);
  if (!user) return next(new ApiError("no user found for this id", 404));

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "Cart Order",
          },
          unit_amount: Math.round(totalOrderPrice * 100),
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    client_reference_id: req.params.cartid,
    customer_email: user.email,
    metadata: req.body.shippingAddress,
  });
  res.status(201).json({ status: "success", session });
});

exports.checkoutWebhook = asyncHandler(async (req, res, next) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("create order here");
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
});

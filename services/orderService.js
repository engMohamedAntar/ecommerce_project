//orderService.js
const stripe = require("stripe")(process.env.STRIPE_SECRET);
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

  // 6) return the res
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

// @desc create a checkout session
// @route POST api/v1/orders/checkoutSession/:cartid
// @access Protect/user
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  //calc totalCartPrice
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartid);
  if (!cart) return next(new ApiError("Cart not found", 404));
  const totalCartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = totalCartPrice + taxPrice + shippingPrice;

  //create a session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order by ${req.user.name}`,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    client_reference_id: req.params.cartid,
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: "success", session });
});

const createCardOrder = asyncHandler(async (session) => {
  console.log('Entered the createCardOrder function');
  
  const taxPrice = 0;
  const shippingPrice = 0;
  console.log(session);
  const totalOrderPrice = session.amount_total / 100;
  const cart = await Cart.findById(session.client_reference_id);
  const shippingAddress = session.metadata;

  const order = await Order.create({
    cartItems: cart.cartItems,
    totalOrderPrice,
    paymentMethod: "credit_card",
    isPaid: true,
    paidAt: Date.now(),
    shippingAddress,
    taxPrice,
    shippingPrice,
  });

  if (order) {
    //update products data
    const bulkOption = cart.cartItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Product.bulkWrite(bulkOption);
  }
  await Cart.findByIdAndDelete(session.client_reference_id);
  console.log('deleted the cart');
  
});

// @desc This webhook will run when stripe payment is success
// @route POST /webhook --> this route exist in server.js file
// @access Protected/User
exports.checkoutWebhook = asyncHandler((req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true, antoor: "zeroo" });
});

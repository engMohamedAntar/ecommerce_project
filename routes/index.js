const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const categoryRoute = require("./categoryRoute");
const wishListRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute= require("./shoppingCartRoute.js");
const orderRoute= require("./orderRoute.js");

const mounteRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports= mounteRoutes;
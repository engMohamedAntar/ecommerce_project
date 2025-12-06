//createApp.js
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { checkoutWebhook } = require("./services/orderService");

const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");
const compression = require("compression");
const mounteRoutes = require("./routes");

function createApp() {
  const app = express();
  //middlewares
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    checkoutWebhook
  );

  app.use(express.json());
  app.use(cors());
  app.options("*", cors());
  app.use(compression());

  app.use(express.static(path.join(__dirname, "uploads"))); //?

  if (process.env.ENVIRONMENT === "developement") {
    app.use(morgan("tiny"));
  }

  //Mount Routes
  mounteRoutes(app);

  app.all("*", (req, res, next) => {
    return next(new ApiError("This route not found", 404));
  });

  //Global globalError handler
  app.use(errorMiddleware);
  return app;
}
module.exports = createApp;

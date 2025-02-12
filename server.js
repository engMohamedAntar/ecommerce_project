//server.js
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config();

const dbConnection = require("./config/dbConnection");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");

//connect to DB
dbConnection();

const app = express();

//middlewares
app.use(express.json());

if (process.env.ENVIRONMENT === "developement") {
  app.use(morgan("tiny"));
}

//Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);

app.all("*", (req, res, next) => {
  return next(new ApiError("This route not found", 404));
});

//Global globalError handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`app connected to port ${PORT}`);
});

//Handle errors outside express
process.on("uncaughtException", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  //server.close() waits for pending requests and then close
  server.close(()=>{
    console.log('Shutting down!');
    process.exit(1);
  });
  
});

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config();
const dbConnection= require('./config/dbConnection');
const categoryRoute= require('./routes/categoryRoute');

//connect to DB
dbConnection();

const app = express();

//middlewares
app.use(express.json());

if (process.env.ENVIRONMENT === "developement") {
  app.use(morgan("tiny"));
}

//Mount Routes
app.use('/api/v1/categories', categoryRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app connected to port ${PORT}`);
});

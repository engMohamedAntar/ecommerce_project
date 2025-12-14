//server.js
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const createApp = require("./createApp");
//routes
const dbConnection = require("./config/dbConnection");


dbConnection();
const PORT = process.env.PORT || 5000;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`app connected to port ${PORT}`);
});

//Handle errors outside express
process.on("uncaughtException", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  //server.close() waits for pending requests and then close
  server.close(() => {
    console.log("Shutting down!");
    process.exit(1);
  });
});

/*
app.use(express.static(path.join(__dirname, 'uploads')));
This tells Express to serve static files (like images) from the uploads folder.
Now, if an image is saved in uploads/brands/image-123.jpeg,
you can access it directly via:http://localhost:3000/brands/image-123.jpeg
without needing a special route.
*/

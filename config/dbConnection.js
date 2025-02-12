const mongoose = require("mongoose");
const dbConnection = () => {
  //connect to database
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => console.log(`Database connected: ${conn.connection.host}`));
};
module.exports= dbConnection;
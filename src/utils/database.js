const mongoose = require("mongoose");

const MONGODB_URI =
  "";

const mongooseConnect = (callback) => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log("Mongoose Connected");
      callback();
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.mongooseConnect = mongooseConnect;

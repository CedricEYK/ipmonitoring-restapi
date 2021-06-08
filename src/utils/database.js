const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://cedDev:TLPE5k6p6tPkxEQM@cluster0.stbqe.mongodb.net/IPMonitoringDB?retryWrites=true&w=majority";

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

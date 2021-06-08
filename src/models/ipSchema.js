const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ipSchema = new Schema({
  ip: {
    type: String,
  },
  type: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  org: {
    type: String,
  },
  isp: {
    type: String,
  },
  timezone: {
    type: String,
  },
});

module.exports = mongoose.model("ipaddress", ipSchema);

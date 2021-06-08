const IpSchema = require("../models/ipSchema");
const axios = require("axios");

const rapidAPIBaseUrl =
  "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/?ip=";

const header = {
  "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
  "x-rapidapi-key": "87368ce6f1mshc3ce22ae7d5657ap1b2a7djsn885939c216dd",
  useQueryString: true,
};

var options = {
  headers: header,
};

exports.handleShow = (req, res, next) => {
  const query = req.params.ip;
  const searchUrl = rapidAPIBaseUrl + query;
  axios.request(searchUrl, options).then((response) => {
    console.log(response.data);
  });
};

exports.handleCreate = (req, res, next) => {
  const query = req.params.ip;
  const searchUrl = rapidAPIBaseUrl + query;
  axios
    .request(searchUrl, options)
    .then((response) => {
      let data = response.data;
      return data;
    })
    .then((data) => {
      const ip = new IpSchema({
        ip: data.ip,
        type: data.type,
        country: data.country,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        org: data.org,
        isp: data.isp,
        timezone: data.timezone,
      });
      ip.save().then((ip) => {
        console.log(ip);
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.handleReadAll = (req, res, next) => {
  IpSchema.find().then((ips) => {
    console.log(ips);
  });
};

exports.handleReadSingle = (req, res, next) => {
  const ipAddress = req.params.ipa;
  IpSchema.findOne({ ip: ipAddress })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.handleDeleteSingle = (req, res, next) => {
  const ipAddress = req.params.ipa;
  IpSchema.findOneAndDelete({ ip: ipAddress })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

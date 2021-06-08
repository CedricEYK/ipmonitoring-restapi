// const http = require("http"); // to create server
// const url = require("url"); // to parse url
// const https = require("https"); // to send https requests

// var ip_table = new Map(); // for simplicity using has map to store ip details instead of db

// // create basic server and implement handling different requests
// const app = http.createServer(async (req, res) => {
//   // parse the incoming url
//   const parsedURL = url.parse(req.url, true);

//   //check for  POST /api/ipmon/ip
//   if (parsedURL.pathname === "/api/ipmon/ip" && req.method === "POST") {
//     // check if ip is prsent in query else send error
//     if (!parsedURL.query.ip) {
//       res.statusCode = 400;
//       res.end("IP address is required, please add IP address in the query");
//     } else {
//       handleCreate(parsedURL.query.ip, res);
//     }
//   }
//   //check for GET /api/ipmon/ip/show
//   else if (
//     parsedURL.pathname === "/api/ipmon/ip/show" &&
//     req.method === "GET"
//   ) {
//     handleShow(res);
//   }
//   //check for  PUT /api/ipmon/ip/{ip_address}
//   else if (
//     parsedURL.pathname.startsWith("/api/ipmon/ip") &&
//     req.method === "PUT"
//   ) {
//     var ipAddr = extractIPAddress(parsedURL.pathname);

//     if (!ipAddr.length) {
//       res.statusCode = 400;
//       res.end("Invalid IP Address");
//     } else {
//       handleUpdate(ipAddr, res);
//     }
//   }
//   //check for  DELETE /api/ipmon/ip/{ip_address}
//   else if (
//     parsedURL.pathname.startsWith("/api/ipmon/ip") &&
//     req.method === "DELETE"
//   ) {
//     var ipAddr = extractIPAddress(parsedURL.pathname);

//     if (!ipAddr.length) {
//       res.statusCode = 400;
//       res.end("Invalid IP Address");
//     } else {
//       handleDelete(ipAddr, res);
//     }
//   }
//   //check for GET /api/ipmon/ip/{ip_address}
//   else if (
//     parsedURL.pathname.startsWith("/api/ipmon/ip") &&
//     req.method === "GET"
//   ) {
//     var ipAddr = extractIPAddress(parsedURL.pathname);

//     if (!ipAddr.length) {
//       res.statusCode = 400;
//       res.end("Invalid IP Address");
//     } else {
//       handleRead(ipAddr, res);
//     }
//   }
//   // if url doent match any send error
//   else {
//     res.statusCode = 400;
//     res.end("API Endpoint Not Supported");
//   }
// }); //End of create server.

// // function to handle create
// function handleCreate(ip, res) {
//   // call geolocation api and get the details
//   getGeolocation(ip).then(
//     (response) => {
//       // update the database - map in this case
//       updateTable(response);
//       // set the header and status code success and return the details of the ip
//       res.setHeader("content-type", "Application/json");
//       res.statusCode = 200;
//       res.end(JSON.stringify(ip_table.get(ip)));
//     },
//     (error) => {
//       res.statusCode = 400;
//       res.end(error);
//     }
//   );
// } //End of handle create

// // function to handle show
// function handleShow(res) {
//   // set the header and status
//   res.setHeader("content-type", "Application/json");
//   res.statusCode = 200;
//   // create an array from the map
//   array = Array.from(ip_table, ([name, value]) => ({ name, value }));
//   // send the response array
//   res.end(JSON.stringify(array));
// } //End of handle show

// // function to handle read request
// function handleRead(ip, res) {
//   // check if the ip is present in table
//   if (ip_table.has(ip)) {
//     // set header, status code and send the entry
//     res.setHeader("content-type", "Application/json");
//     res.statusCode = 200;
//     res.end(JSON.stringify(ip_table.get(ip)));
//   } else {
//     // ip not found send error
//     res.statusCode = 404;
//     res.end("Read: IP " + ip + " not found");
//   }
// } //End of handle read

// // function to handle delete request
// function handleDelete(ip, res) {
//   // check if ip is in the table
//   if (ip_table.has(ip)) {
//     // delete and send the success response
//     ip_table.delete(ip);
//     res.statusCode = 200;
//     res.end("Delete:  " + ip + " deleted");
//   } else {
//     // ip not found send error
//     res.statusCode = 404;
//     res.end("Delete: IP  " + ip + " not found");
//   }
// } //End of handle delete

// // function to handle update request
// function handleUpdate(ip, res) {
//   // check if the ip is present in table
//   if (ip_table.has(ip)) {
//     // update the details by calling geoplocation api
//     getGeolocation(ip).then(
//       (response) => {
//         // set header, status code, update table and send response
//         res.setHeader("content-type", "Application/json");
//         res.statusCode = 200;
//         updateTable(response);
//         res.end(JSON.stringify(ip_table.get(ip)));
//       },
//       (error) => {
//         // send error
//         res.statusCode = 400;
//         res.end(error);
//       }
//     );
//   } else {
//     // ip not found in table so send error
//     res.statusCode = 404;
//     res.end("Update: IP " + ip + " not tracked");
//   }
// } //End of handle update

// const rapidAPIBaseUrl = "https://rapidapi.p.rapidapi.com/json/?ip=";

// function getGeolocation(ipAddress) {
//   // initilize http.rquest object
//   var req = https.request;
//   // initialize header with the required information to call geolocation api.
//   var header = {
//     "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
//     "x-rapidapi-key": "87368ce6f1mshc3ce22ae7d5657ap1b2a7djsn885939c216dd",
//     useQueryString: true,
//   };
//   // add the query string including the IP address
//   var query_string = { ip: ipAddress };
//   // set the options parameter
//   var options = {
//     headers: header,
//     query: query_string,
//   };
//   // form the url
//   const url = rapidAPIBaseUrl + ipAddress;

//   return new Promise((resolve, reject) => {
//     https.get(url, options, (res) => {
//       let data = "";
//       //data is received in chunks, so uppend data as and when received
//       res.on("data", function (response) {
//         data = data + response;
//       });
//       // handle error if any
//       res.on("error", function (err) {
//         console.log("Error");
//         console.log(err);
//       });
//       // if end of data return the final chunk
//       res.on("end", () => {
//         resolve(JSON.parse(data));
//       });
//     }); //Endn of http
//   }); //end of return promise
// } //End of getGeolocation

// function updateTable(entry) {
//   // get current date to update last update the time
//   var time = new Date();
//   // add the entry to table ip is the key and country, city and last updated time are stored
//   ip_table.set(entry.ip, {
//     ip: entry.ip,
//     country: entry.country,
//     city: entry.city,
//     lastUpdated: time,
//   });
// }

// function extractIPAddress(path) {
//   var ipAddress = path.substring(path.lastIndexOf("/") + 1, path.length);

//   if (
//     /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
//       ipAddress
//     )
//   ) {
//     return ipAddress;
//   } else {
//     console.log("invalid IP Address");
//     return "";
//   }
// } // End of extractIPAddress

// app.listen(4000);

// express mongodb version

const express = require("express");
const app = express();
const url = require("url"); // to parse url
const https = require("https"); // to send https requests
const mongoClient = require("mongodb").MongoClient;

// initialize geolocation api base url
const rapidAPIBaseUrl = "https://rapidapi.p.rapidapi.com/json/?ip=";

// create basic server and implement handling different requests

app.listen(4000, function () {
  initialize();
  console.log("listening on 4000");
});

function initialize() {
  const uri =
    "mongodb+srv://cedDev:TLPE5k6p6tPkxEQM@cluster0.stbqe.mongodb.net/IPMonitoringDB?retryWrites=true&w=majority";
  const client = new mongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) {
      console.log("error");
      console.log(err);
      client.close();
    } else {
      console.log("connected to db ");
      const geoCollection = client.db("geo").collection("geolocation");
      app.post("/api/ipmon/ip", function (req, res) {
        console.log("in POST /api/ipmon/ip");
        const parsedURL = url.parse(req.url, true);
        handleCreate(req.query.ip, res, geoCollection);
      });
      app.get("/api/ipmon/ip/show", function (req, res) {
        console.log("in GET /api/ipmon/ip/show");
        handleShow(res, geoCollection);
      });
      app.get("/api/ipmon/ip/:ipa", function (req, res) {
        console.log("in GET /api/ipmon/ip/");
        const parsedURL = url.parse(req.url, true);
        handleRead(req.params.ipa, res, geoCollection);
      });
      app.put("/api/ipmon/ip/:ipa", function (req, res) {
        console.log("in PUT /api/ipmon/ip/");
        const parsedURL = url.parse(req.url, true);
        handleUpdate(req.params.ipa, res, geoCollection);
      });
      app.delete("/api/ipmon/ip/:ipa", function (req, res) {
        console.log("in DELETE /api/ipmon/ip/");
        const parsedURL = url.parse(req.url, true);
        handleDelete(req.params.ipa, res, geoCollection);
      });
    }
  });
}

/* function to handle create */
function handleCreate(ip, res, geoCollection) {
  // call geolocation api and get the details
  getGeolocation(ip).then(
    (response) => {
      if (response.success) {
        insertRecord(response, geoCollection);
        // set the header and status code success and return the details of the ip
        res.setHeader("content-type", "Application/json");
        res.statusCode = 200;
        res.end("record created : " + ip);
      } else {
        res.statusCode = 400;
        res.end(response.message);
      }
    },
    (error) => {
      res.statusCode = 400;
      res.end(error);
    }
  );
}

/* function to handle show*/
function handleShow(res, db) {
  //db.collection('geolocation').find({},{projection:{_id:0}}).toArray()
  db.find({}, { projection: { _id: 0 } })
    .toArray()
    .then((results) => {
      // set the header and status
      res.setHeader("content-type", "Application/json");
      res.statusCode = 200;
      // create an array from the map
      res.send(JSON.stringify(results));
    })
    .catch((error) => console.error(error));
}

/* function to handle update */
function handleUpdate(ipAddress, res, db) {
  // call geolocation api and get the details
  var query = { ip: ipAddress };
  db.find(query, { projection: { _id: 0 } })
    .toArray()
    .then((results) => {
      if (results.length > 0) {
        getGeolocation(ipAddress).then(
          (response) => {
            updateRecord(response, db);
            // set the header and status code success and return the details of the ip
            res.setHeader("content-type", "Application/json");
            res.statusCode = 200;
            var time = new Date();
            var respJson = {
              ip: response.ip,
              country: response.country,
              city: response.city,
              lastUpdated: time,
            };
            res.end("record updated : " + JSON.stringify(respJson));
          },
          (error) => {
            res.statusCode = 400;
            res.end(error);
          }
        );
      } else {
        // ip not found send error
        res.statusCode = 400;
        res.send("Read : " + ipAddress + " not found");
      }
    });
}

/* function to handle read request */
function handleRead(ipAddress, res, db) {
  // check if the ip is present in table
  var query = { ip: ipAddress };
  db.find(query, { projection: { _id: 0 } })
    .toArray()
    .then((results) => {
      if (results.length > 0) {
        // set header, status code and send the entry
        console.log("results:");
        console.log(results);
        res.setHeader("content-type", "Application/json");
        res.statusCode = 200;
        res.send(JSON.stringify(results));
      } else {
        // ip not found send error
        res.statusCode = 400;
        res.send("Read : " + ipAddress + " not found");
      }
    });
}

/* function to handle delete */
function handleDelete(ipAddress, res, db) {
  // check if ip is in the table
  var query = { ip: ipAddress };
  db.deleteOne(query, function (err, obj) {
    if (err) {
      res.statusCode = 400;
      res.send("delete :  " + ipAddress + " not found");
    }
    // n in results indicates the number of records deleted
    if (obj.result.n == 0) {
      res.statusCode = 400;
      res.send("delete :  " + ipAddress + " not found");
    } else {
      res.statusCode = 200;
      res.send("record deleted :  " + ipAddress);
    }
  });
}

function getGeolocation(ipAddress) {
  // initilize http.rquest object
  var req = https.request;
  // initialize header with the required information to call geolocation api.
  var header = {
    "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
    "x-rapidapi-key": "87368ce6f1mshc3ce22ae7d5657ap1b2a7djsn885939c216dd",
    useQueryString: true,
  };
  // add the query string including the IP address
  var query_string = { ip: ipAddress };
  // set the options parameter
  var options = {
    headers: header,
    query: query_string,
  };
  // form the url
  const url = rapidAPIBaseUrl + ipAddress;

  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = "";
      //data is received in chunks, so uppend data as and when received
      res.on("data", function (response) {
        data = data + response;
      });
      // handle error if any
      res.on("error", function (err) {
        console.log("Error");
        console.log(err);
      });
      // if end of data return the final chunk
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    }); //Endn of http
  }); //end of return promise
} //End of getGeolocation

function insertRecord(entry, geoCollection) {
  // get current date to update last update the time

  var time = new Date();
  // add the entry to table ip is the key and country, city and last updated time are stored
  data = {
    ip: entry.ip,
    country: entry.country,
    city: entry.city,
    lastUpdated: time,
  };
  geoCollection
    .insertOne(data)
    .then((result, error) => {
      if (error) {
        console.log(error);
      }
    })
    .catch((error) => console.error("error"));
}
function updateRecord(entry, geoCollection) {
  // get current date to update last updated time
  var time = new Date();
  // add the entry to table ip is the key and country, city and last updated time are stored
  var query = { ip: entry.ip };
  data = {
    $set: {
      ip: entry.ip,
      country: entry.country,
      city: entry.city,
      lastUpdated: time,
    },
  };
  geoCollection
    .updateOne(query, data)
    .then((result, error) => {})
    .catch((error) => console.error("error"));
}

const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "z5nqIySabxzrULIRV5fSCGIfP1gGF98p",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

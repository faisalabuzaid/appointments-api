const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
module.exports = function () {
  app.use(helmet());
  app.use(compression());
};

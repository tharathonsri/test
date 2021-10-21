require("dotenv").config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //preprod

const express = require('./config/express');
const { UTILITY_PORT } = require("./config/config");
const port = UTILITY_PORT || 3001

const app = express();

const server = app.listen(port);

console.warn('env [' + process.env.NODE_ENV + '] Express server listening on port ' + port);

module.exports = server;

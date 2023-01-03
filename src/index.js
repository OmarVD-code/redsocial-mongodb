const express = require('express');

const config = require('./server/config.js');

// database
require('./database.js');

const app = config(express());

module.exports = app;

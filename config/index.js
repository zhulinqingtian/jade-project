'use strict';

var path = require('path');
var extend = require('xtend');

var config = {};
if (global.MY && global.MY.isProduction) {
  config.www = {
    homePage:'',
    port: 10001
  }
} else {
  var port = 10001;
  config.www = {
    homePage:'http://localhost:' + port,
    port:port
  }
}

global.MY = extend(global.MY, config);
'use strict';
require('./config');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

var config = global.MY;
var isProduction = config.isProduction;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
if (!isProduction) {
  app.use(errorHandler());
}

/**
 * 页面访问（没有模块化之前）
 * 现在迁移到路由下面，由controller控制
 * ================================
 */
// app.get('/double-eleven-page', function (req, res) {
//   res.render('double-eleven-page');
// });
// app.get('/double-eleven-storage-period', function (req, res) {
//   res.render('double-eleven-storage-period');
// });

/**
 * 接口验证
 * ==========
 */
// var suggestion = require("www/controllers/v3/suggestion");
// app.post('/addSuggestion', suggestion.addSuggestion);

var routes = require('./routes');
routes.setup(app);

if (!module.parent) {
  var port = config.www.port;
  app.listen(port, function () {
    console.log("WWW server listening on port %d in %s mode", port, app.settings.env);
  });
}

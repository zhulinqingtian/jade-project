'use strict';
var render = require('./render');

exports.index = function (req, res) {
  render(req, res, 'home-page', {title:'首页'});
};
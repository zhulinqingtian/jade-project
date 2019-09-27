'use strict';
var render = require('./render');

exports.index = function (req, res) {
  render(req, res, 'double-eleven-page', {title:'双十一预热'});
};
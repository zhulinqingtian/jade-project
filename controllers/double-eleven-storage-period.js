'use strict';
var render = require('./render');

exports.index = function (req, res) {
  render(req, res, 'double-eleven-storage-period', {title:'双十一蓄水期'});
};
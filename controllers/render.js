/**
 *
 * 前后端传数据
 */
var config = require('../public/js/config'); // 页面js配置
var scriptsMap = {};

var version = new Date().getTime();

var homePage = global.MY.www.homePage;

exports = module.exports = function (req, res, view, locals) {
  locals = locals || {};
  locals.viewName = view;
  locals.scripts = scriptsMap[view];
  locals.version = version;
  locals.wwwHomePage = homePage;
  return res.render(view, locals);
};

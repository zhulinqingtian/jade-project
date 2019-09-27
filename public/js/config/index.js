/**
 * javascript 配置
 * 格式：{
 *   view名称: {
 *     生成js名称: 生成规则
 *   }
 * }
 * 生成规则有3种：
 * 1. 字符串
 *   字符串所指定的js将会被拷贝到目标目录
 * 2. 数组
 *   数组中的js会被合并后写入到目标目录
 * 3. 对象
 *   格式为 {生成方法：js数组}，目前只有一种生成方法 browserify。
 *   js将通过browserify编译并压缩后写入到目标目录，同时也会生成source map文件
 */
var L = {
  "jquery@3.3.1": "thirdparty/jquery-3.3.1.min",
  "bootstrap": "thirdparty/bootstrap.min"
};

exports = module.exports = {
  'double-eleven-page': {
    'jquery@3.3.1':L['jquery@3.3.1'],
    'bootstrap': L['bootstrap'],
    'double-eleven-page.lib': [],
    'double-eleven-page':{
      'browserify':['double-eleven-page']
    }
  },
  'double-eleven-storage-period': {
    'jquery@3.3.1':L['jquery@3.3.1'],
    'bootstrap': L['bootstrap'],
    'double-eleven-storage-period.lib': [],
    'double-eleven-storage-period':{
      'browserify':['double-eleven-storage-period']
    }
  },
};

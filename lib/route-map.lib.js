var path = require('path');
var _ = require('lodash');
var router = require('express').Router();
var requireAll = require('require-all');
var routerTable = require('../core/map/router');

/**
 * 读取控制器
 */
var controllers = requireAll({
  dirname: path.join(__dirname, '../core/controllers/'),
  filter: /(.+)\.controller\.js$/
});

/**
 * 递归绑定控制器
 */
(function loop (map, route) {
  route = route || '';
  _.forEach(map, function (value, key) {
    if (_.isObject(value) && !_.isArray(value)) {
      loop(value, route + key);
    } else {
      var controller = value.split('.')[0];
      var action = value.split('.')[1];

      if (action) {
        router[key](route, controllers[controller][action]);
      } else if (controller) {
        router[key](route, controllers[controller]);
      }
    }
  });
})(routerTable);

module.exports = router;
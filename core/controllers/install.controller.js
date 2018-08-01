var async = require('async');
var database = require('../../lib/database.lib');
var installService = require('../services/install.service');

/**
 * 根据安装状态跳转前台页面
 */
exports.access = function (req, res, next) {
  installService.status(function (err, hasInstall) {
    if (err) {
      return res.status(500).end();
    }

    if (hasInstall) {
      next();
    } else {
      res.sendFile('notInstalled.html', { root: './public/assets/admin/' });
    }
  });
};

/**
 * 查询安装状态
 */
exports.status = function (req, res) {
  installService.status(function (err, hasInstall) {
    if (err) {
      return res.status(500).end();
    }

    if (hasInstall) {
      res.status(200).json({ hasInstall: true });
    } else {
      res.status(200).json({ hasInstall: false });
    }
  });
};

/**
 * 测试数据库
 */
exports.testDatabase = function (req, res) {
  req.checkBody({
    'host': {
      notEmpty: {
        options: [true],
        errorMessage: 'host 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'host 格式不正确'
      }
    },
    'port': {
      notEmpty: {
        options: [true],
        errorMessage: 'port 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'port 需为整数'
      }
    },
    'db': {
      notEmpty: {
        options: [true],
        errorMessage: 'database 不能为空'
      },
      isString: { errorMessage: 'database 需为字符串' }
    },
    'user': {
      notEmpty: {
        options: [true],
        errorMessage: 'user 不能为空'
      },
      isString: { errorMessage: 'user 需为字符串' }
    },
    'pass': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isString: { errorMessage: 'password 需为字符串' }
    }
  });

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var data = {
    host: req.body.host,
    port: req.body.port,
    db: req.body.db,
    user: req.body.user,
    pass: req.body.pass
  };

  async.series([
    // 检查安装状态
    function (callback) {
      installService.status(function (err, hasInstall) {
        if (err) return callback(err);

        if (hasInstall) {
          var err = {
            type: 'system',
            error: '非法调用，NoderIotSys 已经安装'
          };
          return callback(err);
        }

        callback();
      });
    },
    // 测试数据库连接
    function (callback) {
      database.test(data, function (err) {
        if (err) return callback(err);

        callback();
      });
    }
  ], function (err) {
    if (err) {
      return res.status(400).end();
    }

    res.status(204).end();
  });
};

/**
 * 安装
 */
exports.install = function (req, res) {
  req.checkBody({
    'databaseHost': {
      notEmpty: {
        options: [true],
        errorMessage: 'databaseHost 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'databaseHost 格式不正确'
      }
    },
    'databasePort': {
      notEmpty: {
        options: [true],
        errorMessage: 'databasePort 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'databasePort 需为整数'
      }
    },
    'database': {
      notEmpty: {
        options: [true],
        errorMessage: 'database 不能为空'
      },
      isString: { errorMessage: 'database 需为字符串' }
    },
    'databaseUser': {
      notEmpty: {
        options: [true],
        errorMessage: 'databaseUser 不能为空'
      },
      isString: { errorMessage: 'databaseUser 需为字符串' }
    },
    'databasePassword': {
      notEmpty: {
        options: [true],
        errorMessage: 'databasePassword 不能为空'
      },
      isString: { errorMessage: 'databasePassword 需为字符串' }
    },
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      matches: {
        options: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
        errorMessage: 'email 格式不正确'
      }
    },
    'nickname': {
      notEmpty: {
        options: [true],
        errorMessage: 'nickname 不能为空'
      },
      isString: { errorMessage: 'nickname 需为字符串' }
    },
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于 6 位'
      }
    }
  });

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var databaseDate = {
    host: req.body.databaseHost,
    port: req.body.databasePort,
    db: req.body.database,
    user: req.body.databaseUser,
    pass: req.body.databasePassword
  };

  var userDate = {
    email: req.body.email,
    nickname: req.body.nickname,
    password: req.body.password
  };

  async.auto({
    status: function (callback) {
      installService.status(function (err, hasInstall) {
        if (err) return callback(err);

        if (hasInstall) {
          var err = {
            type: 'system',
            error: 'NoderIotSys 已经安装'
          };
          return callback(err);
        }
        callback();
      });
    },
    install: ['status', function (callback) {
      installService.install({
        databaseDate: databaseDate,
        userDate: userDate
      }, function (err, install) {
        if (err) return callback(err);
        callback(null, install);
      });
    }]
  }, function (err) {
    if (err) {
      return res.status(500).end();
    }
    res.status(204).end();
  });
};